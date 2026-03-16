import { $, component$, JSXOutput, useComputed$ } from "@builder.io/qwik";
import { Tooltip } from "@qwik-ui/headless";

import {
  routeLoader$,
  useLocation,
  type DocumentHead,
  type StaticGenerateHandler,
} from "@builder.io/qwik-city";
import { getAllLists } from "~/services/lists";
import { DIMENSION_SLUGS, VALUE_SLUGS } from "~/services/positioning";
import * as styles from "./positioning.css";
import { inlineTranslate } from "qwik-speak";
import { OrdinalAxisPlot } from "~/components/OrdinalAxisPlot/OrdinalAxisPlot";

export const usePositioningData = routeLoader$(async () => {
  const allLists = await getAllLists({ qualifiedOnly: true });
  return allLists.map((l) => ({
    id: l.id,
    name: l.name,
    headOfList: l.headOfList,
    logoUrl: l.candidatePictureUrl,
    positioning: l.positioning,
  }));
});

export default component$(() => {
  const t = inlineTranslate();
  const candidates = usePositioningData();
  const loc = useLocation();

  const dimensions = [
    { id: "economy", max: 4 },
    { id: "societal", max: 5 },
    { id: "governance", max: 4 },
    { id: "security", max: 4 },
    { id: "ecology", max: 4 },
  ];

  const processedCandidates = useComputed$(() => {
    return candidates.value.filter((c) => c.positioning);
  });

  const getAxisItemForDimention = (dimId: string) => {
    return processedCandidates.value.map((c) => ({
      id: c.id,
      render$: $(
        (): JSXOutput => (
          <Tooltip.Root gutter={4} flip>
            <Tooltip.Trigger class={styles.candidateLogoTrigger}>
              <img
                src={c.logoUrl}
                alt={c.name}
                class={styles.candidateLogo}
                width={48}
                height={48}
              />
            </Tooltip.Trigger>
            <Tooltip.Panel
              class={styles.candidateTooltip}
              aria-label="Tooltip content"
            >
              {c.name} · {c.headOfList}
            </Tooltip.Panel>
          </Tooltip.Root>
        ),
      ),
      value: t(
        `comparator.positioning.labels.${dimId}.${c.positioning[dimId as keyof typeof c.positioning]}`,
      ),
    }));
  };

  return (
    <div class={styles.container}>
      <header class={styles.header}>
        <h1 class={styles.title}>{t("comparator.positioning.title")}</h1>
        <p class={styles.description}>
          {t("comparator.positioning.description")}
        </p>
      </header>

      <div class={styles.microText}>
        {t(
          "comparator.positioning.microText@@Les axes sont orientés des approches conservatrices (gauche) vers les approches progressistes (droite).",
        )}
      </div>

      <div class={styles.axesStack}>
        {dimensions.map((dim) => {
          const basePath = loc.url.pathname;
          const tickLinks = Object.fromEntries(
            Array.from({ length: dim.max }, (_, i) => {
              const label = t(
                `comparator.positioning.labels.${dim.id}.${i + 1}`,
              );
              const dimSlug = DIMENSION_SLUGS[dim.id];
              const valSlug = VALUE_SLUGS[dim.id][i + 1];
              return [label, `${basePath}${dimSlug}/${valSlug}/`];
            }),
          );

          return (
            <div key={dim.id} class={styles.dimensionGroup}>
              <h2 class={styles.dimensionTitle}>
                <span>{t(`comparator.positioning.dimensions.${dim.id}`)}</span>
              </h2>
              <OrdinalAxisPlot
                axis={Array.from({ length: dim.max }).map((_, i) =>
                  t(`comparator.positioning.labels.${dim.id}.${i + 1}`),
                )}
                items={getAxisItemForDimention(dim.id)}
                tickLinks={tickLinks}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

export const head: DocumentHead = () => {
  const t = inlineTranslate();
  return {
    title: t("comparator.positioning.title"),
    meta: [
      {
        name: "description",
        content: t("comparator.positioning.description"),
      },
    ],
  };
};

export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: [{}],
  };
};
