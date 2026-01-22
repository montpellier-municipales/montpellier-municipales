import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { MetropoleBudgetPage } from "~/components/budget/pages/metropole-budget";
import { inlineTranslate } from "qwik-speak";
import budgetData from "~/content/data/budget_2025_processed.json";
import loanData from "~/content/data/loans_2025.json";
import apcpData from "~/content/data/apcp_2025.json";
import type { BudgetData } from "~/types/budget";
import type { LoanData } from "~/types/loan";
import type { ApcpData } from "~/types/apcp";

export default component$(() => {
  return (
    <MetropoleBudgetPage 
      year="2025" 
      budgetData={budgetData as BudgetData} 
      loanData={loanData as LoanData} 
      apcpData={apcpData as ApcpData} 
    />
  );
});

export const head: DocumentHead = () => {
  const t = inlineTranslate();
  return {
    title: t("budget.metropole.title", { year: "2025" }),
    meta: [
      {
        name: "description",
        content: t("budget.metropole.metaDescription", { year: "2025" }),
      },
    ],
  };
};
