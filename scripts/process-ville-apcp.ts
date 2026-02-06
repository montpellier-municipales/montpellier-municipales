import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { XMLParser } from "fast-xml-parser";
import type { Apcp, ApcpData } from "../src/types/apcp";

const DATA_DIR = join(process.cwd(), "data/Montpellier-CA");
const OUTPUT_DIR = join(process.cwd(), "src/content/data");
const COMMUNES_FILE = "src/content/data/communes.json";
const MAPPING_FILE = "src/content/data/apcp_communes_mapping.json";

// Charger les communes et le mapping manuel
const COMMUNES_DATA: { name: string; population: number }[] = JSON.parse(
  readFileSync(join(process.cwd(), COMMUNES_FILE), "utf-8"),
);
const COMMUNES = COMMUNES_DATA.map((c) => c.name);

const MANUAL_MAPPING: Record<string, string[]> = JSON.parse(
  readFileSync(join(process.cwd(), MAPPING_FILE), "utf-8"),
);

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
});

function getVal(node: any): any {
  if (node === undefined) return undefined;
  return node.V || node;
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

function extractApcpId(rawString: string): string | null {
  if (!rawString) return null;
  const parts = rawString.trim().split(/\s+/);
  if (parts.length >= 2) return parts[1];
  return parts[0];
}

async function processFile(filename: string) {
  console.log(`Processing ${filename}...`);
  const xmlContent = readFileSync(join(DATA_DIR, filename), "latin1");
  const jsonObj = parser.parse(xmlContent);
  const budget = jsonObj.DocumentBudgetaire.Budget;
  const year = parseInt(getVal(budget.BlocBudget.Exer), 10);
  const natDec = getVal(budget.BlocBudget.NatDec);
  const isCA = natDec === "09"; 

  // 1. Extract APCP Definitions
  const rawApcps = budget.Annexes?.DATA_APCP?.APCP;
  if (!rawApcps) {
      console.warn(`No APCP data found in ${filename}`);
      return;
  }

  const apcpArray = Array.isArray(rawApcps) ? rawApcps : [rawApcps];
  const apcpMap = new Map<string, Apcp>();

  for (const raw of apcpArray) {
    const rawId = getVal(raw.NumAutori);
    const id = extractApcpId(rawId);
    if (!id) continue;

    const libelle = decodeHtmlEntities(getVal(raw.LibAutori) || "Sans libellé");

    // Fusionner détection auto et mapping manuel
    const detected = detectCommunes(libelle);
    const manual = MANUAL_MAPPING[id] || [];
    const mergedCommunes = Array.from(new Set([...detected, ...manual])).sort();

    apcpMap.set(id, {
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

  // 2. Aggregate from Budget Lines
  const rawLines = budget.LigneBudget;
  const linesArray = Array.isArray(rawLines) ? rawLines : [rawLines];

  for (const line of linesArray) {
    const caracSup = line.CaracSup;
    if (!caracSup) continue;

    const caracSupArray = Array.isArray(caracSup) ? caracSup : [caracSup];
    const progAutoNode = caracSupArray.find(
      (c: any) => c.Code === "ProgAutoNum",
    );

    if (progAutoNode) {
      const rawId = getVal(progAutoNode);
      const id = extractApcpId(rawId);

      if (id && apcpMap.has(id)) {
        const apcp = apcpMap.get(id)!;
        
        const mtPrev = parseFloat(getVal(line.MtPrev) || "0");
        const credOuv = parseFloat(getVal(line.CredOuv) || "0");
        const mtReal = parseFloat(getVal(line.MtReal) || "0");
        
        // Pour le montant voté : Priorité à CredOuv (CA), sinon MtPrev (BP)
        apcp.cp_vote += credOuv !== 0 ? credOuv : mtPrev;
        
        if (isCA) {
            apcp.cp_realise += mtReal;
        } else {
             // For BP, realized is 0
        }
        
        apcp.cp_reste_a_realiser += parseFloat(getVal(line.MtRAR3112) || "0");
        apcp.nombre_lignes++;
      }
    }
  }

  const apcps = Array.from(apcpMap.values());
  const data: ApcpData = {
    generated_at: new Date().toISOString(),
    apcps: apcps,
  };

  const outputFile = join(OUTPUT_DIR, `ville_apcp_${year}.json`);
  writeFileSync(outputFile, JSON.stringify(data, null, 2));
  console.log(`Generated ${outputFile} with ${apcps.length} entries.`);
}

async function main() {
  const files = readdirSync(DATA_DIR).filter(f => f.endsWith(".xml") && (f.includes("VilleMTP_MTP_CA") || f.includes("VilleMTP_MTP_BudgetPri")));
  
  for (const file of files) {
      try {
        await processFile(file);
      } catch (e) {
          console.error(`Error processing ${file}`, e);
      }
  }
}

main().catch(console.error);
