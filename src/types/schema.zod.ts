import { z } from "zod";

export enum Language {
  fr = "fr",
  en = "en",
  oc = "oc",
  ar = "ar",
  es = "es",
}

export const TranslationSchema = z.record(z.enum(Language), z.string());

export const ProgramPointSchema = z.object({
  themeId: z.string(),
  summary: TranslationSchema,
  details: TranslationSchema,
});

// Définition du schéma Zod
export const CandidateSchema = z
  .object({
    // $schema est optionnel ou ignoré par Zod pour la validation des données pures, mais utile pour le JSON
    $schema: z.string().optional(),
    disabled: z.boolean().optional(),
    id: z.string(),
    name: z.string(),
    headOfList: z.string(),
    parties: z.array(z.string()),
    logoUrl: z.string(),
    candidatePictureUrl: z.string(),
    fame: z.number().optional(), // 1 (Inconnu) à 10 (Très connu). Utilisé pour le tri aléatoire pondéré.
    website: z.string().optional(),
    
    socials: z.object({
      twitter: z.string().optional(),
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      tiktok: z.string().optional(),
      bluesky: z.string().optional(),
    }),
    bio: z.string().optional(),
    slogan: z.string().optional(),
    program: z.array(ProgramPointSchema),
    presentation: TranslationSchema.optional(),
    vision: TranslationSchema.optional(),
  })
  .strict();

// Inférence du type TypeScript pour usage dans le code
export type Candidate = z.infer<typeof CandidateSchema>;

// Schéma pour les articles de blog
export const BlogPostSchema = z.object({
  id: z.string(),
  slug: z.string(),
  lang: z.string(),
  title: z.string(),
  date: z.string(), // Ou z.date() transformé si on parse
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
  excerpt: z.string(),
  excerptHtml: z.string().optional(),
  content: z.string(),
});

export type BlogPost = z.infer<typeof BlogPostSchema>;
