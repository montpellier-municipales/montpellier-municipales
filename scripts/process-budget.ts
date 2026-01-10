import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { XMLParser } from "fast-xml-parser";
import { BudgetType, BudgetSource, type BudgetLine, type BudgetData } from "../src/types/budget";

// Chargement des nomenclatures via fs pour éviter les soucis de config TS
const nomenclaturesPath = join(process.cwd(), "src/content/data/budget_nomenclatures.json");
const nomenclatures = JSON.parse(readFileSync(nomenclaturesPath, "utf-8"));

const DATA_DIR = "MMM_MMM_BS_2025";
const OUTPUT_FILE = "src/content/data/budget_2025_processed.json";

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
  const parts = rawString.split(" ");
  if (parts.length >= 2) return parts[1];
  return undefined;
}

async function processFile(filename: string, source: BudgetSource): Promise<BudgetLine[]> {
  const xmlContent = readFileSync(join(DATA_DIR, filename), "latin1");
  const jsonObj = parser.parse(xmlContent);
  const budget = jsonObj.DocumentBudgetaire.Budget;
  
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

  const lines: any[] = budget.LigneBudget;
  const processedLines: BudgetLine[] = [];

  lines.forEach((l: any, index: number) => {
    const nature = getVal(l.Nature);
    const fonction = getVal(l.Fonction);
    const codeRD = getVal(l.CodRD); 
    
    const mtPrev = parseFloat(getVal(l.MtPrev) || "0");
    const mtReal = parseFloat(getVal(l.MtReal) || "0");
    
    if (mtPrev === 0 && mtReal === 0) return;

    let natureChapitre = nature.substring(0, 2);
    if (nature.startsWith("0")) natureChapitre = nature.substring(0, 3);
    
    const natureLabel = xmlLabelsMap[nature] || resolveNatureLabel(nature, NATURE_LABELS);
    const natureChapitreLabel = resolveNatureLabel(natureChapitre, NATURE_LABELS);
    const fonctionLabel = resolveFunctionLabel(fonction);

    // Extraction APCP
    let apcp_id: string | undefined = undefined;
    if (l.CaracSup) {
      const caracSupArray = Array.isArray(l.CaracSup) ? l.CaracSup : [l.CaracSup];
      const progAutoNode = caracSupArray.find((c: any) => c.Code === "ProgAutoNum");
      if (progAutoNode) {
        apcp_id = extractApcpId(getVal(progAutoNode));
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
      operation_reelle: getVal(l.OpBudg) === "0",
      apcp_id: apcp_id,
    });
  });

  return processedLines;
}

async function main() {
  console.log("Processing budget data...");
  
  const principalLines = await processFile("XML BS 2025 3M PRINCIPAL SCELLE.xml", BudgetSource.Principal);
  const parkingLines = await processFile("XML BS 2025 3M PARKING SCELLE.xml", BudgetSource.Parking);
  
  const allLines = [...principalLines, ...parkingLines];
  
  const data: BudgetData = {
    generated_at: new Date().toISOString(),
    lines: allLines,
  };

  mkdirSync(join(process.cwd(), "src/content/data"), { recursive: true });
  writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  console.log(`Successfully generated ${OUTPUT_FILE} with ${allLines.length} lines.`);
}

main().catch(console.error);