import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "src/content/data");
const OUTPUT_FILE = join(DATA_DIR, "metropole_debt_evolution.json");

function main() {
    const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
    const evolution: Record<number, any> = {};

    for (const year of years) {
        try {
            // 1. Get existing loan data (Outstanding stock and repayments)
            const loanFile = join(DATA_DIR, `loans_${year}.json`);
            const loanData = JSON.parse(readFileSync(loanFile, "utf-8"));
            
            const totalOutstanding = loanData.loans.reduce((sum: number, l: any) => sum + (l.capital_restant_fin || 0), 0);
            const totalAnnuity = loanData.loans.reduce((sum: number, l: any) => sum + (l.annuite_totale || 0), 0);

            // 2. Get budgeted new debt from the budget lines
            // (Nature codes for new borrowing: 1641, 1631, 1643, 1644, 1681)
            let budgetFile = "";
            if (year === 2025) {
                budgetFile = join(DATA_DIR, `budget_2025_processed.json`);
            } else {
                budgetFile = join(DATA_DIR, `budget_${year}.json`);
            }
            
            const budgetData = JSON.parse(readFileSync(budgetFile, "utf-8"));
            
            // For 2025 (BS), we must sum BP + BS
            let newDebtBudgeted = 0;
            if (year === 2025) {
                newDebtBudgeted = budgetData.lines
                    .filter((l: any) => l.type === "Recette" && ["1641", "1631", "1643", "1644", "1681"].includes(l.nature_code))
                    .reduce((sum: number, l: any) => sum + (l.montant_budget_precedent || 0) + l.montant_vote, 0);
            } else {
                newDebtBudgeted = budgetData.lines
                    .filter((l: any) => l.type === "Recette" && ["1641", "1631", "1643", "1644", "1681"].includes(l.nature_code))
                    .reduce((sum: number, l: any) => sum + l.montant_vote, 0);
            }

            evolution[year] = {
                year,
                outstanding: totalOutstanding,
                annuity: totalAnnuity,
                newDebtBudgeted
            };
        } catch (e) {
            console.warn(`Could not process loans/budget for ${year}:`, e);
        }
    }

    writeFileSync(OUTPUT_FILE, JSON.stringify(evolution, null, 2));
    console.log(`Wrote ${OUTPUT_FILE}`);
}

main();
