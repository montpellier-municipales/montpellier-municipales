import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { XMLParser } from "fast-xml-parser";
import type { Loan, LoanData } from "../src/types/loan";

const DATA_DIR = "MMM_MMM_BS_2025";
const OUTPUT_FILE = "src/content/data/loans_2025.json";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
});

function getVal(node: any): any {
  if (node === undefined) return undefined;
  return node.V || node;
}

async function processFile(filename: string, budgetName: "Principal" | "Parking"): Promise<Loan[]> {
  const xmlContent = readFileSync(join(DATA_DIR, filename), "latin1");
  const jsonObj = parser.parse(xmlContent);
  const budget = jsonObj.DocumentBudgetaire.Budget;
  
  const rawLoans = budget.Annexes?.DATA_EMPRUNT?.EMPRUNT;
  if (!rawLoans) return [];

  const loansArray = Array.isArray(rawLoans) ? rawLoans : [rawLoans];
  
  return loansArray.map((l: any, index: number) => {
    return {
      id: `${budgetName}-${index}`,
      budget: budgetName,
      libelle: getVal(l.ObjEmpr) || "Sans libellé",
      numero_contrat: getVal(l.NumContrat) || "Inconnu",
      preteur: getVal(l.LibOrgaPreteur) || "Inconnu",
      type_preteur: getVal(l.CodTypPreteur),
      date_signature: getVal(l.DtSignInit),
      date_emission: getVal(l.DtEmission),
      annee_encaisse: parseInt(getVal(l.AnEncaisse) || "0"),
      montant_initial: parseFloat(getVal(l.MtEmprOrig) || "0"),
      duree_initiale: parseFloat(getVal(l.DureeContratInit) || "0"),
      duree_restante: parseFloat(getVal(l.DureeRest) || "0"),
      type_taux: getVal(l.CodTyptxInit),
      index_taux: getVal(l.IndexTxVariInit),
      taux_initial: parseFloat(getVal(l.TxActuaInit) || "0"),
      taux_actuel: parseFloat(getVal(l.TxActua) || "0"),
      taux_marge: getVal(l.TxMaxi) || getVal(l.TxMini),
      capital_rembourse_exercice: parseFloat(getVal(l.MtCapitalExer) || "0"),
      interets_payes_exercice: parseFloat(getVal(l.MtIntExer) || "0"),
      annuite_totale: parseFloat(getVal(l.AnnuitNetDette) || "0"),
      profil_amortissement: getVal(l.CodProfilAmort),
      capital_restant_debut: parseFloat(getVal(l.MtCapitalRestDu_01_01) || "0"),
      capital_restant_fin: parseFloat(getVal(l.MtCapitalRestDu_31_12) || "0"),
    };
  });
}

async function main() {
  console.log("Extracting loans data...");
  
  const principalLoans = await processFile("XML BS 2025 3M PRINCIPAL SCELLE.xml", "Principal");
  const parkingLoans = await processFile("XML BS 2025 3M PARKING SCELLE.xml", "Parking");
  
  const allLoans = [...principalLoans, ...parkingLoans];
  
  const data: LoanData = {
    generated_at: new Date().toISOString(),
    loans: allLoans,
  };

  mkdirSync(join(process.cwd(), "src/content/data"), { recursive: true });
  writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
  
  console.log(`Successfully generated ${OUTPUT_FILE} with ${allLoans.length} loans.`);
}

main().catch(console.error);
