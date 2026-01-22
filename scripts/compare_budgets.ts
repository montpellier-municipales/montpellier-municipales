import { readFileSync } from "node:fs";
import { join } from "node:path";

const file2024 = join(process.cwd(), "src/content/data/budget_2024.json");
const file2025 = join(process.cwd(), "src/content/data/budget_2025_processed.json");

const data2024 = JSON.parse(readFileSync(file2024, "utf-8"));
const data2025 = JSON.parse(readFileSync(file2025, "utf-8"));

function calculateTotals(data: any) {
  let vote = 0;
  let realise = 0;
  data.lines.forEach((l: any) => {
    vote += l.montant_vote || 0;
    realise += l.montant_realise || 0;
  });
  return { vote, realise, count: data.lines.length };
}

const totals2024 = calculateTotals(data2024);
const totals2025 = calculateTotals(data2025);

console.log("2024 Totals:", totals2024);
console.log("2025 Totals:", totals2025);
