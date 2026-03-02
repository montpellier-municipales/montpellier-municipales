import { component$ } from "@builder.io/qwik";
import {
  routeLoader$,
  type DocumentHead,
  type StaticGenerateHandler,
} from "@builder.io/qwik-city";
import { inlineTranslate, useSpeak } from "qwik-speak";
import {
  DIMENSION_SLUGS,
  VALUE_SLUGS,
  SLUG_TO_DIMENSION,
  SLUG_TO_VALUE,
} from "~/services/positioning";
import { getAllMeasuresForPositioningValue } from "~/services/program";
import { Language } from "~/types/schema";
import { config } from "~/speak-config";
import * as styles from "./value-page.css";

export const useValuePageData = routeLoader$(async (requestEvent) => {
  const { dimensionSlug, valueSlug } = requestEvent.params;
  const lang = (requestEvent.params.lang as Language) || Language.fr;

  const dimension = SLUG_TO_DIMENSION[dimensionSlug];
  const numValue = SLUG_TO_VALUE[dimensionSlug]?.[valueSlug];

  if (!dimension || numValue === undefined) {
    throw requestEvent.fail(404, { message: "Page non trouvée" });
  }

  const measures = await getAllMeasuresForPositioningValue(
    dimension,
    numValue,
    lang,
  );

  const maxValue = Object.keys(VALUE_SLUGS[dimension]).length;

  return {
    dimension,
    dimensionSlug,
    valueSlug,
    value: numValue,
    maxValue,
    measures,
    lang,
  };
});

export default component$(() => {
  useSpeak({ assets: ["comparator"] });
  const t = inlineTranslate();
  const data = useValuePageData();

  const { dimension, dimensionSlug, value, maxValue, measures, lang } =
    data.value;

  const langPrefix = lang === "fr" ? "" : `/${lang}`;
  const compassUrl = `${langPrefix}/comparateur/positionnement/`;

  const dimensionLabelText = t(
    `comparator.positioning.dimensions.${dimension}`,
  );
  const valueLabelText = t(
    `comparator.positioning.labels.${dimension}.${value}`,
  );

  const isExcluded = dimension === "societal" && value === 1;
  const isSecurity = dimension === "security";

  return (
    <div class={styles.container}>
      <nav class={styles.breadcrumb}>
        <a href={compassUrl} class={styles.breadcrumbLink}>
          {t(
            "comparator.positioning.valuePages.backToCompass@@← Retour à la Boussole Idéologique",
          )}
        </a>
        <span>›</span>
        <span>{dimensionLabelText}</span>
        <span>›</span>
        <span>{valueLabelText}</span>
      </nav>

      <header class={styles.header}>
        <div class={styles.dimensionLabel}>{dimensionLabelText}</div>
        <h1 class={styles.title}>{valueLabelText}</h1>
      </header>

      <p class={styles.description}>
        {t(
          `comparator.positioning.valuePages.descriptions.${dimension}.${value}`,
        )}
      </p>

      {isExcluded && (
        <div class={styles.excludedBox}>
          {t(
            "comparator.positioning.valuePages.excludedNote@@Les candidatures réactionnaires se situent en dehors du spectre républicain. Ce comparateur n'inclut aucun candidat à ce positionnement.",
          )}
        </div>
      )}

      {isSecurity && (
        <a
          href={t(
            "comparator.positioning.valuePages.safetyArticleHref@@/info/surete-publique-montpellier-efficacite-vs-affichage",
          )}
          class={styles.safetyLink}
        >
          {t(
            "comparator.positioning.valuePages.safetyArticleLabel@@Lire notre analyse sur l'efficacité des politiques de sécurité",
          )}
        </a>
      )}

      <nav class={styles.dimensionNav}>
        <div class={styles.dimensionNavLabel}>
          {t(
            "comparator.positioning.valuePages.otherValues@@Autres positions sur cet axe",
          )}
        </div>
        <div class={styles.dimensionNavPills}>
          {Array.from({ length: maxValue }, (_, i) => {
            const pillValue = i + 1;
            const pillSlug = VALUE_SLUGS[dimension][pillValue];
            const pillLabel = t(
              `comparator.positioning.labels.${dimension}.${pillValue}`,
            );
            const pillUrl = `${compassUrl}${dimensionSlug}/${pillSlug}/`;
            const isActive = pillValue === value;

            return (
              <a
                key={pillSlug}
                href={pillUrl}
                class={
                  isActive
                    ? `${styles.dimensionNavPill} ${styles.activePill}`
                    : styles.dimensionNavPill
                }
                aria-current={isActive ? "page" : undefined}
              >
                {pillLabel}
              </a>
            );
          })}
        </div>
      </nav>

      {!isExcluded && (
        <section class={styles.measuresSection}>
          <h2 class={styles.measuresHeading}>
            {t(
              "comparator.positioning.valuePages.measuresHeading@@Mesures correspondant à ce positionnement",
            )}
          </h2>

          {measures.length === 0 ? (
            <p class={styles.noMeasures}>
              {t(
                "comparator.positioning.valuePages.noMeasures@@Aucune mesure ne correspond à ce positionnement dans notre comparateur.",
              )}
            </p>
          ) : (
            <div class={styles.measuresGrid}>
              {measures.map((measure) => {
                const candidateUrl = `${langPrefix}/listes/${measure.candidateId}/`;
                const measureUrl = `${langPrefix}/listes/${measure.candidateId}/programme/${measure.slug}`;

                return (
                  <article
                    key={`${measure.candidateId}-${measure.id}`}
                    class={styles.measureCard}
                  >
                    <div class={styles.candidateInfo}>
                      <a href={candidateUrl} class={styles.candidateLink}>
                        <img
                          src={measure.candidateLogo}
                          alt={measure.candidateName}
                          width={28}
                          height={28}
                          class={styles.candidateLogo}
                        />
                        {measure.candidateName}
                      </a>
                    </div>

                    <a href={measureUrl} class={styles.measureTitle}>
                      {measure.title}
                    </a>

                    {measure.tags.length > 0 && (
                      <div class={styles.tagList}>
                        {measure.tags.map((tag) => (
                          <span key={tag} class={styles.tagBadge}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const data = resolveValue(useValuePageData);
  const t = inlineTranslate();
  const dimensionLabel = t(
    `comparator.positioning.dimensions.${data.dimension}`,
  );
  const valueLabel = t(
    `comparator.positioning.labels.${data.dimension}.${data.value}`,
  );
  return {
    title: `${valueLabel} · ${dimensionLabel} · ${t("comparator.positioning.title")}`,
    meta: [
      {
        name: "description",
        content: t(
          `comparator.positioning.valuePages.descriptions.${data.dimension}.${data.value}`,
        ),
      },
    ],
  };
};

export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: Object.entries(VALUE_SLUGS).flatMap(([dimension, values]) =>
      Object.entries(values).map(([, valueSlug]) => ({
        dimensionSlug: DIMENSION_SLUGS[dimension],
        valueSlug,
      })),
    ),
  };
};
