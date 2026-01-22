import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  readdirSync,
  statSync,
} from "node:fs";
import { join } from "node:path";
import { XMLParser } from "fast-xml-parser";
import {
  BudgetType,
  BudgetSource,
  type BudgetLine,
  type BudgetData,
  type ConcoursLine,
} from "../src/types/budget";
import type { Loan, LoanData } from "../src/types/loan";
import type { Apcp, ApcpData } from "../src/types/apcp";

// Configuration
const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024];
const DATA_ROOT = join(process.cwd(), "data/M3M-CA");
const OUTPUT_DIR = join(process.cwd(), "src/content/data");

// Nomenclatures and Static Data
const nomenclaturesPath = join(
  process.cwd(),
  "src/content/data/budget_nomenclatures.json",
);
const nomenclatures = JSON.parse(readFileSync(nomenclaturesPath, "utf-8"));
const NATURE_LABELS = nomenclatures.natures as Record<string, string>;
const FONCTION_LABELS = nomenclatures.fonctions as Record<string, string>;

const COMMUNES_FILE = "src/content/data/communes.json";
const MAPPING_FILE = "src/content/data/apcp_communes_mapping.json";
const COMMUNES_DATA: { name: string; population: number }[] = JSON.parse(
  readFileSync(join(process.cwd(), COMMUNES_FILE), "utf-8"),
);
const COMMUNES = COMMUNES_DATA.map((c) => c.name);
const MANUAL_MAPPING: Record<string, string[]> = JSON.parse(
  readFileSync(join(process.cwd(), MAPPING_FILE), "utf-8"),
);

// XML Parser
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
});

// Helpers
function getVal(node: any): any {
  if (node === undefined) return undefined;
  return node.V || node;
}

function resolveNatureLabel(code: string, map: Record<string, string>): string {
  if (map[code]) return map[code];
  if (code.length > 3 && map[code.substring(0, 3)])
    return map[code.substring(0, 3)];
  if (code.length > 2 && map[code.substring(0, 2)])
    return map[code.substring(0, 2)];
  return code;
}

function resolveFunctionLabel(code: string | undefined): string | undefined {
  if (!code) return undefined;
  const cleanCode = code.replace(/-/g, "");

  if (FONCTION_LABELS[cleanCode]) return FONCTION_LABELS[cleanCode];

  if (cleanCode.startsWith("90") || cleanCode.startsWith("93")) {
    if (FONCTION_LABELS[cleanCode.substring(0, 3)])
      return FONCTION_LABELS[cleanCode.substring(0, 3)];
    const suffix = cleanCode.substring(2);
    if (FONCTION_LABELS[suffix]) return FONCTION_LABELS[suffix];
    if (suffix.length > 1 && FONCTION_LABELS[suffix.substring(0, 2)])
      return FONCTION_LABELS[suffix.substring(0, 2)];
    if (suffix.length > 0 && FONCTION_LABELS[suffix.substring(0, 1)])
      return FONCTION_LABELS[suffix.substring(0, 1)];
  } else {
    if (code.length > 2 && FONCTION_LABELS[code.substring(0, 2)])
      return FONCTION_LABELS[code.substring(0, 2)];
    if (code.length > 1 && FONCTION_LABELS[code.substring(0, 1)])
      return FONCTION_LABELS[code.substring(0, 1)];
  }
  return undefined;
}

function extractApcpId(rawString: string): string | undefined {
  if (!rawString) return undefined;
  const parts = rawString.trim().split(/\s+/);
  if (parts.length >= 2) return parts[1];
  return parts[0];
}

function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  return str.replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16)),
  );
}

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/-/g, " ");
}

function detectCommunes(text: string): string[] {
  const normalizedText = normalize(text);
  const detected: string[] = [];

  for (const commune of COMMUNES) {
    const normalizedCommune = normalize(commune);
    if (normalizedText.includes(normalizedCommune)) {
      detected.push(commune);
    }
  }
  return detected;
}

function identifyBudgetSource(libelle: string): BudgetSource | null {
  const upper = libelle.toUpperCase();
  if (upper.includes("PRINCIPAL")) return BudgetSource.Principal;
  if (upper.includes("PARKING")) return BudgetSource.Parking;
  if (upper.includes("ASSAINISSEMENT")) return BudgetSource.Assainissement;
  if (upper.includes("EAU")) return BudgetSource.Eau;
  if (upper.includes("TRANSPORT")) return BudgetSource.Transport;
  if (upper.includes("SPANC")) return BudgetSource.Spanc;
  return null;
}

