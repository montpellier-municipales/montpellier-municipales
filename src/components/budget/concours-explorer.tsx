import { component$, useSignal, useComputed$, $, useTask$ } from "@builder.io/qwik";
import type { ConcoursLine } from "~/types/budget";
import * as styles from "./budget-explorer.css";
import { Pagination } from "@qwik-ui/headless";
import { ConcoursNatureChart } from "./charts/concours-nature-chart";

interface ConcoursExplorerProps {
  data: ConcoursLine[];
}

const NATURE_LABELS: Record<string, string> = {
  "P1": "Privé (Associations...)",
  "P2": "Public (Coll., Étab...)",
  "P3": "Ménages",
  "P4": "Autres (Privé)",
  "U1": "Communes",
  "U2": "EPCI (Métropoles...)",
  "U3": "Départements",
  "U4": "Régions",
  "U5": "Établissements publics",
  "U6": "Autres (Public)",
};

export const ConcoursExplorer = component$<ConcoursExplorerProps>(({ data }) => {
  const searchTerm = useSignal("");
  const filterNature = useSignal("all");
  const sortColumn = useSignal<keyof ConcoursLine>("montant");
  const sortDirection = useSignal<"asc" | "desc">("desc");
  const currentPage = useSignal(1);
  const pageSize = 50;

  // Reset to first page when search or filters change
  useTask$(({ track }) => {
    track(() => searchTerm.value);
    track(() => filterNature.value);
    currentPage.value = 1;
  });

  const filteredData = useComputed$(() => {
    const query = searchTerm.value.toLowerCase().trim();
    const queryWords = query.split(/\s+/).filter(w => w.length > 0);

    const result = data.filter(item => {
      const matchesNature = filterNature.value === "all" || item.nature_beneficiaire === filterNature.value;
      if (!matchesNature) return false;

      if (queryWords.length === 0) return true;

      const targetText = `${item.nom_beneficiaire || ""} ${item.objet || ""}`.toLowerCase();
      return queryWords.every(word => targetText.includes(word));
    });

    result.sort((a, b) => {
      const aVal = a[sortColumn.value] ?? "";
      const bVal = b[sortColumn.value] ?? "";
      
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection.value === "asc" ? aVal - bVal : bVal - aVal;
      }
      
      return sortDirection.value === "asc" 
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    return result;
  });

  const totalPages = useComputed$(() => Math.max(1, Math.ceil(filteredData.value.length / pageSize)));

  const paginatedData = useComputed$(() => {
    const start = (currentPage.value - 1) * pageSize;
    return filteredData.value.slice(start, start + pageSize);
  });

  const uniqueNatures = useComputed$(() => {
    const natures = new Set(data.map(d => d.nature_beneficiaire).filter(Boolean));
    return Array.from(natures).sort();
  });

  const handleSort$ = $((col: keyof ConcoursLine) => {
    if (sortColumn.value === col) {
      sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
    } else {
      sortColumn.value = col;
      sortDirection.value = "desc";
    }
    currentPage.value = 1;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalFiltered = useComputed$(() => {
      return filteredData.value.reduce((sum, item) => sum + item.montant, 0);
  });

  return (
    <div class={styles.container}>
      <ConcoursNatureChart 
        data={data} 
        onSelectNature$={(nature) => {
          filterNature.value = nature;
          currentPage.value = 1;
        }}
      />
      
      <div class={styles.filterSection}>
        <div class={styles.filterGroup}>
          <label class={styles.label}>Rechercher</label>
          <input
            type="text"
            class={styles.input}
            placeholder="Nom ou objet..."
            bind:value={searchTerm}
          />
        </div>
        <div class={styles.filterGroup}>
          <label class={styles.label}>Nature Bénéficiaire</label>
          <select 
            class={styles.select} 
            bind:value={filterNature}
          >
            <option value="all">Toutes</option>
            {uniqueNatures.value.map(n => (
              <option key={n} value={n}>{NATURE_LABELS[n] || n}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: "1rem", fontWeight: "bold", color: "#2d3748" }}>
        Résultats : {filteredData.value.length} lignes
      </div>

      <div class={styles.tableContainer}>
        <table class={styles.table}>
          <thead>
            <tr>
              <th onClick$={() => handleSort$("nom_beneficiaire")} style={{ cursor: "pointer" }}>
                Bénéficiaire {sortColumn.value === "nom_beneficiaire" && (sortDirection.value === "asc" ? "↑" : "↓")}
              </th>
              <th onClick$={() => handleSort$("nature_beneficiaire")} style={{ cursor: "pointer" }}>
                Nature {sortColumn.value === "nature_beneficiaire" && (sortDirection.value === "asc" ? "↑" : "↓")}
              </th>
              <th onClick$={() => handleSort$("objet")} style={{ cursor: "pointer" }}>
                Objet {sortColumn.value === "objet" && (sortDirection.value === "asc" ? "↑" : "↓")}
              </th>
              <th onClick$={() => handleSort$("montant")} style={{ cursor: "pointer", textAlign: "right" }}>
                Montant {sortColumn.value === "montant" && (sortDirection.value === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.value.map((item, i) => (
              <tr key={i}>
                <td>{item.nom_beneficiaire}</td>
                <td>{NATURE_LABELS[item.nature_beneficiaire] || item.nature_beneficiaire}</td>
                <td style={{ fontSize: "0.85rem", color: "#4a5568" }}>{item.objet}</td>
                <td class={styles.amount}>{formatCurrency(item.montant)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ fontWeight: "bold", backgroundColor: "#f7fafc", borderTop: "2px solid #e2e8f0" }}>
              <td colSpan={3} style={{ textAlign: "right", padding: "1rem" }}>Total Filtré</td>
              <td class={styles.amount} style={{ padding: "1rem" }}>{formatCurrency(totalFiltered.value)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {totalPages.value > 1 && (
        <div class={styles.pagination}>
          <Pagination
            selectedPage={currentPage.value}
            totalPages={totalPages.value}
            onPageChange$={(page: number) => {
              currentPage.value = page;
            }}
            class={styles.pagination}
            selectedClass={styles.selectedPageButton}
            defaultClass={styles.pageButton}
            dividerClass={styles.paginationDivider}
            prevButtonClass={styles.pageButton}
            nextButtonClass={styles.pageButton}
            customArrowTexts={{
                previous: "Précédent",
                next: "Suivant"
            }}
          />
        </div>
      )}
    </div>
  );
});