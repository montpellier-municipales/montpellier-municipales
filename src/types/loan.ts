import { z } from "zod";

export const LoanSchema = z.object({
  id: z.string(), // Généré (source-index)
  budget: z.enum(["Principal", "Parking", "Assainissement", "Eau", "Transport", "Spanc"]),
  
  // Identification
  libelle: z.string(), // ObjEmpr
  numero_contrat: z.string(), // NumContrat
  preteur: z.string(), // LibOrgaPreteur
  type_preteur: z.string(), // CodTypPreteur (01=Banque)
  
  // Dates
  date_signature: z.string(), // DtSignInit
  date_emission: z.string(), // DtEmission
  annee_encaisse: z.number(), // AnEncaisse
  
  // Montants et Durée
  montant_initial: z.number(), // MtEmprOrig
  duree_initiale: z.number(), // DureeContratInit
  duree_restante: z.number(), // DureeRest
  
  // Taux
  type_taux: z.string(), // CodTyptxInit (F=Fixe, V=Variable)
  index_taux: z.string().optional(), // IndexTxVariInit
  taux_initial: z.number(), // TxActuaInit
  taux_actuel: z.number(), // TxActua
  taux_marge: z.string().optional(), // TxMini ou TxMaxi si pertinent pour la marge
  
  // Remboursement
  capital_rembourse_exercice: z.number(), // MtCapitalExer
  interets_payes_exercice: z.number(), // MtIntExer
  annuite_totale: z.number(), // AnnuitNetDette
  profil_amortissement: z.string(), // CodProfilAmort (C=Constant, P=Progressif)
  
  // Encours
  capital_restant_debut: z.number(), // MtCapitalRestDu_01_01
  capital_restant_fin: z.number(), // MtCapitalRestDu_31_12
});

export type Loan = z.infer<typeof LoanSchema>;

export interface LoanData {
  generated_at: string;
  loans: Loan[];
}
