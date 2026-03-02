import {
  component$,
  useSignal,
  useTask$,
  $,
  useComputed$,
  type JSXOutput,
} from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik";
import {
  routeLoader$,
  useLocation,
  useNavigate,
  Link,
  type DocumentHead,
  type StaticGenerateHandler,
} from "@builder.io/qwik-city";
import { getAllLists, getListsByIds } from "~/services/lists";
import { getCandidateProgram } from "~/services/program";
import { Tooltip } from "@qwik-ui/headless";
import { OrdinalAxisPlot } from "~/components/OrdinalAxisPlot/OrdinalAxisPlot";
import * as styles from "./comparator.css";
import { inlineTranslate, useSpeak } from "qwik-speak";
import { LuCircle, LuCheckCircle } from "@qwikest/icons/lucide";

export const useComparatorData = routeLoader$(async ({ url, locale }) => {
  const lang = locale();
  const allAvailableLists = await getAllLists();

  const selectedIdsParam = url.searchParams.get("listes");
  let selectedLists: Array<{
    id: string;
    name: string;
    headOfList: string;
    logoUrl: string;
    candidatePictureUrl: string;
    positioning: {
      economy: number;
      societal: number;
      governance: number;
      security: number;
      ecology: number;
    };
    measures: Awaited<ReturnType<typeof getCandidateProgram>>;
  }> = [];

  if (selectedIdsParam) {
    const ids = selectedIdsParam.split(",").filter(Boolean);
    const lists = await getListsByIds(ids);
    selectedLists = await Promise.all(
      lists.map(async (list) => ({
        id: list.id,
        name: list.name,
        headOfList: list.headOfList,
        logoUrl: list.logoUrl,
        candidatePictureUrl: list.candidatePictureUrl,
        positioning: list.positioning,
        measures: await getCandidateProgram(list.id, lang),
      })),
    );
  }

  return {
    allAvailableLists: allAvailableLists.map((l) => ({
      id: l.id,
      name: l.name,
      headOfList: l.headOfList,
      logoUrl: l.logoUrl,
    })),
    selectedLists,
  };
});

const dimensions = [
  { id: "economy", max: 4 },
  { id: "societal", max: 5 },
  { id: "governance", max: 4 },
  { id: "security", max: 4 },
  { id: "ecology", max: 4 },
] as const;

