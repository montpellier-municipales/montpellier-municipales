import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "src/content/data");
const OUTPUT_FILE = join(DATA_DIR, "metropole_apcp_evolution.json");

function main() {
    const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
    const evolution: Record<number, any> = {};

    for (const year of years) {
        try {
            const apcpFile = join(DATA_DIR, `apcp_${year}.json`);
            const apcpData = JSON.parse(readFileSync(apcpFile, "utf-8"));
            
            // For CA (2018-2024), cp_realise_2025 is actually cp_realise_YEAR
            // For BP 2025, it's cp_vote_2025
            const totalRealised = apcpData.apcps.reduce((sum: number, a: any) => sum + (a.cp_realise_2025 || 0), 0);
            const totalVoted = apcpData.apcps.reduce((sum: number, a: any) => sum + (a.cp_vote_2025 || 0), 0);

            evolution[year] = {
                year,
                realised: year === 2025 ? 0 : totalRealised,
                voted: totalVoted
            };
        } catch (e) {
            console.warn(`Could not process APCP for ${year}`);
        }
    }

    writeFileSync(OUTPUT_FILE, JSON.stringify(evolution, null, 2));
    console.log(`Wrote ${OUTPUT_FILE}`);
}

main();
