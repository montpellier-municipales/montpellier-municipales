import {
  component$,
  useSignal,
  useTask$,
  useVisibleTask$,
  $,
} from "@builder.io/qwik";
import { useNavigate, useLocation } from "@builder.io/qwik-city";
import { BudgetExplorer } from "~/components/budget/budget-explorer";
import { ConcoursExplorer } from "~/components/budget/concours-explorer";
import type { BudgetData } from "~/types/budget";
import { useSpeak, inlineTranslate } from "qwik-speak";
import { PersonnelExplorer } from "~/components/budget/personnel-explorer";
import { PatrimoineExplorer } from "~/components/budget/patrimoine-explorer";
import { VilleLoanExplorer } from "~/components/budget/ville-loan-explorer";
import { ApcpExplorer } from "~/components/budget/apcp-explorer";
import type { ApcpData } from "~/types/apcp";
import type { PersonnelLine, AssetLine, LoanLine } from "~/types/ville";
import { Tabs } from "@qwik-ui/headless";
import { Dropdown } from "~/components/ui/dropdown/dropdown";
import * as styles from "~/components/budget/budget-explorer.css";

interface CityBudgetPageProps {
  year: string;
  budgetData: BudgetData;
  personnelData: PersonnelLine[];
  patrimoineData: AssetLine[];
  loanData: LoanLine[];
  apcpData?: ApcpData;
}

const availableYears = [
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
];
const yearOptions = availableYears.map((y) => ({ value: y, label: y }));

export const CityBudgetPage = component$<CityBudgetPageProps>(
  ({ year, budgetData, personnelData, patrimoineData, loanData, apcpData }) => {
    useSpeak({ assets: ["budget"] });
    const t = inlineTranslate();
    const nav = useNavigate();
    const loc = useLocation();
    const lang = loc.params.lang; // Extract primitive to safe capture
    const selectedYear = useSignal(year);

    const tabNames = [
      "budget",
      "personnel",
      "patrimoine",
      "loans",
      "subventions",
      "investissements",
    ];
    const selectedIndex = useSignal(0);
    const initialFilterApcp = useSignal<string>("");

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

    // Sync selectedYear when prop changes
    /*useTask$(({ track }) => {
      track(() => year);
      selectedYear.value = year;
    });*/

    // Handle navigation when year changes
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track }) => {
      const targetYear = track(() => selectedYear.value);
      if (targetYear !== year) {
        const prefix = lang ? `/${lang}` : "";
        nav(`${prefix}/budget/montpellier/${targetYear}/`);
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

    const handleViewBudget = $((apcpId: string) => {
      initialFilterApcp.value = apcpId;
      selectedIndex.value = 0;
    });

    return (
      <div class={styles.pageContainer}>
        <header class={styles.header}>
          <div class={styles.headerContent}>
            <div>
              <h1 class={styles.pageTitle}>
                {t("budget.ville.title", { year })}
              </h1>
            </div>

            <div class={styles.yearSelectorWrapper}>
              <label for="year-select" class={styles.yearSelectorLabel}>
                {t("budget.metropole.yearLabel")}
              </label>
              <div style={{ width: "120px" }}>
                <Dropdown
                  options={yearOptions}
                  value={year}
                  onChange$={(val: string) => {
                    selectedYear.value = val;
                  }}
                  placeholder={year}
                />
              </div>
            </div>
          </div>
        </header>

        <Tabs.Root bind:selectedIndex={selectedIndex}>
          <Tabs.List class={styles.tabList}>
            <Tabs.Tab class={styles.tab}>
              {t("budget.ville.tabs.budget")}
            </Tabs.Tab>
            <Tabs.Tab class={styles.tab}>
              {t("budget.ville.tabs.personnel")}
            </Tabs.Tab>
            <Tabs.Tab class={styles.tab}>
              {t("budget.ville.tabs.patrimoine")}
            </Tabs.Tab>
            <Tabs.Tab class={styles.tab}>
              {t("budget.ville.tabs.loans")}
            </Tabs.Tab>
            <Tabs.Tab class={styles.tab}>
              {t("budget.ville.tabs.subventions")}
            </Tabs.Tab>
            <Tabs.Tab class={styles.tab}>
              Investissements (AP/CP)
            </Tabs.Tab>
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
            <div>
              <h2 class={styles.sectionTitle}>
                {t("budget.ville.personnel.title")}
              </h2>
              <PersonnelExplorer data={personnelData} />
            </div>
          </Tabs.Panel>

          <Tabs.Panel class={styles.tabPanel}>
            <div>
              <h2 class={styles.sectionTitle}>
                {t("budget.ville.patrimoine.title")}
              </h2>
              <PatrimoineExplorer data={patrimoineData} />
            </div>
          </Tabs.Panel>

          <Tabs.Panel class={styles.tabPanel}>
            <div>
              <h2 class={styles.sectionTitle}>
                {t("budget.ville.loans.title")}
              </h2>
              <VilleLoanExplorer data={loanData} />
            </div>
          </Tabs.Panel>

          <Tabs.Panel class={styles.tabPanel}>
            <div>
              <h2 class={styles.sectionTitle}>
                {t("budget.ville.subventions.title")}
              </h2>
              <ConcoursExplorer data={budgetData.concours || []} />
            </div>
          </Tabs.Panel>

          <Tabs.Panel class={styles.tabPanel}>
            <div>
              <h2 class={styles.sectionTitle}>
                Investissements Pluriannuels (AP/CP)
              </h2>
              {apcpData ? (
                <ApcpExplorer
                  data={apcpData}
                  year={year}
                  showCommuneStats={false}
                  onViewBudget$={handleViewBudget}
                />
              ) : (
                <p>Données non disponibles pour cette année.</p>
              )}
            </div>
          </Tabs.Panel>
        </Tabs.Root>
      </div>
    );
  },
);
