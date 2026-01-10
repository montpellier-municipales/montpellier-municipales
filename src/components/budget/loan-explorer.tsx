import { component$, useStore, useComputed$, $ } from "@builder.io/qwik";
import type { LoanData, Loan } from "~/types/loan";
import { BudgetSource } from "~/types/budget";
import * as styles from "./budget-explorer.css"; // Réutilisation des styles

interface LoanExplorerProps {
  data: LoanData;
}

// Fonction utilitaire de formatage (hors du composant)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatPercent = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 3,
    }).format(amount / 100);
};

export const LoanExplorer = component$<LoanExplorerProps>(({ data }) => {
  const state = useStore({
    // Filtres
    filterBudget: "all",
    search: "",
    
    // Tri
    sortColumn: "capital_restant_fin", // Colonne par défaut
    sortDirection: "desc" as "asc" | "desc",
    
    // Pagination
    currentPage: 1,
    pageSize: 20,
  });

  // 2. Filtrage
  const filteredData = useComputed$(() => {
    return data.loans.filter((loan) => {
      const matchBudget = state.filterBudget === "all" || loan.budget === state.filterBudget;
      
      const searchLower = state.search.toLowerCase();
      const matchSearch = state.search === "" || 
        loan.preteur.toLowerCase().includes(searchLower) ||
        loan.libelle.toLowerCase().includes(searchLower) ||
        loan.numero_contrat.toLowerCase().includes(searchLower);

      return matchBudget && matchSearch;
    });
  });

  // 3. Tri
  const sortedData = useComputed$(() => {
    const data = [...filteredData.value];
    const { sortColumn, sortDirection } = state;

    return data.sort((a, b) => {
      let valA = a[sortColumn as keyof Loan];
      let valB = b[sortColumn as keyof Loan];

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
  const totalPages = useComputed$(() => Math.ceil(sortedData.value.length / state.pageSize));
  const paginatedData = useComputed$(() => {
    const start = (state.currentPage - 1) * state.pageSize;
    return sortedData.value.slice(start, start + state.pageSize);
  });

  // Totaux
  const totals = useComputed$(() => {
    return filteredData.value.reduce(
        (acc, loan) => {
            acc.initial += loan.montant_initial;
            acc.restant += loan.capital_restant_fin;
            acc.annuite += loan.annuite_totale;
            return acc;
        },
        { initial: 0, restant: 0, annuite: 0 }
    );
  });

  // Helpers pour le tri
  const handleSort = $((column: keyof Loan) => {
    if (state.sortColumn === column) {
      state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
    } else {
      state.sortColumn = column;
      state.sortDirection = "desc";
    }
  });

  const getSortIcon = (column: string) => {
    if (state.sortColumn !== column) return <span style={{ opacity: 0.3 }}>⇅</span>;
    return state.sortDirection === "asc" ? "▲" : "▼";
  };

  return (
    <div class={styles.container}>
      <section class={styles.filterSection}>
        <div class={styles.filterGroup}>
          <label class={styles.label}>Budget</label>
          <select 
            class={styles.select}
            value={state.filterBudget}
            onChange$={(e, el) => { state.filterBudget = el.value; state.currentPage = 1; }}
          >
            <option value="all">Tous</option>
            <option value={BudgetSource.Principal}>Principal</option>
            <option value={BudgetSource.Parking}>Parking</option>
            <option value={BudgetSource.Assainissement}>Assainissement</option>
            <option value={BudgetSource.Eau}>Eau</option>
            <option value={BudgetSource.Transport}>Transport</option>
            <option value={BudgetSource.Spanc}>SPANC</option>
          </select>
        </div>

        <div class={styles.filterGroup}>
          <label class={styles.label}>Recherche</label>
          <input 
            type="text"
            class={styles.input}
            placeholder="Banque, objet, contrat..."
            value={state.search}
            onInput$={(e, el) => { state.search = el.value; state.currentPage = 1; }}
          />
        </div>
      </section>

      <div class={styles.tableContainer}>
        <table class={styles.table}>
          <thead>
            <tr>
              <th onClick$={() => handleSort("preteur")} style={{ cursor: "pointer" }}>
                Prêteur {getSortIcon("preteur")}
              </th>
              <th onClick$={() => handleSort("libelle")} style={{ cursor: "pointer" }}>
                Objet / Contrat {getSortIcon("libelle")}
              </th>
              <th onClick$={() => handleSort("annee_encaisse")} style={{ cursor: "pointer" }}>
                Année {getSortIcon("annee_encaisse")}
              </th>
              <th onClick$={() => handleSort("taux_actuel")} style={{ cursor: "pointer", textAlign: "right" }}>
                Taux Actuel {getSortIcon("taux_actuel")}
              </th>
              <th onClick$={() => handleSort("duree_restante")} style={{ cursor: "pointer", textAlign: "right" }}>
                Durée Rest. {getSortIcon("duree_restante")}
              </th>
              <th onClick$={() => handleSort("capital_restant_fin")} style={{ cursor: "pointer", textAlign: "right" }}>
                Capital Restant {getSortIcon("capital_restant_fin")}
              </th>
              <th onClick$={() => handleSort("annuite_totale")} style={{ cursor: "pointer", textAlign: "right" }}>
                Annuité 2025 {getSortIcon("annuite_totale")}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.value.map((loan) => (
              <tr key={loan.id}>
                <td style={{ fontWeight: "bold" }}>{loan.preteur}</td>
                <td>
                  <div>{loan.libelle}</div>
                  <div style={{ fontSize: "0.75rem", color: "#718096" }}>{loan.numero_contrat}</div>
                  <div style={{ fontSize: "0.75rem", color: "#718096" }}>
                    {loan.type_taux === "V" ? `Variable (${loan.index_taux})` : "Fixe"} 
                    {loan.taux_marge ? ` / Marge: ${loan.taux_marge}` : ""}
                  </div>
                </td>
                <td>{loan.annee_encaisse}</td>
                <td class={styles.amount}>{formatPercent(loan.taux_actuel)}</td>
                <td class={styles.amount}>{loan.duree_restante.toFixed(1)} ans</td>
                <td class={styles.amount}>{formatCurrency(loan.capital_restant_fin)}</td>
                <td class={styles.amount}>{formatCurrency(loan.annuite_totale)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ fontWeight: "bold", backgroundColor: "#f7fafc", borderTop: "2px solid #e2e8f0" }}>
              <td colSpan={5} style={{ textAlign: "right", padding: "1rem" }}>Total</td>
              <td class={styles.amount} style={{ padding: "1rem" }}>{formatCurrency(totals.value.restant)}</td>
              <td class={styles.amount} style={{ padding: "1rem" }}>{formatCurrency(totals.value.annuite)}</td>
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
        <span>Page {state.currentPage} sur {totalPages.value || 1} ({sortedData.value.length} emprunts)</span>
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
});
