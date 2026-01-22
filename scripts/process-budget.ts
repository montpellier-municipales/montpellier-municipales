import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { XMLParser } from "fast-xml-parser";
import { BudgetType, BudgetSource, type BudgetLine, type BudgetData, type ConcoursLine } from "../src/types/budget";
import type { Apcp, ApcpData } from "../src/types/apcp";

// Chargement des nomenclatures via fs pour éviter les soucis de config TS
const nomenclaturesPath = join(process.cwd(), "src/content/data/budget_nomenclatures.json");
const nomenclatures = JSON.parse(readFileSync(nomenclaturesPath, "utf-8"));

const COMMUNES_FILE = "src/content/data/communes.json";
const MAPPING_FILE = "src/content/data/apcp_communes_mapping.json";
const COMMUNES_DATA: { name: string, population: number }[] = JSON.parse(readFileSync(join(process.cwd(), COMMUNES_FILE), "utf-8"));
const COMMUNES = COMMUNES_DATA.map(c => c.name);
const MANUAL_MAPPING: Record<string, string[]> = JSON.parse(readFileSync(join(process.cwd(), MAPPING_FILE), "utf-8"));

const DATA_DIR = "MMM_MMM_BS_2025";
const OUTPUT_FILE_BUDGET = "src/content/data/budget_2025_processed.json";
const OUTPUT_FILE_APCP = "src/content/data/apcp_2025.json";

// Utilisation des nomenclatures générées
const NATURE_LABELS = nomenclatures.natures as Record<string, string>;
const FONCTION_LABELS = nomenclatures.fonctions as Record<string, string>;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
});

function getVal(node: any): any {
  if (node === undefined) return undefined;
  return node.V || node;
}

function resolveNatureLabel(code: string, map: Record<string, string>): string {
  if (map[code]) return map[code];
  if (code.length > 3 && map[code.substring(0, 3)]) return map[code.substring(0, 3)];
  if (code.length > 2 && map[code.substring(0, 2)]) return map[code.substring(0, 2)];
  return code;
}

