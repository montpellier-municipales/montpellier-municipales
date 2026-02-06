import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROUTES_DIR = join(process.cwd(), "src/routes/budget/montpellier");
const YEARS = ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];

function updateYearPage(year: string) {
    const file = join(ROUTES_DIR, year, "index.tsx");
    let content = readFileSync(file, "utf-8");

    // Check if already updated
    if (content.includes("ville_apcp_")) {
        console.log(`Skipping ${year}, already updated.`);
        return;
    }

    // Add imports
    const importData = `import apcpData from "~/content/data/ville_apcp_${year}.json";`;
    const importType = `import type { ApcpData } from "~/types/apcp";`;
    
    // Insert imports after existing imports
    content = content.replace(
        /import loanData from \"~\/content\/data\/ville_loans\.json\";/,
        `import loanData from \"~/content/data/ville_loans.json\";\n${importData}`
    );

    // If ApcpData is not imported, add it to the list of types if possible, or separate line
    if (!content.includes("ApcpData")) {
        content = content.replace(
            /import type { BudgetData } from \"~\/types\/budget\";/,
            `import type { BudgetData } from \"~/types/budget\";\n${importType}`
        );
    }

    // Update component usage
    content = content.replace(
        /loanData={currentLoans}/,
        `loanData={currentLoans}\n      apcpData={apcpData as ApcpData}`
    );

    writeFileSync(file, content);
    console.log(`Updated ${year}`);
}

function main() {
    for (const year of YEARS) {
        try {
            updateYearPage(year);
        } catch (e) {
            console.error(`Error updating ${year}`, e);
        }
    }
}

main();
