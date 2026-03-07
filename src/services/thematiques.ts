export type Theme = {
  slug: string;      // internal ID, used for blog tag matching — keep short
  urlSlug: string;   // SEO-optimized URL path segment
  title: string;
  h1: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  positioningDimension?:
    | "economy"
    | "societal"
    | "governance"
    | "security"
    | "ecology";
  positioningDimensionSlug?: string;
  relevantCharters?: string[];
};

export const THEMES: Record<string, Theme> = {
  ecologie: {
    slug: "ecologie",
    urlSlug: "quel-candidat-ecologiste-municipales-montpellier-2026",
    title: "Écologie",
    h1: "Quel candidat défend le mieux l'écologie à Montpellier en 2026 ?",
    intro:
      "Changement climatique, biodiversité, eau, déchets : les enjeux environnementaux sont au cœur des élections municipales de 2026 à Montpellier. Nous avons analysé les programmes et le positionnement idéologique de chaque liste pour vous permettre de comparer leurs engagements concrets.",
    seoTitle:
      "Quel candidat est le plus écologiste aux municipales de Montpellier 2026 ?",
    seoDescription:
      "Comparaison des programmes et positionnements écologiques des candidats aux élections municipales de Montpellier 2026.",
    tags: ["changement climatique", "environnement", "déchets", "gestion de l'eau"],
    positioningDimension: "ecology",
    positioningDimensionSlug: "ecologie",
    relevantCharters: ["cite-bergere"],
  },
  "bien-etre-animal": {
    slug: "bien-etre-animal",
    urlSlug: "bien-etre-animal-municipales-montpellier-2026",
    title: "Bien-être animal",
    h1: "Quel candidat défend le mieux le bien-être animal à Montpellier en 2026 ?",
    intro:
      "De la fourrière municipale aux pratiques de la restauration collective, la mairie de Montpellier a de nombreux leviers d'action pour améliorer le sort des animaux. Voici comment les candidats se positionnent.",
    seoTitle:
      "Bien-être animal aux municipales de Montpellier 2026 : qui s'engage ?",
    seoDescription:
      "Comparez les propositions sur le bien-être animal des candidats aux municipales de Montpellier 2026.",
    tags: ["bien être animal"],
    positioningDimension: "societal",
    positioningDimensionSlug: "societe",
    relevantCharters: ["l214", "paz", "code-animal"],
  },
  "protection-sociale": {
    slug: "protection-sociale",
    urlSlug: "protection-sociale-solidarite-municipales-montpellier-2026",
    title: "Protection sociale",
    h1: "Quel candidat défend le mieux la solidarité et la protection sociale à Montpellier ?",
    intro:
      "Logement abordable, aide alimentaire, accès aux soins : la mairie peut agir concrètement sur la précarité. Comparaison des propositions de chaque liste.",
    seoTitle:
      "Protection sociale et solidarité aux municipales de Montpellier 2026",
    seoDescription:
      "Comparez les propositions sur le logement, la santé, l'alimentation et la solidarité des candidats aux municipales de Montpellier 2026.",
    tags: ["solidarité", "santé", "logement", "alimentation"],
    positioningDimension: "economy",
    positioningDimensionSlug: "economie",
  },
  democratie: {
    slug: "democratie",
    urlSlug: "democratie-participative-gouvernance-municipales-montpellier-2026",
    title: "Démocratie",
    h1: "Quel candidat propose la gouvernance la plus démocratique à Montpellier en 2026 ?",
    intro:
      "Budget participatif, conseils de quartier, transparence des décisions : comment les candidats conçoivent-ils la participation citoyenne dans la gestion de la ville ?",
    seoTitle:
      "Démocratie participative aux municipales de Montpellier 2026 : comparaison des candidats",
    seoDescription:
      "Comparez les propositions sur la démocratie participative et la gouvernance des candidats aux municipales de Montpellier 2026.",
    tags: ["démocratie"],
    positioningDimension: "governance",
    positioningDimensionSlug: "gouvernance",
  },
  "justice-sociale": {
    slug: "justice-sociale",
    urlSlug: "justice-sociale-emancipation-municipales-montpellier-2026",
    title: "Justice sociale",
    h1: "Quel candidat défend le mieux l'émancipation et la justice sociale à Montpellier ?",
    intro:
      "Égalité femmes-hommes, droits LGBTQ+, lutte contre les discriminations : quels candidats portent les valeurs d'émancipation et de justice sociale pour Montpellier 2026 ?",
    seoTitle:
      "Justice sociale aux municipales de Montpellier 2026 : qui s'engage ?",
    seoDescription:
      "Comparez les propositions sur la justice sociale et l'émancipation des candidats aux municipales de Montpellier 2026.",
    tags: ["émancipation et justice sociale"],
    positioningDimension: "societal",
    positioningDimensionSlug: "societe",
  },
  culture: {
    slug: "culture",
    urlSlug: "politique-culturelle-municipales-montpellier-2026",
    title: "Culture",
    h1: "Quelle vision culturelle pour Montpellier en 2026 ? Comparaison des candidats",
    intro:
      "Soutien aux artistes, festivals, patrimoine, accès à la culture pour tous : les candidats aux municipales de Montpellier 2026 ont-ils une politique culturelle ambitieuse ?",
    seoTitle:
      "Politique culturelle aux municipales de Montpellier 2026 : comparer les programmes",
    seoDescription:
      "Comparez les propositions culturelles des candidats aux municipales de Montpellier 2026.",
    tags: ["culture"],
  },
};

export const THEMES_BY_URL_SLUG: Record<string, Theme> = Object.fromEntries(
  Object.values(THEMES).map((t) => [t.urlSlug, t]),
);
