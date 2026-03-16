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
    qualified: z.boolean().optional(), // true si qualifiée pour le 2ème tour
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
    positioning: z.object({
      economy: z.number().min(1).max(4),
      societal: z.number().min(1).max(5),
      governance: z.number().min(1).max(4),
      security: z.number().min(1).max(4),
      ecology: z.number().min(1).max(4),
    }),
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
  contentMarkdown: z.string().optional(),
  coverImage: z.string().optional(),
  coverImageAlt: z.string().optional(),
  coverImageCredit: z.string().optional(),
});

export type BlogPost = z.infer<typeof BlogPostSchema>;

const MeasurePositioningSchema = z
  .object({
    economy: z.number().min(1).max(4).nullable().optional(),
    societal: z.number().min(1).max(5).nullable().optional(),
    governance: z.number().min(1).max(4).nullable().optional(),
    security: z.number().min(1).max(4).nullable().optional(),
    ecology: z.number().min(1).max(4).nullable().optional(),
  })
  .optional();

// Schéma pour les mesures de programme
export const ProgramMeasureSchema = z.object({
  id: z.string(),
  slug: z.string(),
  lang: z.string(),
  title: z.string(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  imageCredit: z.string().optional(),
  tags: z.array(z.string()),
  content: z.string(),
  contentMarkdown: z.string().optional(),
  positioning: MeasurePositioningSchema,
});

export type ProgramMeasure = z.infer<typeof ProgramMeasureSchema>;

export const CharterResponseLevelSchema = z.enum([
  "oui_tout_a_fait",
  "plutot_oui",
  "plutot_non",
  "non_pas_du_tout",
]);
export type CharterResponseLevel = z.infer<typeof CharterResponseLevelSchema>;

export const CharterMeasureSchema = z.object({
  id: z.string(),
  title: z.string(),
  theme: z.string().optional(),
  goodResponse: CharterResponseLevelSchema.optional(),
});

export const CharterSignatorySchema = z.object({
  candidateId: z.string(),
  signed: z.boolean(),
  signedMeasureIds: z.array(z.string()),
  signedCount: z.number().optional(), // override when specific measure IDs are unknown
  measureResponses: z.record(z.string(), CharterResponseLevelSchema).optional(),
});

export const CharterSchema = z.object({
  id: z.string(),
  slug: z.string(),
  organization: z.string(),
  title: z.string(),
  description: z.string(),
  externalUrl: z.string().optional(),
  measures: z.array(CharterMeasureSchema),
  signatories: z.array(CharterSignatorySchema),
});

export type Charter = z.infer<typeof CharterSchema>;
export type CharterMeasure = z.infer<typeof CharterMeasureSchema>;
export type CharterSignatory = z.infer<typeof CharterSignatorySchema>;