// Processing Logic
async function processYear(year: number) {
  console.log(`Processing Year ${year}...`);

  const yearDir = join(DATA_ROOT, `MMM_MMM_CA_${year}`);

  let files: string[] = [];
  try {
    if (statSync(yearDir).isDirectory()) {
      files = readdirSync(yearDir)
        .filter((f) => f.toLowerCase().endsWith(".xml"))
        .map((f) => join(yearDir, f));
    }
  } catch (e) {
    console.warn(`Directory not found for ${year}: ${yearDir}`, e);
    return;
  }

  const budgetLines: BudgetLine[] = [];
  const loans: Loan[] = [];
  const apcpsMap = new Map<string, Apcp>();
  const concoursLines: ConcoursLine[] = [];

  for (const file of files) {
    console.log(`  Reading ${file}...`);
    try {
      const xmlContent = readFileSync(file, "latin1");
      const jsonObj = parser.parse(xmlContent);
      const doc = jsonObj.DocumentBudgetaire;
      const budget = doc.Budget;

      const natDec = getVal(budget.BlocBudget?.NatDec);

      const libelleEtab = getVal(budget.EnTeteBudget.LibelleEtab);
      const source = identifyBudgetSource(libelleEtab);

      if (!source) {
        console.warn(`    Unknown budget source: ${libelleEtab} in ${file}`);
        continue;
      }

      // --- Budget Lines ---
      const xmlLabelsMap: Record<string, string> = {};
      const ventilation = budget.Annexes?.DATA_VENTILATION?.VENTILATION;
      if (ventilation) {
        const ventArray = Array.isArray(ventilation)
          ? ventilation
          : [ventilation];
        ventArray.forEach((v: any) => {
          const art = getVal(v.CodArticle);
          const lib = getVal(v.LibCpte);
          if (art && lib) xmlLabelsMap[art] = lib;
        });
      }

      const lines = budget.LigneBudget
        ? Array.isArray(budget.LigneBudget)
          ? budget.LigneBudget
          : [budget.LigneBudget]
        : [];
      lines.forEach((l: any, index: number) => {
        const nature = getVal(l.Nature);
        const fonction = getVal(l.Fonction);
        const codeRD = getVal(l.CodRD);

        const mtPrev = parseFloat(getVal(l.MtPrev) || "0");
        const rawMtReal = parseFloat(getVal(l.MtReal) || "0");
        const mtReal = natDec === "09" ? rawMtReal : 0;

        if (mtPrev === 0 && mtReal === 0) return;

        let natureChapitre = nature.substring(0, 2);
        if (nature.startsWith("0")) natureChapitre = nature.substring(0, 3);

        const natureLabel =
          xmlLabelsMap[nature] || resolveNatureLabel(nature, NATURE_LABELS);
        const natureChapitreLabel = resolveNatureLabel(
          natureChapitre,
          NATURE_LABELS,
        );
        const fonctionLabel = resolveFunctionLabel(fonction);

        let apcp_id: string | undefined = undefined;
        if (l.CaracSup) {
          const caracSupArray = Array.isArray(l.CaracSup)
            ? l.CaracSup
            : [l.CaracSup];
          const progAutoNode = caracSupArray.find(
            (c: any) => c.Code === "ProgAutoNum",
          );
          if (progAutoNode) {
            apcp_id = extractApcpId(getVal(progAutoNode));
          }
        }

        budgetLines.push({
          id: `${year}-${source}-${index}`,
          type: codeRD === "D" ? BudgetType.Depense : BudgetType.Recette,
          budget: source,
          nature_code: nature,
          nature_label: natureLabel,
          nature_chapitre: natureChapitre,
          nature_chapitre_label:
            natureChapitreLabel !== natureChapitre
              ? natureChapitreLabel
              : undefined,
          fonction_code: fonction,
          fonction_label: fonctionLabel,
          montant_vote: mtPrev,
          montant_realise: mtReal,
          operation_reelle: getVal(l.OpBudg) === "0",
          apcp_id: apcp_id,
        });
      });

      // --- Loans ---
      const rawLoans = budget.Annexes?.DATA_EMPRUNT?.EMPRUNT;
      if (rawLoans) {
        const loansArray = Array.isArray(rawLoans) ? rawLoans : [rawLoans];
        loansArray.forEach((l: any, index: number) => {
          loans.push({
            id: `${year}-${source}-${index}`,
            budget: source,
            libelle: getVal(l.ObjEmpr) || "Sans libellé",
            numero_contrat: getVal(l.NumContrat) || "Inconnu",
            preteur: getVal(l.LibOrgaPreteur) || "Inconnu",
            type_preteur: getVal(l.CodTypPreteur),
            date_signature: getVal(l.DtSignInit),
            date_emission: getVal(l.DtEmission),
            annee_encaisse: parseInt(getVal(l.AnEncaisse) || "0"),
            montant_initial: parseFloat(getVal(l.MtEmprOrig) || "0"),
            duree_initiale: parseFloat(getVal(l.DureeContratInit) || "0"),
            duree_restante: parseFloat(getVal(l.DureeRest) || "0"),
            type_taux: getVal(l.CodTyptxInit),
            index_taux: getVal(l.IndexTxVariInit),
            taux_initial: parseFloat(getVal(l.TxActuaInit) || "0"),
            taux_actuel: parseFloat(getVal(l.TxActua) || "0"),
            taux_marge: getVal(l.TxMaxi) || getVal(l.TxMini),
            capital_rembourse_exercice: parseFloat(
              getVal(l.MtCapitalExer) || "0",
            ),
            interets_payes_exercice: parseFloat(getVal(l.MtIntExer) || "0"),
            annuite_totale: parseFloat(getVal(l.AnnuitNetDette) || "0"),
            profil_amortissement: getVal(l.CodProfilAmort),
            capital_restant_debut: parseFloat(
              getVal(l.MtCapitalRestDu_01_01) || "0",
            ),
            capital_restant_fin: parseFloat(
              getVal(l.MtCapitalRestDu_31_12) || "0",
            ),
          });
        });
      }

      // --- APCP ---
      const rawApcps = budget.Annexes?.DATA_APCP?.APCP;
      if (rawApcps) {
        const apcpArray = Array.isArray(rawApcps) ? rawApcps : [rawApcps];
        for (const raw of apcpArray) {
          const id = extractApcpId(getVal(raw.NumAutori));
          if (!id) continue;

          if (!apcpsMap.has(id)) {
            const libelle = decodeHtmlEntities(
              getVal(raw.LibAutori) || "Sans libellé",
            );
            const detected = detectCommunes(libelle);
            const manual = MANUAL_MAPPING[id] || [];
            const mergedCommunes = Array.from(
              new Set([...detected, ...manual]),
            ).sort();

            apcpsMap.set(id, {
              id,
              libelle,
              chapitre: getVal(raw.Chapitre) || "",
              montant_ap_vote_anterieur: parseFloat(
                getVal(raw.MtAutori_NMoins1) || "0",
              ),
              cp_vote: 0,
              cp_realise: 0,
              cp_reste_a_realiser: 0,
              nombre_lignes: 0,
              communes: mergedCommunes,
            });
          }
        }
      }

      // --- Concours (Subventions) ---
      const rawConcours = budget.Annexes?.DATA_CONCOURS?.CONCOURS;
      if (rawConcours) {
        const concoursArray = Array.isArray(rawConcours)
          ? rawConcours
          : [rawConcours];
        concoursArray.forEach((c: any) => {
          concoursLines.push({
            article: getVal(c.CodArticle),
            nature_beneficiaire: getVal(c.CodNatJurBenefCA),
            nom_beneficiaire: getVal(c.LibOrgaBenef),
            montant: parseFloat(getVal(c.MtSubv) || "0"),
            objet: getVal(c.ObjSubv) || getVal(c.LibPrestaNat),
          });
        });
      }

      // Aggregate CP for this file
      lines.forEach((line: any) => {
        const caracSup = line.CaracSup;
        if (!caracSup) return;
        const caracSupArray = Array.isArray(caracSup) ? caracSup : [caracSup];
        const progAutoNode = caracSupArray.find(
          (c: any) => c.Code === "ProgAutoNum",
        );
        if (progAutoNode) {
          const rawId = getVal(progAutoNode);
          const id = extractApcpId(rawId);
          if (id && apcpsMap.has(id)) {
            const apcp = apcpsMap.get(id)!;
            const mtPrev = parseFloat(getVal(line.MtPrev) || "0");
            const credOuv = parseFloat(getVal(line.CredOuv) || "0");

            // Pour le montant voté : Priorité à CredOuv (CA), sinon MtPrev (BP)
            apcp.cp_vote += credOuv !== 0 ? credOuv : mtPrev;
            apcp.cp_realise += parseFloat(getVal(line.MtReal) || "0");
            apcp.cp_reste_a_realiser += parseFloat(
              getVal(line.MtRAR3112) || "0",
            );
            apcp.nombre_lignes++;
          }
        }
      });
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
    }
  }

  // Write outputs
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const budgetData: BudgetData = {
    generated_at: new Date().toISOString(),
    lines: budgetLines,
    concours: concoursLines,
  };
  writeFileSync(
    join(OUTPUT_DIR, `budget_${year}.json`),
    JSON.stringify(budgetData, null, 2),
  );

  const loanData: LoanData = {
    generated_at: new Date().toISOString(),
    loans: loans,
  };
  writeFileSync(
    join(OUTPUT_DIR, `loans_${year}.json`),
    JSON.stringify(loanData, null, 2),
  );

  const apcpData: ApcpData = {
    generated_at: new Date().toISOString(),
    apcps: Array.from(apcpsMap.values()),
  };
  writeFileSync(
    join(OUTPUT_DIR, `apcp_${year}.json`),
    JSON.stringify(apcpData, null, 2),
  );

  console.log(
    `Completed ${year}: ${budgetLines.length} budget lines, ${loans.length} loans, ${concoursLines.length} concours.`,
  );
}

async function main() {
  for (const year of YEARS) {
    await processYear(year);
  }
}

main().catch(console.error);
