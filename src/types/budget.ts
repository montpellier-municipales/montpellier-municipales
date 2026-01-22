import { z } from "zod";

// Enum pour le sens (Dépense/Recette)
export enum BudgetType {
  Depense = "Depense",
  Recette = "Recette",
}

// Enum pour le budget (Principal/Parking/etc)
export enum BudgetSource {
  Principal = "Principal",
  Parking = "Parking",
  Assainissement = "Assainissement",
  Eau = "Eau",
  Transport = "Transport",
  Spanc = "Spanc",
}

// Schéma Zod pour une ligne budgétaire traitée
export const BudgetLineSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(BudgetType),
  budget: z.nativeEnum(BudgetSource),
  
  // Nature (Compte comptable)
  nature_code: z.string(),
  nature_label: z.string(),
  nature_chapitre: z.string(), // ex: "011" ou "60"
  nature_chapitre_label: z.string().optional(),

  // Fonction (Politique publique)
  fonction_code: z.string().optional(),
  fonction_label: z.string().optional(),
  
  // Montants
  montant_vote: z.number(), // MtPrev (Budget total prévisionnel)
  montant_realise: z.number(), // MtReal (Exécuté)
  montant_budget_precedent: z.number().optional(), // MtBudgPrec
  
  // Infos complémentaires
  operation_reelle: z.boolean(), // true si OpBudg='0', false si ordre
  apcp_id: z.string().optional(), // Lien vers Autorisation de Programme
});

export type BudgetLine = z.infer<typeof BudgetLineSchema>;

export interface ConcoursLine {
  article: string;
  nature_beneficiaire: string; // CodNatJurBenefCA
  nom_beneficiaire: string; // LibOrgaBenef
  montant: number; // MtSubv
  objet?: string; // ObjSubv or LibPrestaNat
}

// Type pour le fichier JSON complet
export interface BudgetData {
  generated_at: string;
  lines: BudgetLine[];
  concours?: ConcoursLine[];
}
