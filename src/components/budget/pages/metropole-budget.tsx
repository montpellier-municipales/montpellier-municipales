import { component$, useSignal, $, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { useNavigate, useLocation } from "@builder.io/qwik-city";
import { BudgetExplorer } from "~/components/budget/budget-explorer";
import { LoanExplorer } from "~/components/budget/loan-explorer";
import { ApcpExplorer } from "~/components/budget/apcp-explorer";
import { ConcoursExplorer } from "~/components/budget/concours-explorer";
import type { BudgetData } from "~/types/budget";
import type { LoanData } from "~/types/loan";
import type { ApcpData } from "~/types/apcp";
import { useSpeak, inlineTranslate } from "qwik-speak";
import { Tabs } from "@qwik-ui/headless";
import * as styles from "~/components/budget/budget-explorer.css";

interface MetropoleBudgetPageProps {
  year: string;
  budgetData: BudgetData;
  loanData: LoanData;
  apcpData: ApcpData;
}

export const MetropoleBudgetPage = component$<MetropoleBudgetPageProps>(({ year, budgetData, loanData, apcpData }) => {
  useSpeak({ assets: ["budget"] });
  const t = inlineTranslate();
  const nav = useNavigate();
  const loc = useLocation();
  
  const tabNames = ["budget", "loans", "apcp", "subventions", "evolution"];
  const selectedIndex = useSignal(0);
  const initialFilterApcp = useSignal<string>("");
  const availableYears = ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];

  // Sync state FROM URL (SSR safe)
  useTask$(({ track }) => {
    const tab = track(() => loc.url.searchParams.get("tab"));
    if (tab) {
      const index = tabNames.indexOf(tab);
      if (index !== -1 && index !== selectedIndex.value) {
        selectedIndex.value = index;
      }
    }
  });

  // Sync state TO URL (Browser only)
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    const index = track(() => selectedIndex.value);
    const url = new URL(window.location.href);
    const currentTab = url.searchParams.get("tab");
    if (tabNames[index] !== currentTab) {
      url.searchParams.set("tab", tabNames[index]);
      nav(url.pathname + url.search, { replaceState: true });
    }
  });

  const handleViewBudget = $((apcpId: string) => {
    initialFilterApcp.value = apcpId;
    selectedIndex.value = 0;
  });

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "0.5rem" }}>
              {t("budget.metropole.title", { year })}
            </h1>
            <p style={{ color: "#4A5568", fontSize: "1.1rem" }}>
              {t("budget.metropole.subtitle")}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label for="year-select" style={{ fontWeight: "600", color: "#4A5568" }}>{t("budget.metropole.yearLabel")}</label>
            <select
              id="year-select"
              onChange$={(e, el) => {
                const prefix = loc.params.lang ? `/${loc.params.lang}` : "";
                nav(`${prefix}/budget/montpellier-metropole/${el.value}/`);
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
              {availableYears.map(y => (
                <option key={y} value={y} selected={y === year}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <Tabs.Root bind:selectedIndex={selectedIndex}>
        <Tabs.List class={styles.tabList}>
          <Tabs.Tab class={styles.tab}>{t("budget.metropole.tabs.budget")}</Tabs.Tab>
          <Tabs.Tab class={styles.tab}>{t("budget.metropole.tabs.loans")}</Tabs.Tab>
          <Tabs.Tab class={styles.tab}>{t("budget.metropole.tabs.apcp")}</Tabs.Tab>
          <Tabs.Tab class={styles.tab}>{t("budget.metropole.tabs.subventions")}</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel class={styles.tabPanel}>
          {budgetData && (
            <BudgetExplorer 
              data={budgetData} 
              apcpData={apcpData}
              initialFilterApcp={initialFilterApcp.value} 
            />
          )}
        </Tabs.Panel>

        <Tabs.Panel class={styles.tabPanel}>
          {loanData && <LoanExplorer data={loanData} />}
        </Tabs.Panel>

        <Tabs.Panel class={styles.tabPanel}>
          {apcpData && (
            <ApcpExplorer 
              data={apcpData} 
              onViewBudget$={handleViewBudget}
              year={year}
            />
          )}
        </Tabs.Panel>

        <Tabs.Panel class={styles.tabPanel}>
          <div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{t("budget.metropole.subventions.title")}</h2>
            <ConcoursExplorer data={budgetData.concours || []} />
          </div>
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  );
});