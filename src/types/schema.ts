import z from "zod";
import {
  BlogPostSchema,
  CandidateSchema,
  Language,
  ProgramPointSchema,
} from "./schema.zod";

// Inférence du type TypeScript pour usage dans le code
export type Candidate = z.infer<typeof CandidateSchema>;
export type ProgramPoint = z.infer<typeof ProgramPointSchema>;
export type BlogPost = z.infer<typeof BlogPostSchema>;
export { Language };
