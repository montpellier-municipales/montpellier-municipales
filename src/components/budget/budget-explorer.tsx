import { component$, useStore, useComputed$, $ } from "@builder.io/qwik";
import type { BudgetData, BudgetLine } from "~/types/budget";
import type { ApcpData } from "~/types/apcp";
import { BudgetType, BudgetSource } from "~/types/budget";
import * as styles from "./budget-explorer.css";
import { Dropdown } from "../ui/dropdown/dropdown";

interface BudgetExplorerProps {
  data: BudgetData;
  apcpData?: ApcpData;
  initialFilterApcp?: string;
}

// Fonction utilitaire de formatage (hors du composant)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const BudgetExplorer = component$<BudgetExplorerProps>(
  ({ data, apcpData, initialFilterApcp }) => {
    const state = useStore({
      // Filtres
      filterType: BudgetType.Depense as string,
      filterSource: "all",
      filterNature: "all",
      filterApcp: initialFilterApcp || "",
      search: "",

      // Tri
      sortColumn: "montant_realise", // Colonne par défaut
      sortDirection: "desc" as "asc" | "desc",

      // Pagination
      currentPage: 1,
      pageSize: 50,
    });

    // Map des libellés APCP pour affichage
    const apcpMap = useComputed$(() => {
      const map = new Map<string, string>();
      if (apcpData) {
        apcpData.apcps.forEach((a) => map.set(a.id, a.libelle));
      }
      return map;
    });

    // Liste ordonnée des APCP pour le filtre (Tri par montant décroissant)
    const apcpOptions = useComputed$(() => {
      if (!apcpData) return [];
      return [...apcpData.apcps].sort(
        (a, b) => b.montant_ap_vote_anterieur - a.montant_ap_vote_anterieur
      );
    });

    // 1. Extraction des options pour les filtres
    const options = useComputed$(() => {
      const natures = new Map<string, string>();
      data.lines.forEach((line) => {
        if (line.nature_chapitre && line.nature_chapitre_label) {
          natures.set(line.nature_chapitre, line.nature_chapitre_label);
        }
      });
      return {
        natures: Array.from(natures.entries()).sort((a, b) =>
          a[0].localeCompare(b[0])
        ),
      };
    });

    // 2. Filtrage
    const filteredData = useComputed$(() => {
      return data.lines.filter((line) => {
        const matchType =
          state.filterType === "all" || line.type === state.filterType;
        const matchSource =
          state.filterSource === "all" || line.budget === state.filterSource;
        const matchNature =
          state.filterNature === "all" ||
          line.nature_chapitre === state.filterNature;
        const matchApcp =
          state.filterApcp === "" ||
          (line.apcp_id || "")
            .toLowerCase()
            .includes(state.filterApcp.toLowerCase());

        const searchLower = state.search.toLowerCase();
        const matchSearch =
          state.search === "" ||
          line.nature_label.toLowerCase().includes(searchLower) ||
          line.nature_code.toLowerCase().includes(searchLower) ||
          (line.fonction_label?.toLowerCase() || "").includes(searchLower) ||
          (line.nature_chapitre_label?.toLowerCase() || "").includes(
            searchLower
          );

        return (
          matchType && matchSource && matchNature && matchSearch && matchApcp
        );
      });
    });

    // 3. Tri
    const sortedData = useComputed$(() => {
      const data = [...filteredData.value];
      const { sortColumn, sortDirection } = state;

      return data.sort((a, b) => {
        let valA = a[sortColumn as keyof BudgetLine];
        let valB = b[sortColumn as keyof BudgetLine];

        // Gestion des undefined
        if (valA === undefined) valA = "";
        if (valB === undefined) valB = "";

        if (typeof valA === "number" && typeof valB === "number") {
          return sortDirection === "asc" ? valA - valB : valB - valA;
        }

        // Tri alphabétique pour les chaînes
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        return sortDirection === "asc"
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      });
    });

    // 4. Pagination
    const totalPages = useComputed$(() =>
      Math.ceil(sortedData.value.length / state.pageSize)
    );
    const paginatedData = useComputed$(() => {
      const start = (state.currentPage - 1) * state.pageSize;
      return sortedData.value.slice(start, start + state.pageSize);
    });

    // Helpers pour le tri
    const handleSort = $((column: keyof BudgetLine) => {
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

    // Calcul des totaux pour le footer
    const totals = useComputed$(() => {
      return filteredData.value.reduce(
        (acc, line) => {
          acc.vote += line.montant_vote;
          acc.realise += line.montant_realise;
          return acc;
        },
        { vote: 0, realise: 0 }
      );
    });

    return (
      <div class={styles.container}>
        <section class={styles.filterSection}>
          <div class={styles.filterGroup}>
            <label class={styles.label}>Sens</label>
            <Dropdown
              value={state.filterType}
              onChange$={(value) => {
                state.filterType = value;
                state.currentPage = 1;
              }}
              options={[
                { value: BudgetType.Depense, label: "Dépenses" },
                { value: BudgetType.Recette, label: "Recettes" },
              ]}
              placeholder="Sélectionner..."
            />
          </div>

          <div class={styles.filterGroup}>
            <label class={styles.label}>Budget</label>
            <Dropdown
              value={state.filterSource}
              onChange$={(value) => {
                state.filterSource = value;
                state.currentPage = 1;
              }}
              options={[
                { value: "all", label: "Tous" },
                { value: BudgetSource.Principal, label: "Principal" },
                { value: BudgetSource.Parking, label: "Parking" },
                { value: BudgetSource.Assainissement, label: "Assainissement" },
                { value: BudgetSource.Eau, label: "Eau" },
                { value: BudgetSource.Transport, label: "Transport" },
                { value: BudgetSource.Spanc, label: "SPANC" },
              ]}
              placeholder="Sélectionner..."
            />
          </div>

          <div class={styles.filterGroup}>
            <label class={styles.label}>Chapitre (Nature)</label>
            <Dropdown
              value={state.filterNature}
              onChange$={(value) => {
                state.filterNature = value;
                state.currentPage = 1;
              }}
              options={[
                { value: "all", label: "Tous les chapitres" },
                ...options.value.natures.map(([code, label]) => ({
                  value: code,
                  label: `${code} - ${label}`,
                })),
              ]}
              placeholder="Sélectionner..."
            />
          </div>

          <div class={styles.filterGroup}>
            <label class={styles.label}>Investissement (APCP)</label>
            <Dropdown
              value={state.filterApcp}
              onChange$={(value) => {
                state.filterApcp = value;
                state.currentPage = 1;
              }}
              options={[
                { value: "", label: "Tous les programmes" },
                ...apcpOptions.value.map((apcp) => {
                  const parts = [
                    formatCurrency(apcp.montant_ap_vote_anterieur),
                  ];
                  if (apcp.communes && apcp.communes.length > 0) {
                    parts.push(apcp.communes.join(", "));
                  }
                  return {
                    value: apcp.id,
                    label: apcp.libelle,
                    description: parts.join(" • "),
                  };
                }),
              ]}
              placeholder="Choisir un programme..."
            />
          </div>

          <div class={styles.filterGroup}>
            <label class={styles.label}>Recherche</label>
            <input
              type="text"
              class={styles.input}
              placeholder="Mots-clés..."
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
                  onClick$={() => handleSort("type")}
                  style={{ cursor: "pointer" }}
                >
                  Type {getSortIcon("type")}
                </th>
                <th
                  onClick$={() => handleSort("budget")}
                  style={{ cursor: "pointer" }}
                >
                  Budget {getSortIcon("budget")}
                </th>
                <th
                  onClick$={() => handleSort("nature_label")}
                  style={{ cursor: "pointer" }}
                >
                  Nature / Compte {getSortIcon("nature_label")}
                </th>
                <th
                  onClick$={() => handleSort("fonction_label")}
                  style={{ cursor: "pointer" }}
                >
                  Fonction {getSortIcon("fonction_label")}
                </th>
                <th
                  onClick$={() => handleSort("montant_vote")}
                  style={{ cursor: "pointer", textAlign: "right" }}
                >
                  Montant Voté {getSortIcon("montant_vote")}
                </th>
                <th
                  onClick$={() => handleSort("montant_realise")}
                  style={{ cursor: "pointer", textAlign: "right" }}
                >
                  Réalisé {getSortIcon("montant_realise")}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.value.map((line) => (
                <tr key={line.id}>
                  <td>
                    <span
                      class={[
                        styles.typeBadge,
                        line.type === BudgetType.Depense
                          ? styles.badgeDepense
                          : styles.badgeRecette,
                      ]}
                    >
                      {line.type === BudgetType.Depense ? "Dépense" : "Recette"}
                    </span>
                  </td>
                  <td>{line.budget}</td>
                  <td>
                    <div style={{ fontWeight: "bold" }}>
                      {line.nature_label}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#718096" }}>
                      Code: {line.nature_code}
                    </div>
                  </td>
                  <td>
                    {line.apcp_id && (
                      <div
                        style={{
                          marginTop: "0.25rem",
                          fontSize: "0.75rem",
                          color: "#2b6cb0",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                        onClick$={() => (state.filterApcp = line.apcp_id!)}
                        title={`Code APCP: ${line.apcp_id}`}
                      >
                        {apcpMap.value.get(line.apcp_id) || line.apcp_id}
                      </div>
                    )}
                    {line.fonction_label || "-"}
                    {line.fonction_code && (
                      <div style={{ fontSize: "0.8rem", color: "#718096" }}>
                        Code: {line.fonction_code}
                      </div>
                    )}
                  </td>
                  <td
                    class={[
                      styles.amount,
                      line.montant_vote < 0 && styles.negative,
                    ]}
                  >
                    {formatCurrency(line.montant_vote)}
                  </td>
                  <td
                    class={[
                      styles.amount,
                      line.montant_realise < 0 && styles.negative,
                    ]}
                  >
                    {formatCurrency(line.montant_realise)}
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
                <td colSpan={4} style={{ textAlign: "right", padding: "1rem" }}>
                  Total
                </td>
                <td class={styles.amount} style={{ padding: "1rem" }}>
                  {formatCurrency(totals.value.vote)}
                </td>
                <td class={styles.amount} style={{ padding: "1rem" }}>
                  {formatCurrency(totals.value.realise)}
                </td>
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
            {sortedData.value.length} lignes)
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
  }
);
