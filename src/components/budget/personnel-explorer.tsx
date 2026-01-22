import { component$, useComputed$ } from "@builder.io/qwik";
import type { PersonnelLine } from "~/types/ville";
import * as styles from "./budget-explorer.css";

interface PersonnelExplorerProps {
  data: PersonnelLine[];
}

export const PersonnelExplorer = component$<PersonnelExplorerProps>(({ data }) => {
  const totals = useComputed$(() => {
    return data.reduce((acc, line) => {
      acc.budgeted += line.effectifBud;
      acc.filled += line.effectifPourvu;
      return acc;
    }, { budgeted: 0, filled: 0 });
  });

  const byCategory = useComputed$(() => {
    const map = new Map<string, { budget: number, filled: number }>();
    data.forEach(line => {
      const cat = line.categorie || "Non défini";
      const current = map.get(cat) || { budget: 0, filled: 0 };
      map.set(cat, {
        budget: current.budget + line.effectifBud,
        filled: current.filled + line.effectifPourvu
      });
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  });

  return (
    <div class={styles.container}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ background: "#f7fafc", padding: "1.5rem", borderRadius: "8px", textAlign: "center" }}>
          <div style={{ fontSize: "0.9rem", color: "#718096", textTransform: "uppercase", fontWeight: "bold" }}>Effectifs Budgétaires</div>
          <div style={{ fontSize: "2.5rem", fontWeight: "800", color: "#2b6cb0" }}>{totals.value.budgeted.toFixed(1)}</div>
        </div>
        <div style={{ background: "#f7fafc", padding: "1.5rem", borderRadius: "8px", textAlign: "center" }}>
          <div style={{ fontSize: "0.9rem", color: "#718096", textTransform: "uppercase", fontWeight: "bold" }}>Effectifs Pourvus</div>
          <div style={{ fontSize: "2.5rem", fontWeight: "800", color: "#2b6cb0" }}>{totals.value.filled.toFixed(1)}</div>
        </div>
      </div>

      <h3>Répartition par Catégorie</h3>
      <div class={styles.tableContainer}>
        <table class={styles.table}>
          <thead>
            <tr>
              <th>Catégorie</th>
              <th style={{ textAlign: "right" }}>Budgétaire</th>
              <th style={{ textAlign: "right" }}>Pourvu</th>
              <th style={{ textAlign: "right" }}>Taux d'occupation</th>
            </tr>
          </thead>
          <tbody>
            {byCategory.value.map(([cat, counts]) => (
              <tr key={cat}>
                <td>Catégorie {cat}</td>
                <td class={styles.amount}>{counts.budget.toFixed(1)}</td>
                <td class={styles.amount}>{counts.filled.toFixed(1)}</td>
                <td class={styles.amount}>
                  {counts.budget > 0 ? ((counts.filled / counts.budget) * 100).toFixed(1) : "0"}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
