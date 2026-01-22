import { component$, useComputed$, useStore } from "@builder.io/qwik";
import type { AssetLine } from "~/types/ville";
import * as styles from "./budget-explorer.css";

interface PatrimoineExplorerProps {
  data: AssetLine[];
}

export const PatrimoineExplorer = component$<PatrimoineExplorerProps>(({ data }) => {
  const state = useStore({
    filterType: "all", // "all", "E", "S"
    limit: 50
  });

  const totals = useComputed$(() => {
    return data.reduce((acc, line) => {
      if (line.entreeSortie === "E") {
        acc.entree += line.valeurAcquisition;
      } else {
        acc.sortie += line.valeurAcquisition;
      }
      return acc;
    }, { entree: 0, sortie: 0 });
  });

  const filteredData = useComputed$(() => {
    return data
      .filter(l => state.filterType === "all" || l.entreeSortie === state.filterType)
      .sort((a, b) => b.valeurAcquisition - a.valeurAcquisition)
      .slice(0, state.limit);
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div class={styles.container}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ background: "#f0fff4", padding: "1.5rem", borderRadius: "8px", textAlign: "center", border: "1px solid #c6f6d5" }}>
          <div style={{ fontSize: "0.9rem", color: "#2f855a", textTransform: "uppercase", fontWeight: "bold" }}>Acquisitions (Entrées)</div>
          <div style={{ fontSize: "2rem", fontWeight: "800", color: "#276749" }}>{formatCurrency(totals.value.entree)}</div>
        </div>
        <div style={{ background: "#fff5f5", padding: "1.5rem", borderRadius: "8px", textAlign: "center", border: "1px solid #fed7d7" }}>
          <div style={{ fontSize: "0.9rem", color: "#c53030", textTransform: "uppercase", fontWeight: "bold" }}>Cessions / Sorties</div>
          <div style={{ fontSize: "2rem", fontWeight: "800", color: "#9b2c2c" }}>{formatCurrency(totals.value.sortie)}</div>
        </div>
      </div>

      <div class={styles.filterSection}>
        <div class={styles.filterGroup}>
          <label class={styles.label}>Type de mouvement</label>
          <select 
            class={styles.select}
            value={state.filterType}
            onChange$={(e) => state.filterType = (e.target as HTMLSelectElement).value}
          >
            <option value="all">Tout</option>
            <option value="E">Entrées (Acquisitions)</option>
            <option value="S">Sorties (Cessions)</option>
          </select>
        </div>
      </div>

      <div class={styles.tableContainer}>
        <table class={styles.table}>
          <thead>
            <tr>
              <th>Libellé</th>
              <th>Type</th>
              <th>Modalité</th>
              <th style={{ textAlign: "right" }}>Valeur</th>
              <th style={{ textAlign: "right" }}>VNC</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.value.map((line, i) => (
              <tr key={i}>
                <td>{line.libelle}</td>
                <td>
                  <span class={line.entreeSortie === "E" ? styles.badgeRecette : styles.badgeDepense}>
                    {line.entreeSortie === "E" ? "Entrée" : "Sortie"}
                  </span>
                </td>
                <td>{line.modalite}</td>
                <td class={styles.amount}>{formatCurrency(line.valeurAcquisition)}</td>
                <td class={styles.amount}>{formatCurrency(line.vnc)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
