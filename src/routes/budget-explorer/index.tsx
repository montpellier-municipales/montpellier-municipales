import { component$, useSignal, $, useComputed$ } from "@builder.io/qwik";
import { routeLoader$, useLocation, useNavigate, type DocumentHead } from "@builder.io/qwik-city";
import { BudgetExplorer } from "~/components/budget/budget-explorer";
import { LoanExplorer } from "~/components/budget/loan-explorer";
import { ApcpExplorer } from "~/components/budget/apcp-explorer";
import { BudgetEvolutionChart } from "~/components/budget/charts/budget-evolution-chart";
import type { BudgetData } from "~/types/budget";
import type { LoanData } from "~/types/loan";
import type { ApcpData } from "~/types/apcp";

const AVAILABLE_YEARS = ["2018", "2019", "2020", "2021", "2022", "2023", "2025"];
const DEFAULT_YEAR = "2025";

export const useBudgetData = routeLoader$(async ({ query }) => {
  const year = query.get("year") || DEFAULT_YEAR;
  
  // Mapping explicite pour que Vite bundle correctement les fichiers
  const files: Record<string, () => Promise<any>> = {
    "2018": () => import("~/content/data/budget_2018.json"),
    "2019": () => import("~/content/data/budget_2019.json"),
    "2020": () => import("~/content/data/budget_2020.json"),
    "2021": () => import("~/content/data/budget_2021.json"),
    "2022": () => import("~/content/data/budget_2022.json"),
    "2023": () => import("~/content/data/budget_2023.json"),
    "2025": () => import("~/content/data/budget_2025_processed.json"),
  };

  const loader = files[year] || files[DEFAULT_YEAR];
  const module = await loader();
  return module.default as BudgetData;
});

export const useLoanData = routeLoader$(async ({ query }) => {
  const year = query.get("year") || DEFAULT_YEAR;
  
  const files: Record<string, () => Promise<any>> = {
    "2018": () => import("~/content/data/loans_2018.json"),
    "2019": () => import("~/content/data/loans_2019.json"),
    "2020": () => import("~/content/data/loans_2020.json"),
    "2021": () => import("~/content/data/loans_2021.json"),
    "2022": () => import("~/content/data/loans_2022.json"),
    "2023": () => import("~/content/data/loans_2023.json"),
    "2025": () => import("~/content/data/loans_2025.json"),
  };

  const loader = files[year] || files[DEFAULT_YEAR];
  const module = await loader();
  return module.default as LoanData;
});

export const useApcpData = routeLoader$(async ({ query }) => {
  const year = query.get("year") || DEFAULT_YEAR;
  
  const files: Record<string, () => Promise<any>> = {
    "2018": () => import("~/content/data/apcp_2018.json"),
    "2019": () => import("~/content/data/apcp_2019.json"),
    "2020": () => import("~/content/data/apcp_2020.json"),
    "2021": () => import("~/content/data/apcp_2021.json"),
    "2022": () => import("~/content/data/apcp_2022.json"),
    "2023": () => import("~/content/data/apcp_2023.json"),
    "2025": () => import("~/content/data/apcp_2025.json"),
  };

  const loader = files[year] || files[DEFAULT_YEAR];
  const module = await loader();
  return module.default as ApcpData;
});

export default component$(() => {
  const budgetData = useBudgetData();
  const loanData = useLoanData();
  const apcpData = useApcpData();
  
  const location = useLocation();
  const nav = useNavigate();
  
  const activeTab = useSignal<"evolution" | "budget" | "loans" | "apcp">("evolution");
  const initialFilterApcp = useSignal<string>("");

  const currentYear = useComputed$(() => {
    return location.url.searchParams.get("year") || DEFAULT_YEAR;
  });

  const handleViewBudget = $((apcpId: string) => {
    initialFilterApcp.value = apcpId;
    activeTab.value = "budget";
  });

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "0.5rem" }}>
              Explorateur du Budget {activeTab.value === "evolution" ? "2018-2025" : currentYear.value}
            </h1>
            <p style={{ color: "#4A5568", fontSize: "1.1rem" }}>
              Plongez dans les détails du budget et de la dette de Montpellier Méditerranée Métropole. 
            </p>
          </div>

          {activeTab.value !== "evolution" && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <label for="year-select" style={{ fontWeight: "600", color: "#4A5568" }}>Année :</label>
              <select
                id="year-select"
                value={currentYear.value}
                onChange$={(e, el) => {
                  const url = new URL(location.url);
                  url.searchParams.set("year", el.value);
                  nav(url.toString());
                }}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #cbd5e0",
                  fontSize: "1rem",
                  backgroundColor: "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: "#2d3748"
                }}
              >
                {AVAILABLE_YEARS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </header>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid #e2e8f0", overflowX: "auto" }}>
        <button
          onClick$={() => (activeTab.value = "evolution")}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1.1rem",
            fontWeight: "600",
            border: "none",
            background: "none",
            borderBottom: activeTab.value === "evolution" ? "3px solid #3182ce" : "3px solid transparent",
            color: activeTab.value === "evolution" ? "#2b6cb0" : "#718096",
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          Évolution
        </button>
        <button
          onClick$={() => (activeTab.value = "budget")}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1.1rem",
            fontWeight: "600",
            border: "none",
            background: "none",
            borderBottom: activeTab.value === "budget" ? "3px solid #3182ce" : "3px solid transparent",
            color: activeTab.value === "budget" ? "#2b6cb0" : "#718096",
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          Budget
        </button>
        <button
          onClick$={() => (activeTab.value = "loans")}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1.1rem",
            fontWeight: "600",
            border: "none",
            background: "none",
            borderBottom: activeTab.value === "loans" ? "3px solid #3182ce" : "3px solid transparent",
            color: activeTab.value === "loans" ? "#2b6cb0" : "#718096",
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          Emprunts (Dette)
        </button>
        <button
          onClick$={() => (activeTab.value = "apcp")}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1.1rem",
            fontWeight: "600",
            border: "none",
            background: "none",
            borderBottom: activeTab.value === "apcp" ? "3px solid #3182ce" : "3px solid transparent",
            color: activeTab.value === "apcp" ? "#2b6cb0" : "#718096",
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          Investissements (AP/CP)
        </button>
      </div>
      
      {activeTab.value === "evolution" && <BudgetEvolutionChart />}
      {activeTab.value === "budget" && (
        <BudgetExplorer 
          data={budgetData.value} 
          apcpData={apcpData.value}
          initialFilterApcp={initialFilterApcp.value} 
        />
      )}
      {activeTab.value === "loans" && <LoanExplorer data={loanData.value} />}
      {activeTab.value === "apcp" && (
        <ApcpExplorer 
          data={apcpData.value} 
          onViewBudget$={handleViewBudget}
          year={currentYear.value}
        />
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Explorateur du Budget et de la Dette 2025 - Montpellier Municipales 2026",
  meta: [
    {
      name: "description",
      content: "Explorez les données brutes du budget et les emprunts de la Métropole de Montpellier. Transparence et détails des finances publiques.",
    },
  ],
};