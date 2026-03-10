import z from "zod";
import {
  BlogPostSchema,
  CandidateSchema,
  CharterMeasureSchema,
  CharterResponseLevelSchema,
  CharterSchema,
  CharterSignatorySchema,
  Language,
  ProgramMeasureSchema,
  ProgramPointSchema,
} from "./schema.zod";

// Inférence du type TypeScript pour usage dans le code
export type Candidate = z.infer<typeof CandidateSchema>;
export type ProgramPoint = z.infer<typeof ProgramPointSchema>;
export type BlogPost = z.infer<typeof BlogPostSchema>;
export type ProgramMeasure = z.infer<typeof ProgramMeasureSchema>;
export type Charter = z.infer<typeof CharterSchema>;
export type CharterMeasure = z.infer<typeof CharterMeasureSchema>;
export type CharterSignatory = z.infer<typeof CharterSignatorySchema>;
export type CharterResponseLevel = z.infer<typeof CharterResponseLevelSchema>;
export { Language };
