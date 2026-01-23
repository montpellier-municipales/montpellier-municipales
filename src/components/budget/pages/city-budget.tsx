import { component$, useSignal, useTask$, useVisibleTask$ } from "@builder.io/qwik";
import { useNavigate, useLocation } from "@builder.io/qwik-city";
import { BudgetExplorer } from "~/components/budget/budget-explorer";
import { ConcoursExplorer } from "~/components/budget/concours-explorer";
import type { BudgetData } from "~/types/budget";
import { useSpeak, inlineTranslate } from "qwik-speak";
import { PersonnelExplorer } from "~/components/budget/personnel-explorer";
import { PatrimoineExplorer } from "~/components/budget/patrimoine-explorer";
import { VilleLoanExplorer } from "~/components/budget/ville-loan-explorer";
import type { PersonnelLine, AssetLine, LoanLine } from "~/types/ville";
import { Tabs } from "@qwik-ui/headless";
import * as styles from "~/components/budget/budget-explorer.css";

interface CityBudgetPageProps {
  year: string;
  budgetData: BudgetData;
  personnelData: PersonnelLine[];
  patrimoineData: AssetLine[];
  loanData: LoanLine[];
}

export const CityBudgetPage = component$<CityBudgetPageProps>(({ year, budgetData, personnelData, patrimoineData, loanData }) => {
  useSpeak({ assets: ["budget"] });
  const t = inlineTranslate();
  const nav = useNavigate();
  const loc = useLocation();
  const availableYears = ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];

  const tabNames = ["budget", "personnel", "patrimoine", "loans", "subventions"];
  const selectedIndex = useSignal(0);

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

  // Sync state TO URL (Browser only to avoid non-serializable URL object issues in SSG)
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

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <header style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "0.5rem" }}>
              {t("budget.ville.title", { year })}
            </h1>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label for="year-select" style={{ fontWeight: "600", color: "#4A5568" }}>{t("budget.metropole.yearLabel")}</label>
            <select
              id="year-select"
              onChange$={(e, el) => {
                const prefix = loc.params.lang ? `/${loc.params.lang}` : "";
                nav(`${prefix}/budget/montpellier/${el.value}/`);
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
          <Tabs.Tab class={styles.tab}>{t("budget.ville.tabs.budget")}</Tabs.Tab>
          <Tabs.Tab class={styles.tab}>{t("budget.ville.tabs.personnel")}</Tabs.Tab>
          <Tabs.Tab class={styles.tab}>{t("budget.ville.tabs.patrimoine")}</Tabs.Tab>
          <Tabs.Tab class={styles.tab}>{t("budget.ville.tabs.loans")}</Tabs.Tab>
          <Tabs.Tab class={styles.tab}>{t("budget.ville.tabs.subventions")}</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel class={styles.tabPanel}>
          {budgetData && <BudgetExplorer data={budgetData} />}
        </Tabs.Panel>

        <Tabs.Panel class={styles.tabPanel}>
          <div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{t("budget.ville.personnel.title")}</h2>
            <PersonnelExplorer data={personnelData} />
          </div>
        </Tabs.Panel>

        <Tabs.Panel class={styles.tabPanel}>
          <div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{t("budget.ville.patrimoine.title")}</h2>
            <PatrimoineExplorer data={patrimoineData} />
          </div>
        </Tabs.Panel>

        <Tabs.Panel class={styles.tabPanel}>
          <div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{t("budget.ville.loans.title")}</h2>
            <VilleLoanExplorer data={loanData} />
          </div>
        </Tabs.Panel>

        <Tabs.Panel class={styles.tabPanel}>
          <div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{t("budget.ville.subventions.title")}</h2>
            <ConcoursExplorer data={budgetData.concours || []} />
          </div>
        </Tabs.Panel>
      </Tabs.Root>
    </div>
  );
});