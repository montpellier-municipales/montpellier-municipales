import { z } from "zod";
import { CandidateSchema } from "~/types/schema.zod";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

async function generate() {
  console.log("Generating JSON Schema...");
  const jsonSchema = z.toJSONSchema(CandidateSchema);

  const outputPath = join(process.cwd(), "src/types/schema.json");

  await writeFile(outputPath, JSON.stringify(jsonSchema, null, 2));

  console.log(`Schema generated at ${outputPath}`);
}

generate();
