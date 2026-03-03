import {
  component$,
  useSignal,
  useTask$,
  useVisibleTask$,
  $,
  useComputed$,
} from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik";
import {
  routeLoader$,
  useLocation,
  Link,
  type DocumentHead,
  type StaticGenerateHandler,
} from "@builder.io/qwik-city";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getAllLists } from "~/services/lists";
import { getCandidateProgram } from "~/services/program";
import { THEMES } from "~/services/thematiques";
import { getAllCharters } from "~/services/charters";
import * as styles from "./comparator.css";
import { PositioningSection } from "./PositioningSection";
import { inlineTranslate, useSpeak } from "qwik-speak";
import { LuCheckCircle, LuXCircle } from "@qwikest/icons/lucide";

// Pre-load ALL lists + their programs at SSG time.
// In SSR/dev mode, also reads ?listes= to enable server-side rendering of the
// conditional section (fixes translation race with qwik-speak async loading).
export const useComparatorData = routeLoader$(async ({ locale, url }) => {
  const lang = locale();

  // Pre-compute positioning labels server-side to avoid client-side t() race
  const comparatorI18nPath = join(
    process.cwd(),
    "src/i18n",
    lang,
    "comparator.json",
  );
  const comparatorI18nRaw = JSON.parse(
    await readFile(comparatorI18nPath, "utf-8"),
  ) as {
    comparator: {
      positioningSection: string;
      positioningSectionDesc: string;
      positioning: {
        dimensions: Record<string, string>;
        labels: Record<string, Record<string, string>>;
      };
    };
  };
  const ci18n = comparatorI18nRaw.comparator;
  const positioningTranslations = {
    sectionTitle: ci18n.positioningSection ?? "",
    sectionDesc: ci18n.positioningSectionDesc ?? "",
    dimensions: ci18n.positioning?.dimensions ?? {},
    labels: ci18n.positioning?.labels ?? {},
  };

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

  // Parse ?listes= so the server can render the conditional section during SSR,
  // ensuring t() runs inside _speakServerContext where translations are synchronous.
  const initialSelectedIds =
    url.searchParams.get("listes")?.split(",").filter(Boolean) ?? [];

  return {
    allListsWithPrograms,
    charters,
    initialSelectedIds,
    positioningTranslations,
  };
});

export default component$(() => {
  useSpeak({ assets: ["comparator", "charters"] });
  const t = inlineTranslate();
  const data = useComparatorData();
  const { charters } = data.value;
  const loc = useLocation();

  // Initialized server-side from URL params (fixes translation race in SSR/dev)
  const selectedListIds = useSignal<string[]>(data.value.initialSelectedIds);
  const activeTag = useSignal<string | null>(null);

  // SSG-only fallback: in static builds the loader always returns [] because
  // params aren't known at build time; read from window.location on the client.
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if (selectedListIds.value.length === 0) {
      const param = new URLSearchParams(window.location.search).get("listes");
      if (param) selectedListIds.value = param.split(",").filter(Boolean);
    }
  }, { strategy: "document-ready" });

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
      <div class={styles.heroBlock}>
        <h1 class={styles.pageTitle}>{t("comparator.pageTitle@@Municipales 2026 : comparer les programmes")}</h1>
        <p class={styles.intro}>{t("comparator.seoIntro")}</p>
      </div>

      {/* Thématiques navigation */}
      <section class={styles.sectionCard}>
        <h2 class={styles.sectionTitle}>{t("comparator.themesSection")}</h2>
        <nav class={styles.themesGrid}>
          {Object.values(THEMES).map((theme) => (
            <Link
              key={theme.slug}
              href={`/thematiques/${theme.urlSlug}/`}
              class={styles.themeLink}
            >
              {theme.title}
            </Link>
          ))}
        </nav>
      </section>

      {/* List selection cards */}
      <section class={styles.sectionCard}>
        <h2 class={styles.sectionTitle}>{t("comparator.selectLists")}</h2>
        <div class={styles.candidateGrid}>
          {data.value.allListsWithPrograms.map((list) => {
            const isSelected = selectedListIds.value.includes(list.id);
            return (
              <button
                key={list.id}
                class={
                  isSelected
                    ? styles.candidateCardActive
                    : styles.candidateCard
                }
                onClick$={() => toggleList(list.id)}
              >
                <img
                  src={list.candidatePictureUrl}
                  alt={list.headOfList}
                  class={styles.candidateCardAvatar}
                  width={56}
                  height={56}
                />
                <span class={styles.candidateCardHead}>{list.headOfList}</span>
                <span class={styles.candidateCardListName}>{list.name}</span>
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
          <PositioningSection
            selectedLists={selectedLists.value}
            positioningTranslations={data.value.positioningTranslations}
          />

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
    title: t("comparator.pageTitle@@Municipales 2026 : comparer les programmes"),
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
