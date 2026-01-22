export interface PersonnelLine {
  typeAgent: string; // CodTypAgent
  emploiGrade: string; // EmploiGradeAgent
  categorie: string; // CodCatAgent
  secteur: string; // CodSectAgentTitulaire
  effectifBud: number;
  effectifPourvu: number;
  permanent: boolean;
  tempsComplet: boolean;
}

export interface AssetLine {
  libelle: string; // LibBien
  valeurAcquisition: number; // MtValAcquiBien
  vnc: number; // MtVNC...
  entreeSortie: "E" | "S"; // CodEntreeSorti
  variations: string; // CodVariPatrim
  modalite: string; // CodModalSorti ou CodModalAcqui
}

export interface LoanLine {
  lender: string; // LibOrgaPreteur
  capitalRemainingStart: number; // MtCapitalRestDu_01_01
  capitalRemainingEnd: number; // MtCapitalRestDu_31_12
  capitalRepaid: number; // MtCapitalExer
  interestPaid: number; // MtIntExer
  purpose: string; // ObjEmpr
  type: string; // CodTypEmpr
  dateSignature: string; // DtSignInit
  durationRemaining: number; // DureeRest
  rate: number; // TxActua
}

export interface TreasuryLine {
  lender: string; // LibOrgaPret
  maxAuthorized: number; // MtMaxAutori
  drawdown: number; // MtTirage
  repaid: number; // MtRemb
  outstanding: number; // MtRestDu
  interestPaid: number; // MtRembInt
}
