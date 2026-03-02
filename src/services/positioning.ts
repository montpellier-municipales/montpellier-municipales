export const DIMENSION_SLUGS: Record<string, string> = {
  economy: "economie",
  societal: "societe",
  governance: "gouvernance",
  security: "securite",
  ecology: "ecologie",
};

export const VALUE_SLUGS: Record<string, Record<number, string>> = {
  economy: {
    1: "neoliberalisme",
    2: "social-liberalisme",
    3: "social-ecologie",
    4: "socialisme-municipalisme",
  },
  societal: {
    1: "reactionnaire",
    2: "conservateur-autoritaire",
    3: "progressiste-liberal",
    4: "progressiste-radical",
    5: "antispeciste",
  },
  governance: {
    1: "autoritaire-vertical",
    2: "representatif",
    3: "participatif",
    4: "communs-auto-organisation",
  },
  security: {
    1: "punitif-surveillance",
    2: "conventionnel",
    3: "proximite-mediation",
    4: "preventif-communautaire",
  },
  ecology: {
    1: "croissance-verte",
    2: "transition",
    3: "transition-radicale",
    4: "rupture-decroissance",
  },
};

// Inverse lookups

export const SLUG_TO_DIMENSION: Record<string, string> = Object.fromEntries(
  Object.entries(DIMENSION_SLUGS).map(([key, slug]) => [slug, key]),
);

export const SLUG_TO_VALUE: Record<string, Record<string, number>> =
  Object.fromEntries(
    Object.entries(VALUE_SLUGS).map(([dimension, values]) => [
      DIMENSION_SLUGS[dimension],
      Object.fromEntries(
        Object.entries(values).map(([num, slug]) => [slug, Number(num)]),
      ),
    ]),
  );
