import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { XMLParser } from "fast-xml-parser";
import { BudgetType, BudgetSource, type BudgetLine, type BudgetData, type ConcoursLine } from "../src/types/budget";
import type { PersonnelLine, AssetLine, LoanLine, TreasuryLine } from "../src/types/ville";

const NOMENCLATURES_PATH = join(process.cwd(), "src/content/data/budget_nomenclatures.json");
const nomenclatures = JSON.parse(readFileSync(NOMENCLATURES_PATH, "utf-8"));
const NATURE_LABELS = nomenclatures.natures as Record<string, string>;
const FONCTION_LABELS = nomenclatures.fonctions as Record<string, string>;

const DATA_DIR = join(process.cwd(), "data/Montpellier-CA");
const OUTPUT_DIR = join(process.cwd(), "src/content/data");

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

interface YearData {
  year: number;
  budgetLines: BudgetLine[];
  personnelLines: PersonnelLine[];
  assetLines: AssetLine[];
  loanLines: LoanLine[];
  treasuryLines: TreasuryLine[];
  concoursLines: ConcoursLine[];
  newDebtBudgeted: number;
  totalRealExpenses: number;
}

// --- Processing ---

async function processFile(filename: string): Promise<YearData | null> {
  console.log(`Processing ${filename}...`);
  const xmlContent = readFileSync(join(DATA_DIR, filename), "latin1");
  const jsonObj = parser.parse(xmlContent);
  const doc = jsonObj.DocumentBudgetaire;
  const budget = doc.Budget;
  
  const year = parseInt(getVal(budget.BlocBudget.Exer), 10);
  const natDec = getVal(budget.BlocBudget.NatDec);
  
  const isCA = natDec === "09"; 

  // 1. Budget Lines
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

  const lines: any[] = Array.isArray(budget.LigneBudget) ? budget.LigneBudget : [budget.LigneBudget];
  const processedBudgetLines: BudgetLine[] = [];
  let newDebtBudgeted = 0;
  let totalRealExpenses = 0;

  lines.forEach((l: any, index: number) => {
    if (!l) return;
    const nature = getVal(l.Nature);
    const fonction = getVal(l.Fonction);
    const codeRD = getVal(l.CodRD); 
    
    let mtVote = parseFloat(getVal(l.MtPrev) || "0");
    let mtReal = parseFloat(getVal(l.MtReal) || "0");
    
    if (!isCA) {
        mtReal = 0; 
    }

    if (mtVote === 0 && mtReal === 0) return;

    // Track Budgeted New Debt (Recette, Nature 1641/1631/1643/1644)
    if (codeRD === "R" && ["1641", "1631", "1643", "1644", "1681"].includes(nature)) {
        newDebtBudgeted += mtVote;
    }

    // Track Total Real Expenses (Depense, OpBudg=0)
    if (codeRD === "D" && getVal(l.OpBudg) === "0") {
        totalRealExpenses += isCA ? mtReal : mtVote;
    }

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
      }
    }

    processedBudgetLines.push({
      id: `ville-${year}-${index}`,
      type: codeRD === "D" ? BudgetType.Depense : BudgetType.Recette,
      budget: BudgetSource.Principal,
      nature_code: nature,
      nature_label: natureLabel,
      nature_chapitre: natureChapitre,
      nature_chapitre_label: natureChapitreLabel !== natureChapitre ? natureChapitreLabel : undefined,
      fonction_code: fonction,
      fonction_label: fonctionLabel,
      montant_vote: mtVote,
      montant_realise: mtReal,
      operation_reelle: getVal(l.OpBudg) === "0",
      apcp_id: apcp_id,
    });
  });

  // 2. Personnel
  const personnelLines: PersonnelLine[] = [];
  const personnelData = budget.Annexes?.DATA_PERSONNEL?.PERSONNEL;
  if (personnelData) {
      const pArr = Array.isArray(personnelData) ? personnelData : [personnelData];
      pArr.forEach((p: any) => {
          personnelLines.push({
              typeAgent: getVal(p.CodTypAgent),
              emploiGrade: getVal(p.EmploiGradeAgent),
              categorie: getVal(p.CodCatAgent),
              secteur: getVal(p.CodSectAgentTitulaire),
              effectifBud: parseFloat(getVal(p.EffectifBud) || "0"),
              effectifPourvu: parseFloat(getVal(p.EffectifPourvu) || "0"),
              permanent: getVal(p.Permanent) === "true",
              tempsComplet: getVal(p.TempsComplet) === "true",
          });
      });
  }

  // 3. Patrimoine
  const assetLines: AssetLine[] = [];
  const patrimoineData = budget.Annexes?.DATA_PATRIMOINE?.PATRIMOINE;
  if (patrimoineData) {
      const pArr = Array.isArray(patrimoineData) ? patrimoineData : [patrimoineData];
      pArr.forEach((p: any) => {
          const entreeSortie = getVal(p.CodEntreeSorti);
          let vnc = 0;
          if (entreeSortie === "E") {
              vnc = parseFloat(getVal(p.MtVNCBien3112) || "0");
          } else {
              vnc = parseFloat(getVal(p.MtVNCBienSorti) || "0");
          }

          assetLines.push({
              libelle: getVal(p.LibBien),
              valeurAcquisition: parseFloat(getVal(p.MtValAcquiBien) || "0"),
              vnc: vnc,
              entreeSortie: entreeSortie,
              variations: getVal(p.CodVariPatrim),
              modalite: entreeSortie === "E" ? getVal(p.CodModalAcqui) : getVal(p.CodModalSorti),
          });
      });
  }

  // 4. Emprunts (Loans)
  const loanLines: LoanLine[] = [];
  const empruntData = budget.Annexes?.DATA_EMPRUNT?.EMPRUNT;
  if (empruntData) {
      const eArr = Array.isArray(empruntData) ? empruntData : [empruntData];
      eArr.forEach((e: any) => {
          loanLines.push({
              lender: getVal(e.LibOrgaPreteur),
              capitalRemainingStart: parseFloat(getVal(e.MtCapitalRestDu_01_01) || "0"),
              capitalRemainingEnd: parseFloat(getVal(e.MtCapitalRestDu_31_12) || "0"),
              capitalRepaid: parseFloat(getVal(e.MtCapitalExer) || "0"),
              interestPaid: parseFloat(getVal(e.MtIntExer) || "0"),
              purpose: getVal(e.ObjEmpr),
              type: getVal(e.CodTypEmpr),
              dateSignature: getVal(e.DtSignInit),
              durationRemaining: parseFloat(getVal(e.DureeRest) || "0"),
              rate: parseFloat(getVal(e.TxActua) || "0"),
          });
      });
  }

  // 5. Trésorerie
  const treasuryLines: TreasuryLine[] = [];
  const tresoData = budget.Annexes?.DATA_TRESORERIE?.TRESORERIE;
  if (tresoData) {
      const tArr = Array.isArray(tresoData) ? tresoData : [tresoData];
      tArr.forEach((t: any) => {
          treasuryLines.push({
              lender: getVal(t.LibOrgaPret),
              maxAuthorized: parseFloat(getVal(t.MtMaxAutori) || "0"),
              drawdown: parseFloat(getVal(t.MtTirage) || "0"),
              repaid: parseFloat(getVal(t.MtRemb) || "0"),
              outstanding: parseFloat(getVal(t.MtRestDu) || "0"),
              interestPaid: parseFloat(getVal(t.MtRembInt) || "0"),
          });
      });
  }

  // 6. Concours (Subventions)
  const concoursLines: ConcoursLine[] = [];
  const concoursData = budget.Annexes?.DATA_CONCOURS?.CONCOURS;
  if (concoursData) {
      const cArr = Array.isArray(concoursData) ? concoursData : [concoursData];
      cArr.forEach((c: any) => {
          concoursLines.push({
              article: getVal(c.CodArticle),
              nature_beneficiaire: getVal(c.CodNatJurBenefCA),
              nom_beneficiaire: getVal(c.LibOrgaBenef),
              montant: parseFloat(getVal(c.MtSubv) || "0"),
              objet: getVal(c.ObjSubv) || getVal(c.LibPrestaNat),
          });
      });
  }

  return {
      year,
      budgetLines: processedBudgetLines,
      personnelLines,
      assetLines,
      loanLines,
      treasuryLines,
      concoursLines,
      newDebtBudgeted,
      totalRealExpenses
  };
}

