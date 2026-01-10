import { z } from "zod";

export const ApcpSchema = z.object({
  id: z.string(), // NumAutori
  libelle: z.string(), // LibAutori
  chapitre: z.string(), // Chapitre
  
  // Données de l'annexe APCP
  montant_ap_vote_anterieur: z.number(), // MtAutori_NMoins1
  
  // Agrégats calculés depuis les lignes budgétaires
  cp_vote_2025: z.number(), // Somme MtPrev (ou MtSup BudgetHorsRAR selon le cas)
  cp_realise_2025: z.number(), // Somme MtReal
  cp_reste_a_realiser: z.number(), // Somme MtRAR3112
  
  nombre_lignes: z.number(),
  communes: z.array(z.string()), // Liste des communes bénéficiaires détectées
});

export type Apcp = z.infer<typeof ApcpSchema>;

export interface ApcpData {
  generated_at: string;
  apcps: Apcp[];
}
