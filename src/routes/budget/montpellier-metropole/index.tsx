import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { BudgetEvolutionChart } from "~/components/budget/charts/budget-evolution-chart";
import { MetropoleDebtEvolutionChart } from "~/components/budget/charts/metropole-debt-evolution-chart";
import { MetropoleApcpEvolutionChart } from "~/components/budget/charts/metropole-apcp-evolution-chart";
import { LuArrowRight } from "@qwikest/icons/lucide";

export default component$(() => {
  const years = ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "1.5rem" }}>
        Analyses Transversales (Montpellier Méditerranée Métropole)
      </h1>

      <section style={{ marginBottom: "4rem", backgroundColor: "#f7fafc", padding: "1.5rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "1rem" }}>Accéder au détail par année :</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          {years.map(y => (
            <Link 
              key={y} 
              href={`/budget/montpellier-metropole/${y}/`}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "white",
                border: "1px solid #cbd5e0",
                borderRadius: "0.375rem",
                textDecoration: "none",
                color: "#2d3748",
                fontWeight: "600",
                transition: "all 0.2s"
              }}
              class="year-link"
            >
              {y}
            </Link>
          ))}
        </div>
      </section>
      
      <section style={{ marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1rem", color: "#2d3748" }}>
            Évolution des Dépenses par Fonction
        </h2>
        <p style={{ marginBottom: "2rem", fontSize: "1.1rem", color: "#4a5568" }}>
            Visualisation des dépenses réalisées par grandes politiques publiques (Services généraux, Transports, Environnement, Aménagement...).
        </p>
        <BudgetEvolutionChart />
        <div style={{ textAlign: "right" }}>
          <Link href="/budget/montpellier-metropole/2024/?tab=evolution" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#3182ce", fontWeight: "600", textDecoration: "none" }}>
            Voir le détail 2024 <LuArrowRight height={18} />
          </Link>
        </div>
      </section>

      <section style={{ marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1rem", color: "#2d3748" }}>
            Évolution de la Dette
        </h2>
        <p style={{ marginBottom: "2rem", fontSize: "1.1rem", color: "#4a5568" }}>
            Suivi de l'encours de la dette et de l'annuité de remboursement pour l'ensemble des budgets de la Métropole.
        </p>
        <MetropoleDebtEvolutionChart />
        <div style={{ textAlign: "right" }}>
          <Link href="/budget/montpellier-metropole/2024/?tab=loans" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#3182ce", fontWeight: "600", textDecoration: "none" }}>
            Voir le détail 2024 <LuArrowRight height={18} />
          </Link>
        </div>
      </section>

      <section style={{ marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1rem", color: "#2d3748" }}>
            Évolution des Investissements (AP/CP)
        </h2>
        <p style={{ marginBottom: "2rem", fontSize: "1.1rem", color: "#4a5568" }}>
            Suivi des Crédits de Paiement (CP) consommés annuellement dans le cadre des Autorisations de Programme (AP).
        </p>
        <MetropoleApcpEvolutionChart />
        <div style={{ textAlign: "right" }}>
          <Link href="/budget/montpellier-metropole/2024/?tab=apcp" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#3182ce", fontWeight: "600", textDecoration: "none" }}>
            Voir le détail 2024 <LuArrowRight height={18} />
          </Link>
        </div>
      </section>

      <style>{`
        .year-link:hover {
          background-color: #3182ce !important;
          color: white !important;
          border-color: #3182ce !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Analyses Dette et Investissements - Budget Métropole Montpellier",
  meta: [
    {
      name: "description",
      content: "Tableaux de bord d'évolution des finances, de la dette et des investissements de Montpellier Méditerranée Métropole.",
    },
  ],
};