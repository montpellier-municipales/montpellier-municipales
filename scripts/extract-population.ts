import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const COMMUNES_FILE = "src/content/data/communes.json";
const CSV_FILE = "data/population-municipale-communes.csv";

interface CommuneInfo {
  name: string;
  population: number;
}

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/-/g, " ")
    .trim();
}

function main() {
  // 1. Load target communes (Array of strings initially)
  const content = readFileSync(join(process.cwd(), COMMUNES_FILE), "utf-8");
  const targetCommunes: string[] = JSON.parse(content);
  
  // Handle case where file is already converted
  if (typeof targetCommunes[0] !== "string") {
      console.log("File seems already converted.");
      return;
  }

  const targetSet = new Set(targetCommunes.map(c => normalize(c)));
  
  // 2. Read CSV
  const csvContent = readFileSync(join(process.cwd(), CSV_FILE), "utf-8");
  const lines = csvContent.split("\n");
  
  const headers = lines[0].split(",");
  const depIndex = headers.indexOf("dep");
  const libgeoIndex = headers.indexOf("libgeo");
  const popIndex = headers.indexOf("p21_pop");

  const populationMap: Record<string, number> = {};
  
  // 3. Process lines
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = line.split(",");
    
    if (cols[depIndex] !== "34") continue;

    const name = cols[libgeoIndex];
    const pop = parseInt(cols[popIndex]);
    const normalizedName = normalize(name);
    
    if (targetSet.has(normalizedName)) {
      populationMap[normalizedName] = pop;
    }
  }

  // 4. Merge and Create new structure
  const result: CommuneInfo[] = targetCommunes.map(name => {
      const pop = populationMap[normalize(name)];
      if (pop === undefined) console.warn(`Population not found for ${name}`);
      return {
          name,
          population: pop || 0
      };
  });

  // 5. Write output
  writeFileSync(join(process.cwd(), COMMUNES_FILE), JSON.stringify(result, null, 2));
  console.log(`Updated ${COMMUNES_FILE} with population data.`);
}

main();