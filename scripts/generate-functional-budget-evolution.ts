import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { BudgetData } from "../src/types/budget";

const DATA_DIR = join(process.cwd(), "src/content/data");
const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2025];

const FUNCTIONAL_CHAPTERS: Record<string, string> = {
  "0": "Services généraux",
  "1": "Sécurité et salubrité",
  "2": "Enseignement",
  "3": "Culture, Sport, Jeunesse",
  "4": "Santé et action sociale",
  "5": "Aménagement et habitat",
  "6": "Action économique",
  "7": "Environnement et propreté",
  "8": "Transports",
  "9": "Non ventilé / Divers",
};

interface FunctionalPoint {
  year: number;
  fonction_code: string;
  fonction_label: string;
  montant_realise: number;
}

function getFunctionalChapter(code: string): string {
  if (!code) return "NC";
  
  let clean = code.replace(/-/g, "");

  // Handle M14/M57 specific prefixes for Invest/Fonctionnement
  if (clean.startsWith("90") && clean.length > 2) {
    clean = clean.substring(2);
  } else if (clean.startsWith("93") && clean.length > 2) {
    clean = clean.substring(2);
  }

  return clean.charAt(0);
}

function main() {
  const allPoints: FunctionalPoint[] = [];

  for (const year of YEARS) {
    const filename = year === 2025 ? `budget_${year}_processed.json` : `budget_${year}.json`;
    const path = join(DATA_DIR, filename);

    console.log(`Processing ${year}...`);
    try {
      const content = readFileSync(path, "utf-8");
      const data: BudgetData = JSON.parse(content);

      // Map: Key = "FonctionCode" (0-9)
      const totals = new Map<string, number>();

      for (const line of data.lines) {
        // Filter: Principal Budget AND Expenses
        if (line.budget !== "Principal" || line.type !== "Depense") continue;

        const code = getFunctionalChapter(line.fonction_code);
        // Ignore "NC" or handle it? "NC" usually means accounting flows not related to policies (debt, etc)
        // or just missing data. Let's keep it to see everything.
        
        const current = totals.get(code) || 0;
        totals.set(code, current + line.montant_realise);
      }

      for (const [code, amount] of totals.entries()) {
        if (amount < 1000) continue; // Filter trivial amounts
        
        const label = FUNCTIONAL_CHAPTERS[code] || (code === "NC" ? "Non ventilé / Services centraux" : `Fonction ${code}`);
        
        allPoints.push({
          year,
          fonction_code: code,
          fonction_label: label,
          montant_realise: amount,
        });
      }

    } catch (e) {
      console.warn(`Could not process year ${year}:`, e);
    }
  }

  const outputPath = join(DATA_DIR, "budget_evolution_functional.json");
  writeFileSync(outputPath, JSON.stringify(allPoints, null, 2));
  console.log(`Generated budget_evolution_functional.json with ${allPoints.length} data points.`);
}

main();
