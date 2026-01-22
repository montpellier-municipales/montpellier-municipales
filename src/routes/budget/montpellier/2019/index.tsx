import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { CityBudgetPage } from "~/components/budget/pages/city-budget";
import { inlineTranslate } from "qwik-speak";
import budgetData from "~/content/data/ville_budget_2019.json";
import personnelData from "~/content/data/ville_personnel.json";
import patrimoineData from "~/content/data/ville_patrimoine.json";
import loanData from "~/content/data/ville_loans.json";
import type { PersonnelLine, AssetLine, LoanLine } from "~/types/ville";
import type { BudgetData } from "~/types/budget";

export default component$(() => {
  const currentPersonnel = (personnelData as any)["2019"] as PersonnelLine[] || [];
  const currentPatrimoine = (patrimoineData as any)["2019"] as AssetLine[] || [];
  const currentLoans = (loanData as any)["2019"] as LoanLine[] || [];

  return (
    <CityBudgetPage 
      year="2019" 
      budgetData={budgetData as BudgetData} 
      personnelData={currentPersonnel} 
      patrimoineData={currentPatrimoine} 
      loanData={currentLoans}
    />
  );
});

export const head: DocumentHead = () => {
  const t = inlineTranslate();
  return {
    title: t("budget.ville.title", { year: "2019" }),
    meta: [
      {
        name: "description",
        content: t("budget.ville.metaDescription", { year: "2019" }),
      },
    ],
  };
};
