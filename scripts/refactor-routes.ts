import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";

const YEARS = ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];
const ROOT_DIR = process.cwd();

function createCityRoute(year: string) {
  const dir = join(ROOT_DIR, "src/routes/budget/montpellier", year);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const content = `import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { CityBudgetPage } from "~/components/budget/pages/city-budget";
import { inlineTranslate } from "qwik-speak";
import budgetData from "~/content/data/ville_budget_${year}.json";
import personnelData from "~/content/data/ville_personnel.json";
import patrimoineData from "~/content/data/ville_patrimoine.json";
import loanData from "~/content/data/ville_loans.json";
import type { PersonnelLine, AssetLine, LoanLine } from "~/types/ville";
import type { BudgetData } from "~/types/budget";

export default component$(() => {
  const currentPersonnel = (personnelData as any)["${year}"] as PersonnelLine[] || [];
  const currentPatrimoine = (patrimoineData as any)["${year}"] as AssetLine[] || [];
  const currentLoans = (loanData as any)["${year}"] as LoanLine[] || [];

  return (
    <CityBudgetPage 
      year="${year}" 
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
    title: t("budget.ville.title", { year: "${year}" }),
    meta: [
      {
        name: "description",
        content: t("budget.ville.metaDescription", { year: "${year}" }),
      },
    ],
  };
};
`;
  writeFileSync(join(dir, "index.tsx"), content);
  console.log(`Created City Route for ${year}`);
}

function createMetropoleRoute(year: string) {
  const dir = join(ROOT_DIR, "src/routes/budget-montpellier-metropole", year);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const budgetSuffix = year === "2025" ? "_processed" : "";
  
  const content = `import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { MetropoleBudgetPage } from "~/components/budget/pages/metropole-budget";
import { inlineTranslate } from "qwik-speak";
import budgetData from "~/content/data/budget_${year}${budgetSuffix}.json";
import loanData from "~/content/data/loans_${year}.json";
import apcpData from "~/content/data/apcp_${year}.json";
import type { BudgetData } from "~/types/budget";
import type { LoanData } from "~/types/loan";
import type { ApcpData } from "~/types/apcp";

export default component$(() => {
  return (
    <MetropoleBudgetPage 
      year="${year}" 
      budgetData={budgetData as BudgetData} 
      loanData={loanData as LoanData} 
      apcpData={apcpData as ApcpData} 
    />
  );
});

export const head: DocumentHead = () => {
  const t = inlineTranslate();
  return {
    title: t("budget.metropole.title", { year: "${year}" }),
    meta: [
      {
        name: "description",
        content: t("budget.metropole.metaDescription", { year: "${year}" }),
      },
    ],
  };
};
`;
  writeFileSync(join(dir, "index.tsx"), content);
  console.log(`Created Metropole Route for ${year}`);
}

function createI18nRoutes(year: string) {
  // City
  const cityDir = join(ROOT_DIR, "src/routes/[lang]/budget/montpellier", year);
  if (!existsSync(cityDir)) mkdirSync(cityDir, { recursive: true });
  
  const cityContent = `import BudgetPage, { head } from "~/routes/budget/montpellier/${year}/index";
export { head };
export default BudgetPage;
`;
  writeFileSync(join(cityDir, "index.tsx"), cityContent);

  // Metropole
  const metropoleDir = join(ROOT_DIR, "src/routes/[lang]/budget-montpellier-metropole", year);
  if (!existsSync(metropoleDir)) mkdirSync(metropoleDir, { recursive: true });

  const metropoleContent = `import BudgetPage, { head } from "~/routes/budget-montpellier-metropole/${year}/index";
export { head };
export default BudgetPage;
`;
  writeFileSync(join(metropoleDir, "index.tsx"), metropoleContent);
  
  console.log(`Created I18n Routes for ${year}`);
}

function main() {
  const oldCityDir = join(ROOT_DIR, "src/routes/budget/montpellier/[year]");
  if (existsSync(oldCityDir)) {
      rmSync(oldCityDir, { recursive: true, force: true });
      console.log("Removed old City dynamic route");
  }

  const oldMetropoleDir = join(ROOT_DIR, "src/routes/budget-montpellier-metropole/[year]");
  if (existsSync(oldMetropoleDir)) {
      rmSync(oldMetropoleDir, { recursive: true, force: true });
      console.log("Removed old Metropole dynamic route");
  }

  const oldCityI18nDir = join(ROOT_DIR, "src/routes/[lang]/budget/montpellier/[year]");
  if (existsSync(oldCityI18nDir)) {
      rmSync(oldCityI18nDir, { recursive: true, force: true });
      console.log("Removed old City I18n dynamic route");
  }

  const oldMetropoleI18nDir = join(ROOT_DIR, "src/routes/[lang]/budget-montpellier-metropole/[year]");
  if (existsSync(oldMetropoleI18nDir)) {
      rmSync(oldMetropoleI18nDir, { recursive: true, force: true });
      console.log("Removed old Metropole I18n dynamic route");
  }

  YEARS.forEach(year => {
    createCityRoute(year);
    createMetropoleRoute(year);
    createI18nRoutes(year);
  });
}

main();