function resolveFunctionLabel(code: string | undefined): string | undefined {
  if (!code) return undefined;
  const cleanCode = code.replace(/-/g, "");
  
  if (FONCTION_LABELS[cleanCode]) return FONCTION_LABELS[cleanCode];
  
  if (cleanCode.startsWith("90") || cleanCode.startsWith("93")) {
      if (FONCTION_LABELS[cleanCode.substring(0, 3)]) return FONCTION_LABELS[cleanCode.substring(0, 3)];
      const suffix = cleanCode.substring(2); 
      if (FONCTION_LABELS[suffix]) return FONCTION_LABELS[suffix];
      if (suffix.length > 1 && FONCTION_LABELS[suffix.substring(0, 2)]) return FONCTION_LABELS[suffix.substring(0, 2)];
      if (suffix.length > 0 && FONCTION_LABELS[suffix.substring(0, 1)]) return FONCTION_LABELS[suffix.substring(0, 1)];
  } else {
      if (code.length > 2 && FONCTION_LABELS[code.substring(0, 2)]) return FONCTION_LABELS[code.substring(0, 2)];
      if (code.length > 1 && FONCTION_LABELS[code.substring(0, 1)]) return FONCTION_LABELS[code.substring(0, 1)];
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
  return str.replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
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

// Global APCP Map to aggregate across files
const apcpsMap = new Map<string, Apcp>();

async function processFile(filename: string, source: BudgetSource): Promise<{lines: BudgetLine[], concours: ConcoursLine[]}> {
  const xmlContent = readFileSync(join(DATA_DIR, filename), "latin1");
  const jsonObj = parser.parse(xmlContent);
  const budget = jsonObj.DocumentBudgetaire.Budget;
  const natDec = getVal(budget.BlocBudget?.NatDec);
  
  const xmlLabelsMap: Record<string, string> = {};
  const ventilation = budget.Annexes?.DATA_VENTILATION?.VENTILATION;
  if (ventilation) {
    const ventArray = Array.isArray(ventilation) ? ventilation : [ventilation];
    ventArray.forEach((v: any) => {
      const art = getVal(v.CodArticle);
      const lib = getVal(v.LibCpte);
      if (art && lib) xmlLabelsMap[art] = lib;
    });
  }

  // --- APCP Definitions ---
  const rawApcps = budget.Annexes?.DATA_APCP?.APCP;
  if (rawApcps) {
    const apcpArray = Array.isArray(rawApcps) ? rawApcps : [rawApcps];
    for (const raw of apcpArray) {
      const id = extractApcpId(getVal(raw.NumAutori));
      if (!id) continue;
      
      if (!apcpsMap.has(id)) {
         const libelle = decodeHtmlEntities(getVal(raw.LibAutori) || "Sans libellé");
         const detected = detectCommunes(libelle);
         const manual = MANUAL_MAPPING[id] || [];
         const mergedCommunes = Array.from(new Set([...detected, ...manual])).sort();

         apcpsMap.set(id, {
          id,
          libelle,
          chapitre: getVal(raw.Chapitre) || "",
          montant_ap_vote_anterieur: parseFloat(getVal(raw.MtAutori_NMoins1) || "0"),
          cp_vote: 0,
          cp_realise: 0,
          cp_reste_a_realiser: 0,
          nombre_lignes: 0,
          communes: mergedCommunes,
        });
      }
    }
  }

  const lines: any[] = budget.LigneBudget ? (Array.isArray(budget.LigneBudget) ? budget.LigneBudget : [budget.LigneBudget]) : [];
  const processedLines: BudgetLine[] = [];

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
    
    const natureLabel = xmlLabelsMap[nature] || resolveNatureLabel(nature, NATURE_LABELS);
    const natureChapitreLabel = resolveNatureLabel(natureChapitre, NATURE_LABELS);
    const fonctionLabel = resolveFunctionLabel(fonction);

    let apcp_id: string | undefined = undefined;
    if (l.CaracSup) {
      const caracSupArray = Array.isArray(l.CaracSup) ? l.CaracSup : [l.CaracSup];
      const progAutoNode = caracSupArray.find((c: any) => c.Code === "ProgAutoNum");
      if (progAutoNode) {
        apcp_id = extractApcpId(getVal(progAutoNode));
        
        // Aggregate APCP amounts
        if (apcp_id && apcpsMap.has(apcp_id)) {
            const apcp = apcpsMap.get(apcp_id)!;
            const credOuv = parseFloat(getVal(l.CredOuv) || "0");
            apcp.cp_vote += (credOuv !== 0 ? credOuv : mtPrev);
            apcp.cp_realise += mtReal;
            apcp.cp_reste_a_realiser += parseFloat(getVal(l.MtRAR3112) || "0");
            apcp.nombre_lignes++;
        }
      }
    }

    processedLines.push({
      id: `${source}-${index}`,
      type: codeRD === "D" ? BudgetType.Depense : BudgetType.Recette,
      budget: source,
      nature_code: nature,
      nature_label: natureLabel,
      nature_chapitre: natureChapitre,
      nature_chapitre_label: natureChapitreLabel !== natureChapitre ? natureChapitreLabel : undefined,
      fonction_code: fonction,
      fonction_label: fonctionLabel,
      montant_vote: mtPrev,
      montant_realise: mtReal,
      montant_budget_precedent: parseFloat(getVal(l.MtBudgPrec) || "0"),
      operation_reelle: getVal(l.OpBudg) === "0",
      apcp_id: apcp_id,
    });
  });

  const processedConcours: ConcoursLine[] = [];
  const concoursData = budget.Annexes?.DATA_CONCOURS?.CONCOURS;
  if (concoursData) {
      const cArr = Array.isArray(concoursData) ? concoursData : [concoursData];
      cArr.forEach((c: any) => {
          processedConcours.push({
              article: getVal(c.CodArticle),
              nature_beneficiaire: getVal(c.CodNatJurBenefCA),
              nom_beneficiaire: getVal(c.LibOrgaBenef),
              montant: parseFloat(getVal(c.MtSubv) || "0"),
              objet: getVal(c.ObjSubv) || getVal(c.LibPrestaNat),
          });
      });
  }

  return { lines: processedLines, concours: processedConcours };
}

async function main() {
  console.log("Processing budget data...");
  
  const principal = await processFile("XML BS 2025 3M PRINCIPAL SCELLE.xml", BudgetSource.Principal);
  const parking = await processFile("XML BS 2025 3M PARKING SCELLE.xml", BudgetSource.Parking);
  
  const allLines = [...principal.lines, ...parking.lines];
  const allConcours = [...principal.concours, ...parking.concours];
  
  const budgetData: BudgetData = {
    generated_at: new Date().toISOString(),
    lines: allLines,
    concours: allConcours
  };

  const apcpData: ApcpData = {
    generated_at: new Date().toISOString(),
    apcps: Array.from(apcpsMap.values())
  };

  mkdirSync(join(process.cwd(), "src/content/data"), { recursive: true });
  
  writeFileSync(OUTPUT_FILE_BUDGET, JSON.stringify(budgetData, null, 2));
  console.log(`Successfully generated ${OUTPUT_FILE_BUDGET} with ${allLines.length} lines and ${allConcours.length} concours.`);

  writeFileSync(OUTPUT_FILE_APCP, JSON.stringify(apcpData, null, 2));
  console.log(`Successfully generated ${OUTPUT_FILE_APCP} with ${apcpsMap.size} APCPs.`);
}

main().catch(console.error);
