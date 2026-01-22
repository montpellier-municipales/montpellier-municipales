import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { XMLParser } from "fast-xml-parser";
import type { Apcp, ApcpData } from "../src/types/apcp";

const DATA_DIR = "MMM_MMM_BS_2025";
const OUTPUT_FILE = "src/content/data/apcp_2025.json";
const COMMUNES_FILE = "src/content/data/communes.json";
const MAPPING_FILE = "src/content/data/apcp_communes_mapping.json";

// Charger les communes et le mapping manuel
// Le fichier communes.json contient maintenant [{name: string, population: number}]
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
    .replace(/-/g, " "); // Replace hyphens with spaces for looser matching
}

function detectCommunes(text: string): string[] {
  const normalizedText = normalize(text);
  const detected: string[] = [];

  for (const commune of COMMUNES) {
    const normalizedCommune = normalize(commune);

    // Cas spécifique pour "Montpellier" pour éviter "Montpellier Méditerranée Métropole" ou "Montpellier Events"
    // Si le texte contient juste "Montpellier", ou "Ville de Montpellier", c'est bon.
    // Mais ici on cherche dans les libellés de projets.
    // Souvent les projets s'appellent "AMENAGEMENT MONTPELLIER ..." -> OK.
    // Si c'est "METROPOLE MONTPELLIER" -> c'est générique.
    // Pour simplifier, on détecte tout, mais on pourrait affiner.

    // On vérifie si la commune est présente (word boundary check is better but regex is safer)
    // Simple check first
    if (normalizedText.includes(normalizedCommune)) {
      detected.push(commune);
    }
  }

  return detected;
}

function extractApcpId(rawString: string): string | null {
  // Ex: "D CULACC01 2015/1" -> "CULACC01"
  if (!rawString) return null;
  const parts = rawString.split(" ");
  if (parts.length >= 2) return parts[1];
  return null;
}

async function processFile(filename: string): Promise<Apcp[]> {
  const xmlContent = readFileSync(join(DATA_DIR, filename), "latin1");
  const jsonObj = parser.parse(xmlContent);
  const budget = jsonObj.DocumentBudgetaire.Budget;

  // 1. Extract APCP Definitions
  const rawApcps = budget.Annexes?.DATA_APCP?.APCP;
  if (!rawApcps) return [];

  const apcpArray = Array.isArray(rawApcps) ? rawApcps : [rawApcps];
  const apcpMap = new Map<string, Apcp>();

  for (const raw of apcpArray) {
    const id = getVal(raw.NumAutori);
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
        apcp.cp_vote += parseFloat(getVal(line.MtPrev) || "0");
        apcp.cp_realise += parseFloat(getVal(line.MtReal) || "0");
        apcp.cp_reste_a_realiser += parseFloat(getVal(line.MtRAR3112) || "0");
        apcp.nombre_lignes++;
      }
    }
  }

  return Array.from(apcpMap.values());
}

async function main() {
  console.log("Extracting AP/CP data...");

  const principalApcps = await processFile(
    "XML BS 2025 3M PRINCIPAL SCELLE.xml",
  );

  const data: ApcpData = {
    generated_at: new Date().toISOString(),
    apcps: principalApcps,
  };

  mkdirSync(join(process.cwd(), "src/content/data"), { recursive: true });
  writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));

  console.log(
    `Successfully generated ${OUTPUT_FILE} with ${principalApcps.length} AP/CP entries.`,
  );
}

main().catch(console.error);
