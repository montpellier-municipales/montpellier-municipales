import { component$, useComputed$ } from "@builder.io/qwik";
import type { LoanLine } from "~/types/ville";
import * as styles from "./budget-explorer.css";

interface VilleLoanExplorerProps {
  data: LoanLine[];
}

export const VilleLoanExplorer = component$<VilleLoanExplorerProps>(({ data }) => {
  const totals = useComputed$(() => {
    return data.reduce((acc, l) => ({
      capital: acc.capital + l.capitalRemainingEnd,
      interest: acc.interest + l.interestPaid,
      annuity: acc.annuity + l.capitalRepaid + l.interestPaid
    }), { capital: 0, interest: 0, annuity: 0 });
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
        <div style={{ background: "#f7fafc", padding: "1.5rem", borderRadius: "8px", textAlign: "center" }}>
          <div style={{ fontSize: "0.9rem", color: "#718096", textTransform: "uppercase", fontWeight: "bold" }}>Encours de la Dette (31/12)</div>
          <div style={{ fontSize: "2rem", fontWeight: "800", color: "#2b6cb0" }}>{formatCurrency(totals.value.capital)}</div>
        </div>
        <div style={{ background: "#f7fafc", padding: "1.5rem", borderRadius: "8px", textAlign: "center" }}>
          <div style={{ fontSize: "0.9rem", color: "#718096", textTransform: "uppercase", fontWeight: "bold" }}>Intérêts payés</div>
          <div style={{ fontSize: "2rem", fontWeight: "800", color: "#e53e3e" }}>{formatCurrency(totals.value.interest)}</div>
        </div>
        <div style={{ background: "#f7fafc", padding: "1.5rem", borderRadius: "8px", textAlign: "center" }}>
          <div style={{ fontSize: "0.9rem", color: "#718096", textTransform: "uppercase", fontWeight: "bold" }}>Annuité (Capital + Intérêts)</div>
          <div style={{ fontSize: "2rem", fontWeight: "800", color: "#2d3748" }}>{formatCurrency(totals.value.annuity)}</div>
        </div>
      </div>

      <div class={styles.tableContainer}>
        <table class={styles.table}>
          <thead>
            <tr>
              <th>Prêteur</th>
              <th>Objet</th>
              <th>Date Sign.</th>
              <th style={{ textAlign: "right" }}>Taux</th>
              <th style={{ textAlign: "right" }}>Capital Restant</th>
              <th style={{ textAlign: "right" }}>Intérêts</th>
            </tr>
          </thead>
          <tbody>
            {data.sort((a, b) => b.capitalRemainingEnd - a.capitalRemainingEnd).map((line, i) => (
              <tr key={i}>
                <td>{line.lender}</td>
                <td>{line.purpose}</td>
                <td>{line.dateSignature}</td>
                <td class={styles.amount}>{line.rate?.toFixed(2)}%</td>
                <td class={styles.amount}>{formatCurrency(line.capitalRemainingEnd)}</td>
                <td class={styles.amount}>{formatCurrency(line.interestPaid)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
