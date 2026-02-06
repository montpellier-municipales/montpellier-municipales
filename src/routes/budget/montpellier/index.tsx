import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import { PersonnelEvolutionChart } from "~/components/budget/charts/personnel-evolution-chart";
import { PatrimoineEvolutionChart } from "~/components/budget/charts/patrimoine-evolution-chart";
import { VilleDebtEvolutionChart } from "~/components/budget/charts/ville-debt-evolution-chart";
import { VilleTreasuryEvolutionChart } from "~/components/budget/charts/ville-treasury-evolution-chart";
import { VilleApcpEvolutionChart } from "~/components/budget/charts/ville-apcp-evolution-chart";
import { LuArrowRight } from "@qwikest/icons/lucide";
import * as styles from "./index.css";

export default component$(() => {
  const years = ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];

  return (
    <div class={styles.container}>
      <h1 class={styles.title}>
        Analyses Transversales (Ville de Montpellier)
      </h1>

      <section class={styles.navSection}>
        <h2 class={styles.navTitle}>Accéder au détail par année :</h2>
        <div class={styles.navGrid}>
          {years.map(y => (
            <Link 
              key={y} 
              href={`/budget/montpellier/${y}/`}
              class={styles.yearLink}
            >
              {y}
            </Link>
          ))}
        </div>
      </section>
      
      <section class={styles.section}>
        <h2 class={styles.sectionTitle}>
            Évolution des Effectifs
        </h2>
        <p class={styles.sectionText}>
            Visualisation de l'évolution des effectifs (postes pourvus) par secteur et par catégorie.
        </p>
        <PersonnelEvolutionChart />
        <div class={styles.linkContainer}>
          <Link href="/budget/montpellier/2024/?tab=personnel" class={styles.detailLink}>
            Voir le détail 2024 <LuArrowRight height={18} />
          </Link>
        </div>
      </section>

      <section class={styles.section}>
        <h2 class={styles.sectionTitle}>
            Évolution du Patrimoine
        </h2>
        <p class={styles.sectionText}>
            Suivi des flux d'acquisitions (investissements) et de cessions (ventes/rebuts) de biens.
            <br/>
            <strong class={styles.highlight}>Cliquez sur une barre</strong> pour voir les détails des mouvements de l'année.
        </p>
        <PatrimoineEvolutionChart />
        <div class={styles.linkContainer}>
          <Link href="/budget/montpellier/2024/?tab=patrimoine" class={styles.detailLink}>
            Voir le détail 2024 <LuArrowRight height={18} />
          </Link>
        </div>
      </section>

      <section class={styles.section}>
        <h2 class={styles.sectionTitle}>
            Investissements Pluriannuels (AP/CP)
        </h2>
        <p class={styles.sectionText}>
            Suivi des Autorisations de Programme (AP) et Crédits de Paiement (CP) pour les grands projets d'investissement.
        </p>
        <VilleApcpEvolutionChart />
      </section>

      <section class={styles.section}>
        <h2 class={styles.sectionTitle}>
            Évolution de la Dette
        </h2>
        <p class={styles.sectionText}>
            Suivi de l'encours de la dette et de l'annuité (remboursement capital + intérêts).
        </p>
        <VilleDebtEvolutionChart />
        <div class={styles.linkContainer}>
          <Link href="/budget/montpellier/2024/?tab=loans" class={styles.detailLink}>
            Voir le détail 2024 <LuArrowRight height={18} />
          </Link>
        </div>
      </section>

      <section>
        <h2 class={styles.sectionTitle}>
            Gestion de la Trésorerie
        </h2>
        <p class={styles.sectionText}>
            Suivi du recours aux lignes de trésorerie (financement court terme). Le volume de tirages indique les besoins de liquidités infra-annuels.
        </p>
        <VilleTreasuryEvolutionChart />
        <div class={styles.linkContainer} style={{ marginTop: "1rem" }}>
          <Link href="/budget/montpellier/2024/?tab=budget" class={styles.detailLink}>
            Voir le détail 2024 <LuArrowRight height={18} />
          </Link>
        </div>
      </section>
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
