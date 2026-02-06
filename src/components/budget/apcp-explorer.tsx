import {
  component$,
  useStore,
  useComputed$,
  $,
  type PropFunction,
  useSignal,
} from "@builder.io/qwik";
import type { ApcpData, Apcp } from "~/types/apcp";
import * as styles from "./budget-explorer.css";
import { CommuneBudgetChart } from "../charts/commune-budget-chart";
import { Dropdown } from "../ui/dropdown/dropdown";
import { CustomCollapsible } from "../ui/collapsible/collapsible";

interface ApcpExplorerProps {
  data: ApcpData;
  onViewBudget$?: PropFunction<(apcpId: string) => void>;
  year?: string;
  showCommuneStats?: boolean;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const ApcpExplorer = component$<ApcpExplorerProps>(
  ({ data, onViewBudget$, year = "2025", showCommuneStats = true }) => {
    const chartOpen = useSignal(false);
    const state = useStore({
      search: "",
      filterCommune: "",
      sortColumn: "cp_realise",
      sortDirection: "desc" as "asc" | "desc",
      currentPage: 1,
      pageSize: 20,
    });

    // Extract unique communes
    const communeOptions = useComputed$(() => {
      if (!showCommuneStats) return [];
      const communes = new Set<string>();
      data.apcps.forEach((apcp) => {
        apcp.communes?.forEach((c) => communes.add(c));
      });
      return Array.from(communes).sort();
    });

    const filteredData = useComputed$(() => {
      return data.apcps.filter((apcp) => {
        const searchLower = state.search.toLowerCase();
        const matchesSearch =
          state.search === "" ||
          apcp.libelle.toLowerCase().includes(searchLower) ||
          apcp.id.toLowerCase().includes(searchLower) ||
          apcp.chapitre.includes(searchLower);

        const matchesCommune =
            !showCommuneStats ||
          state.filterCommune === "" ||
          (state.filterCommune === "none"
            ? !apcp.communes || apcp.communes.length === 0
            : apcp.communes && apcp.communes.includes(state.filterCommune));

        return matchesSearch && matchesCommune;
      });
    });

    const sortedData = useComputed$(() => {
      const data = [...filteredData.value];
      const { sortColumn, sortDirection } = state;

      return data.sort((a, b) => {
        let valA = a[sortColumn as keyof Apcp];
        let valB = b[sortColumn as keyof Apcp];

        if (typeof valA === "number" && typeof valB === "number") {
          return sortDirection === "asc" ? valA - valB : valB - valA;
        }

        valA = String(valA || "").toLowerCase();
        valB = String(valB || "").toLowerCase();
        return sortDirection === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
    });

    const totalPages = useComputed$(() =>
      Math.ceil(sortedData.value.length / state.pageSize),
    );
    const paginatedData = useComputed$(() => {
      const start = (state.currentPage - 1) * state.pageSize;
      return sortedData.value.slice(start, start + state.pageSize);
    });

    const totals = useComputed$(() => {
      return filteredData.value.reduce(
        (acc, apcp) => {
          acc.ap_anterieur += apcp.montant_ap_vote_anterieur;
          acc.cp_vote += apcp.cp_vote;
          acc.cp_realise += apcp.cp_realise;
          acc.cp_rar += apcp.cp_reste_a_realiser;
          return acc;
        },
        { ap_anterieur: 0, cp_vote: 0, cp_realise: 0, cp_rar: 0 },
      );
    });

    const handleSort = $((column: keyof Apcp) => {
      if (state.sortColumn === column) {
        state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
      } else {
        state.sortColumn = column;
        state.sortDirection = "desc";
      }
    });

    const getSortIcon = (column: string) => {
      if (state.sortColumn !== column)
        return <span style={{ opacity: 0.3 }}>⇅</span>;
      return state.sortDirection === "asc" ? "▲" : "▼";
    };

    return (
      <div class={styles.container}>
        {showCommuneStats && (
          <CustomCollapsible
            label="📊 Voir la répartition par commune"
            bindOpen={chartOpen}
          >
            <CommuneBudgetChart data={data} />
          </CustomCollapsible>
        )}

        <section class={styles.filterSection}>
          {showCommuneStats && (
            <div class={styles.filterGroup}>
              <label class={styles.label}>Filtrer par commune</label>
              <Dropdown
                value={state.filterCommune}
                onChange$={(value) => {
                  state.filterCommune = value;
                  state.currentPage = 1;
                }}
                options={[
                  { value: "", label: "Toutes les communes" },
                  { value: "none", label: "Métropole / Non affecté" },
                  ...communeOptions.value.map((c) => ({ value: c, label: c })),
                ]}
                placeholder="Choisir une commune..."
              />
            </div>
          )}

          <div class={styles.filterGroup}>
            <label class={styles.label}>Recherche</label>
            <input
              type="text"
              class={styles.input}
              placeholder="Libellé, code AP..."
              value={state.search}
              onInput$={(e, el) => {
                state.search = el.value;
                state.currentPage = 1;
              }}
            />
          </div>
        </section>

        <div class={styles.tableContainer}>
          <table class={styles.table}>
            <thead>
              <tr>
                <th
                  onClick$={() => handleSort("id")}
                  style={{ cursor: "pointer" }}
                >
                  Code {getSortIcon("id")}
                </th>
                <th
                  onClick$={() => handleSort("libelle")}
                  style={{ cursor: "pointer" }}
                >
                  Libellé AP {getSortIcon("libelle")}
                </th>
                <th
                  onClick$={() => handleSort("montant_ap_vote_anterieur")}
                  style={{ cursor: "pointer", textAlign: "right" }}
                >
                  AP Votée (N-1) {getSortIcon("montant_ap_vote_anterieur")}
                </th>
                <th
                  onClick$={() => handleSort("cp_vote")}
                  style={{ cursor: "pointer", textAlign: "right" }}
                >
                  CP Voté {year} {getSortIcon("cp_vote_2025")}
                </th>
                <th
                  onClick$={() => handleSort("cp_realise")}
                  style={{ cursor: "pointer", textAlign: "right" }}
                >
                  CP Réalisé {year} {getSortIcon("cp_realise_2025")}
                </th>
                <th
                  onClick$={() => handleSort("cp_reste_a_realiser")}
                  style={{ cursor: "pointer", textAlign: "right" }}
                >
                  Reste à Réaliser {getSortIcon("cp_reste_a_realiser")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.value.map((apcp) => (
                <tr key={apcp.id}>
                  <td style={{ fontWeight: "bold", fontSize: "0.85rem" }}>
                    {apcp.id}
                  </td>
                  <td>
                    <div>{apcp.libelle}</div>
                    <div style={{ fontSize: "0.75rem", color: "#718096" }}>
                      Chapitre {apcp.chapitre} • {apcp.nombre_lignes} lignes
                    </div>
                  </td>
                  <td class={styles.amount}>
                    {formatCurrency(apcp.montant_ap_vote_anterieur)}
                  </td>
                  <td class={styles.amount}>{formatCurrency(apcp.cp_vote)}</td>
                  <td class={styles.amount}>
                    {formatCurrency(apcp.cp_realise)}
                  </td>
                  <td class={styles.amount}>
                    {formatCurrency(apcp.cp_reste_a_realiser)}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {onViewBudget$ && apcp.nombre_lignes > 0 && (
                      <button
                        class={styles.pageButton} // Reuse generic button style
                        style={{
                          fontSize: "0.75rem",
                          padding: "0.25rem 0.5rem",
                        }}
                        onClick$={() => onViewBudget$(apcp.id)}
                      >
                        Détail
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr
                style={{
                  fontWeight: "bold",
                  backgroundColor: "#f7fafc",
                  borderTop: "2px solid #e2e8f0",
                }}
              >
                <td colSpan={2} style={{ textAlign: "right", padding: "1rem" }}>
                  Total
                </td>
                <td class={styles.amount} style={{ padding: "1rem" }}>
                  {formatCurrency(totals.value.ap_anterieur)}
                </td>
                <td class={styles.amount} style={{ padding: "1rem" }}>
                  {formatCurrency(totals.value.cp_vote)}
                </td>
                <td class={styles.amount} style={{ padding: "1rem" }}>
                  {formatCurrency(totals.value.cp_realise)}
                </td>
                <td class={styles.amount} style={{ padding: "1rem" }}>
                  {formatCurrency(totals.value.cp_rar)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class={styles.pagination}>
          <button
            class={styles.pageButton}
            disabled={state.currentPage === 1}
            onClick$={() => state.currentPage--}
          >
            Précédent
          </button>
          <span>
            Page {state.currentPage} sur {totalPages.value || 1} (
            {sortedData.value.length} AP)
          </span>
          <button
            class={styles.pageButton}
            disabled={state.currentPage >= totalPages.value}
            onClick$={() => state.currentPage++}
          >
            Suivant
          </button>
        </div>
      </div>
    );
  },
);
