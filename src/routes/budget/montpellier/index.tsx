import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { PersonnelEvolutionChart } from "~/components/budget/charts/personnel-evolution-chart";
import { PatrimoineEvolutionChart } from "~/components/budget/charts/patrimoine-evolution-chart";
import { VilleDebtEvolutionChart } from "~/components/budget/charts/ville-debt-evolution-chart";
import { VilleTreasuryEvolutionChart } from "~/components/budget/charts/ville-treasury-evolution-chart";
import { LuArrowRight } from "@qwikest/icons/lucide";

export default component$(() => {
  const years = ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "1.5rem" }}>
        Analyses Transversales (Ville de Montpellier)
      </h1>

      <section style={{ marginBottom: "4rem", backgroundColor: "#f7fafc", padding: "1.5rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "1rem" }}>Accéder au détail par année :</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          {years.map(y => (
            <Link 
              key={y} 
              href={`/budget/montpellier/${y}/`}
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
            Évolution des Effectifs
        </h2>
        <p style={{ marginBottom: "2rem", fontSize: "1.1rem", color: "#4a5568" }}>
            Visualisation de l'évolution des effectifs (postes pourvus) par secteur et par catégorie.
        </p>
        <PersonnelEvolutionChart />
        <div style={{ textAlign: "right" }}>
          <Link href="/budget/montpellier/2024/?tab=personnel" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#3182ce", fontWeight: "600", textDecoration: "none" }}>
            Voir le détail 2024 <LuArrowRight height={18} />
          </Link>
        </div>
      </section>

      <section style={{ marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1rem", color: "#2d3748" }}>
            Évolution du Patrimoine
        </h2>
        <p style={{ marginBottom: "2rem", fontSize: "1.1rem", color: "#4a5568" }}>
            Suivi des flux d'acquisitions (investissements) et de cessions (ventes/rebuts) de biens.
            <br/>
            <strong style={{ color: "#3182ce" }}>Cliquez sur une barre</strong> pour voir les détails des mouvements de l'année.
        </p>
        <PatrimoineEvolutionChart />
        <div style={{ textAlign: "right" }}>
          <Link href="/budget/montpellier/2024/?tab=patrimoine" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#3182ce", fontWeight: "600", textDecoration: "none" }}>
            Voir le détail 2024 <LuArrowRight height={18} />
          </Link>
        </div>
      </section>

      <section style={{ marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1rem", color: "#2d3748" }}>
            Évolution de la Dette
        </h2>
        <p style={{ marginBottom: "2rem", fontSize: "1.1rem", color: "#4a5568" }}>
            Suivi de l'encours de la dette et de l'annuité (remboursement capital + intérêts).
        </p>
        <VilleDebtEvolutionChart />
        <div style={{ textAlign: "right" }}>
          <Link href="/budget/montpellier/2024/?tab=loans" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#3182ce", fontWeight: "600", textDecoration: "none" }}>
            Voir le détail 2024 <LuArrowRight height={18} />
          </Link>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1rem", color: "#2d3748" }}>
            Gestion de la Trésorerie
        </h2>
        <p style={{ marginBottom: "2rem", fontSize: "1.1rem", color: "#4a5568" }}>
            Suivi du recours aux lignes de trésorerie (financement court terme). Le volume de tirages indique les besoins de liquidités infra-annuels.
        </p>
        <VilleTreasuryEvolutionChart />
        <div style={{ textAlign: "right", marginTop: "1rem" }}>
          <Link href="/budget/montpellier/2024/?tab=budget" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "#3182ce", fontWeight: "600", textDecoration: "none" }}>
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
  title: "Analyses RH, Patrimoine et Dette - Budget Ville Montpellier",
  meta: [
    {
      name: "description",
      content: "Tableaux de bord d'évolution des effectifs, du patrimoine et de la dette de la Ville de Montpellier.",
    },
  ],
};
