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
  Link,
  type DocumentHead,
  type StaticGenerateHandler,
} from "@builder.io/qwik-city";
import { getAllLists } from "~/services/lists";
import { getCandidateProgram } from "~/services/program";
import { getAllCharters } from "~/services/charters";
import { Tooltip } from "@qwik-ui/headless";
import { OrdinalAxisPlot } from "~/components/OrdinalAxisPlot/OrdinalAxisPlot";
import * as styles from "./comparator.css";
import { inlineTranslate, useSpeak } from "qwik-speak";
import { LuCircle, LuCheckCircle, LuXCircle } from "@qwikest/icons/lucide";

// Pre-load ALL lists + their programs at SSG time.
// No URL-param dependency — selection is fully client-side.
export const useComparatorData = routeLoader$(async ({ locale }) => {
  const lang = locale();
  const [allLists, charters] = await Promise.all([
    getAllLists(),
    Promise.resolve(getAllCharters()),
  ]);

  const allListsWithPrograms = await Promise.all(
    allLists.map(async (list) => {
      const measures = await getCandidateProgram(list.id, lang);
      return {
        id: list.id,
        name: list.name,
        headOfList: list.headOfList,
        logoUrl: list.logoUrl,
        candidatePictureUrl: list.candidatePictureUrl,
        positioning: list.positioning,
        // Only summary fields — content HTML is not needed in the comparator
        measures: measures.map((m) => ({
          id: m.id,
          slug: m.slug,
          title: m.title,
          tags: m.tags,
        })),
      };
    }),
  );

  return { allListsWithPrograms, charters };
});

const dimensions = [
  { id: "economy", max: 4 },
  { id: "societal", max: 5 },
  { id: "governance", max: 4 },
  { id: "security", max: 4 },
  { id: "ecology", max: 4 },
] as const;

export default component$(() => {
  useSpeak({ assets: ["comparator", "charters"] });
  const t = inlineTranslate();
  const data = useComparatorData();
  const { charters } = data.value;
  const loc = useLocation();

  // Start empty — initialized from URL on the client after hydration
  const selectedListIds = useSignal<string[]>([]);
  const activeTag = useSignal<string | null>(null);

  // Read ?listes= from URL on client mount (runs once, static-site compatible)
  useTask$(() => {
    if (isServer) return;
    const param = loc.url.searchParams.get("listes");
    selectedListIds.value = param ? param.split(",").filter(Boolean) : [];
  });

  // Keep URL in sync via replaceState — no navigation, no loader re-run needed
  useTask$(({ track }) => {
    track(() => selectedListIds.value);
    if (isServer) return;
    const qs = selectedListIds.value.length
      ? `?listes=${selectedListIds.value.join(",")}`
      : "";
    window.history.replaceState(null, "", `${loc.url.pathname}${qs}`);
  });

  const toggleList = $((id: string) => {
    if (selectedListIds.value.includes(id)) {
      selectedListIds.value = selectedListIds.value.filter((i) => i !== id);
    } else {
      selectedListIds.value = [...selectedListIds.value, id];
    }
  });

  // Derived entirely from client-side signal + pre-loaded data — no server round-trip
  const selectedLists = useComputed$(() =>
    data.value.allListsWithPrograms.filter((l) =>
      selectedListIds.value.includes(l.id),
    ),
  );

  const allTags = useComputed$(() => {
    const tags = selectedLists.value.flatMap((l) =>
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
          {data.value.allListsWithPrograms.map((list) => {
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

      {selectedLists.value.length === 0 && (
        <p class={styles.emptyState}>{t("comparator.noListSelected")}</p>
      )}

      {selectedLists.value.length > 0 && (
        <>
          {/* Section 1: Positioning axes */}
          <section class={styles.sectionCard}>
            <h2 class={styles.sectionTitle}>
              {t("comparator.positioningSection")}
            </h2>
            <p class={styles.sectionDesc}>
              {t("comparator.positioningSectionDesc")}
            </p>
            <div class={styles.axesStack}>
              {dimensions.map((dim) => {
                const items = selectedLists.value.map((c) => ({
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
                    <h3 class={styles.dimensionTitle}>
                      {t(`comparator.positioning.dimensions.${dim.id}`)}
                    </h3>
                    <div class={styles.axisWrapper}>
                      <OrdinalAxisPlot
                        axis={Array.from({ length: dim.max }).map((_, i) =>
                          t(
                            `comparator.positioning.labels.${dim.id}.${i + 1}`,
                          ),
                        )}
                        items={items}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 2: Charter signatures */}
          <section class={styles.sectionCard}>
            <h2 class={styles.sectionTitle}>{t("charters.title")}</h2>
            <p class={styles.sectionDesc}>{t("charters.description")}</p>
            <div class={styles.charterTableWrapper}>
              <table class={styles.charterTable}>
                <thead>
                  <tr>
                    <th class={styles.charterThLabel}></th>
                    {selectedLists.value.map((list) => (
                      <th key={list.id} class={styles.charterThCandidate}>
                        <img
                          src={list.candidatePictureUrl}
                          alt={list.name}
                          class={styles.charterCandidateAvatar}
                          width={36}
                          height={36}
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {charters.map((charter) => (
                    <tr key={charter.id} class={styles.charterRow}>
                      <td class={styles.charterTdLabel}>
                        <Link
                          href={`/comparateur/chartes/${charter.slug}/`}
                          class={styles.charterTitleLink}
                        >
                          {charter.title}
                        </Link>
                        <span class={styles.charterOrg}>
                          {charter.organization}
                        </span>
                      </td>
                      {selectedLists.value.map((list) => {
                        const signatory = charter.signatories.find(
                          (s) => s.candidateId === list.id,
                        );
                        if (!signatory) {
                          return (
                            <td key={list.id} class={styles.charterTdCell}>
                              <span class={styles.charterNoData}>—</span>
                            </td>
                          );
                        }
                        if (charter.measures.length === 0) {
                          return (
                            <td key={list.id} class={styles.charterTdCell}>
                              {signatory.signed ? (
                                <LuCheckCircle class={styles.charterSigned} />
                              ) : (
                                <LuXCircle class={styles.charterNotSigned} />
                              )}
                            </td>
                          );
                        }
                        const total = charter.measures.length;
                        const count =
                          signatory.signedCount ??
                          signatory.signedMeasureIds.length;
                        if (!signatory.signed && count === 0) {
                          return (
                            <td key={list.id} class={styles.charterTdCell}>
                              <LuXCircle class={styles.charterNotSigned} />
                            </td>
                          );
                        }
                        if (count === total) {
                          return (
                            <td key={list.id} class={styles.charterTdCell}>
                              <LuCheckCircle class={styles.charterSigned} />
                            </td>
                          );
                        }
                        return (
                          <td key={list.id} class={styles.charterTdCell}>
                            <span class={styles.charterPartial}>
                              {count}/{total}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link
              href="/comparateur/chartes/"
              class={styles.charterDetailLink}
            >
              {t("charters.measureDetail")} →
            </Link>
          </section>

          {/* Section 3: Program comparison */}
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
                gridTemplateColumns: `repeat(${selectedLists.value.length}, 1fr)`,
              }}
            >
              {selectedLists.value.map((list) => {
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

// SSG: one page, all data baked in, selection is fully client-side
export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: [{}],
  };
};
