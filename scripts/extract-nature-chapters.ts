import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const CSV_FILE = "data/nomenclature-budget-nature-chapitres-france.csv";
const OUTPUT_FILE = "src/content/data/nature_chapters.json";

function main() {
  console.log(`Reading ${CSV_FILE}...`);
  const content = readFileSync(CSV_FILE, "utf-8");
  const lines = content.split("\n");
  
  // Header: Code Nature Chapitre;Libellé Nature Chapitre;Libellé court Nature Chapitre;Type de chapitre;Section;Spécial;Année;Norme;Plan comptable;Entité
  const targetPlans = ["M57-M57_D", "M4-M49_D"];
  
  const result: Record<string, Record<string, string>> = {
    "M57-M57_D": {},
    "M4-M49_D": {}
  };

  // On commence à 1 pour sauter le header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const columns = line.split(";");
    if (columns.length < 9) continue;

    const code = columns[0];
    const label = columns[1];
    const plan = columns[8];

    if (targetPlans.includes(plan)) {
      // On garde la valeur, si plusieurs années sont présentes, la dernière ligne lue (souvent la plus récente ou dépend de l'ordre du CSV) l'emporte.
      // Dans ce CSV on peut aussi filtrer par année la plus récente si nécessaire.
      result[plan][code] = label;
    }
  }

  mkdirSync(join(process.cwd(), "src/content/data"), { recursive: true });
  writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2));
  
  console.log(`Successfully extracted nature chapters to ${OUTPUT_FILE}`);
  console.log(`M57-M57_D: ${Object.keys(result["M57-M57_D"]).length} codes`);
  console.log(`M4-M49_D: ${Object.keys(result["M4-M49_D"]).length} codes`);
}

main();