export default component$(() => {
  useSpeak({ assets: ["comparator"] });
  const t = inlineTranslate();
  const data = useComparatorData();
  const loc = useLocation();
  const navigate = useNavigate();

  const selectedListIds = useSignal<string[]>(
    data.value.selectedLists.map((l) => l.id),
  );

  const activeTag = useSignal<string | null>(null);

  // Sync URL when selection changes
  useTask$(({ track }) => {
    track(() => selectedListIds.value);
    if (isServer) return;
    const newSearchParams = new URLSearchParams();
    if (selectedListIds.value.length > 0) {
      newSearchParams.set("listes", selectedListIds.value.join(","));
    }
    navigate(`${loc.url.pathname}?${newSearchParams.toString()}`);
  });

  const toggleList = $((id: string) => {
    if (selectedListIds.value.includes(id)) {
      selectedListIds.value = selectedListIds.value.filter((i) => i !== id);
    } else {
      selectedListIds.value = [...selectedListIds.value, id];
    }
  });

  const allTags = useComputed$(() => {
    const tags = data.value.selectedLists.flatMap((l) =>
      l.measures.flatMap((m) => m.tags || []),
    );
    return [...new Set(tags)].sort();
  });

  return (
    <div class={styles.container}>
      <h1 class={styles.pageTitle}>{t("app.menu.compareProgrammes")}</h1>

      {/* List selection chips */}
      <section class={styles.sectionCard}>
        <h2 class={styles.sectionTitle}>{t("comparator.selectLists")}</h2>
        <div class={styles.chips}>
          {data.value.allAvailableLists.map((list) => {
            const isSelected = selectedListIds.value.includes(list.id);
            return (
              <button
                key={list.id}
                class={isSelected ? styles.chipActive : styles.chip}
                onClick$={() => toggleList(list.id)}
              >
                {isSelected ? <LuCheckCircle /> : <LuCircle />}
                {list.name}
              </button>
            );
          })}
        </div>
      </section>

      {data.value.selectedLists.length === 0 && (
        <p class={styles.emptyState}>{t("comparator.noListSelected")}</p>
      )}

      {data.value.selectedLists.length > 0 && (
        <>
          {/* Section 1: Positioning */}
          <section class={styles.sectionCard}>
            <h2 class={styles.sectionTitle}>
              {t("comparator.positioningSection")}
            </h2>
            <p class={styles.sectionDesc}>
              {t("comparator.positioningSectionDesc")}
            </p>
            <div class={styles.axesStack}>
              {dimensions.map((dim) => {
                const items = data.value.selectedLists.map((c) => ({
                  id: c.id,
                  value: t(
                    `comparator.positioning.labels.${dim.id}.${c.positioning[dim.id as keyof typeof c.positioning]}`,
                  ),
                  render$: $(
                    (): JSXOutput => (
                      <Tooltip.Root gutter={4} flip>
                        <Tooltip.Trigger class={styles.candidateLogoTrigger}>
                          <img
                            src={c.candidatePictureUrl}
                            alt={c.name}
                            class={styles.plotCandidateLogo}
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
                }));

                return (
                  <div key={dim.id} class={styles.dimensionGroup}>
                    <h2 class={styles.dimensionTitle}>
                      <span>
                        {t(`comparator.positioning.dimensions.${dim.id}`)}
                      </span>
                    </h2>
                    <div class={styles.axisWrapper}>
                      <OrdinalAxisPlot
                        axis={Array.from({ length: dim.max }).map((_, i) =>
                          t(`comparator.positioning.labels.${dim.id}.${i + 1}`),
                        )}
                        items={items}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 2: Program comparison */}
          <section class={styles.sectionCard}>
            <h2 class={styles.sectionTitle}>
              {t("comparator.programSection")}
            </h2>

            {/* Sticky tag filter */}
            <div class={styles.tagFilterRow}>
              <button
                class={
                  activeTag.value === null
                    ? styles.tagPillActive
                    : styles.tagPill
                }
                onClick$={() => {
                  activeTag.value = null;
                }}
              >
                {t("comparator.allTags")}
              </button>
              {allTags.value.map((tag) => (
                <button
                  key={tag}
                  class={
                    activeTag.value === tag
                      ? styles.tagPillActive
                      : styles.tagPill
                  }
                  onClick$={() => {
                    activeTag.value = tag;
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* N-column comparison grid */}
            <div
              class={styles.comparisonGrid}
              style={{
                gridTemplateColumns: `repeat(${data.value.selectedLists.length}, 1fr)`,
              }}
            >
              {data.value.selectedLists.map((list) => {
                const filtered = list.measures.filter(
                  (m) =>
                    activeTag.value === null ||
                    (m.tags || []).includes(activeTag.value!),
                );
                return (
                  <div key={list.id} class={styles.candidateColumn}>
                    <div class={styles.candidateHeader}>
                      <img
                        src={list.logoUrl}
                        alt={`Logo ${list.name}`}
                        class={styles.candidateLogo}
                        width={40}
                        height={40}
                      />
                      <span>{list.name}</span>
                    </div>
                    {filtered.map((measure) => (
                      <article key={measure.id} class={styles.measureCard}>
                        <div class={styles.measureTags}>
                          {(measure.tags || []).map((tag) => (
                            <span key={tag} class={styles.tagBadge}>
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 class={styles.measureTitle}>{measure.title}</h3>
                        <Link
                          href={`/listes/${list.id}/programme/${measure.slug}/`}
                          class={styles.measureLink}
                        >
                          Lire →
                        </Link>
                      </article>
                    ))}
                    {filtered.length === 0 && (
                      <p class={styles.noMeasurePlaceholder}>
                        {t("comparator.noMeasuresForTag")}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
});

export const head: DocumentHead = () => {
  const t = inlineTranslate();
  return {
    title: t("app.menu.compareProgrammes"),
    meta: [
      {
        name: "description",
        content: t("comparator.metaDescription"),
      },
    ],
  };
};

// SSG: generate the empty default page
export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: [{}],
  };
};
