import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { BudgetData, BudgetLine } from "../src/types/budget";

const DATA_DIR = join(process.cwd(), "src/content/data");
const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2025];

interface AggregatedPoint {
  year: number;
  budget: string;
  type: string;
  montant_vote: number;
  montant_realise: number;
}

function main() {
  const allPoints: AggregatedPoint[] = [];

  for (const year of YEARS) {
    const filename = year === 2025 ? `budget_${year}_processed.json` : `budget_${year}.json`;
    const path = join(DATA_DIR, filename);

    console.log(`Processing ${year}...`);
    try {
      const content = readFileSync(path, "utf-8");
      const data: BudgetData = JSON.parse(content);

      // Aggregation map: Key = "BudgetSource|Type"
      const totals = new Map<string, { vote: number; realise: number }>();

      for (const line of data.lines) {
        const key = `${line.budget}|${line.type}`;
        const current = totals.get(key) || { vote: 0, realise: 0 };
        
        totals.set(key, {
          vote: current.vote + line.montant_vote,
          realise: current.realise + line.montant_realise,
        });
      }

      for (const [key, val] of totals.entries()) {
        const [budget, type] = key.split("|");
        allPoints.push({
          year,
          budget,
          type,
          montant_vote: val.vote,
          montant_realise: val.realise,
        });
      }

    } catch (e) {
      console.warn(`Could not process year ${year}:`, e);
    }
  }

  const outputPath = join(DATA_DIR, "budget_evolution.json");
  writeFileSync(outputPath, JSON.stringify(allPoints, null, 2));
  console.log(`Generated budget_evolution.json with ${allPoints.length} data points.`);
}

main();