async function main() {
  const files = readdirSync(DATA_DIR).filter(f => f.endsWith(".xml") && f.includes("VilleMTP"));
  
  const allPersonnel: Record<number, PersonnelLine[]> = {};
  const allPatrimoine: Record<number, AssetLine[]> = {};
  const allLoans: Record<number, LoanLine[]> = {};
  const allTreasury: Record<number, TreasuryLine[]> = {};
  const allDebtSummary: Record<number, { newDebtBudgeted: number, totalRealExpenses: number }> = {};

  for (const file of files) {
      const data = await processFile(file);
      if (data) {
          const budgetData: BudgetData = {
              generated_at: new Date().toISOString(),
              lines: data.budgetLines,
              concours: data.concoursLines
          };
          const budgetFile = join(OUTPUT_DIR, `ville_budget_${data.year}.json`);
          writeFileSync(budgetFile, JSON.stringify(budgetData, null, 2));
          console.log(`Wrote ${budgetFile} (${data.budgetLines.length} lines, ${data.concoursLines.length} concours)`);

          allPersonnel[data.year] = data.personnelLines;
          allPatrimoine[data.year] = data.assetLines;
          allLoans[data.year] = data.loanLines;
          allTreasury[data.year] = data.treasuryLines;
          allDebtSummary[data.year] = {
              newDebtBudgeted: data.newDebtBudgeted,
              totalRealExpenses: data.totalRealExpenses
          };
      }
  }

  const personnelFile = join(OUTPUT_DIR, "ville_personnel.json");
  writeFileSync(personnelFile, JSON.stringify(allPersonnel, null, 2));
  console.log(`Wrote ${personnelFile}`);

  const patrimoineFile = join(OUTPUT_DIR, "ville_patrimoine.json");
  writeFileSync(patrimoineFile, JSON.stringify(allPatrimoine, null, 2));
  console.log(`Wrote ${patrimoineFile}`);

  const loansFile = join(OUTPUT_DIR, "ville_loans.json");
  writeFileSync(loansFile, JSON.stringify(allLoans, null, 2));
  console.log(`Wrote ${loansFile}`);

  const treasuryFile = join(OUTPUT_DIR, "ville_treasury.json");
  writeFileSync(treasuryFile, JSON.stringify(allTreasury, null, 2));
  console.log(`Wrote ${treasuryFile}`);

  const debtSummaryFile = join(OUTPUT_DIR, "ville_debt_summary.json");
  writeFileSync(debtSummaryFile, JSON.stringify(allDebtSummary, null, 2));
  console.log(`Wrote ${debtSummaryFile}`);
}

main().catch(console.error);