import { component$ } from "@builder.io/qwik";
import {
  routeLoader$,
  Link,
  type DocumentHead,
  type StaticGenerateHandler,
} from "@builder.io/qwik-city";
import { inlineTranslate, useSpeak } from "qwik-speak";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getAllLists } from "~/services/lists";
import { getAllMeasuresForTags } from "~/services/program";
import { getBlogPostsByTag } from "~/services/blog";
import { THEMES, THEMES_BY_URL_SLUG } from "~/services/thematiques";
import { getCharter } from "~/services/charters";
import type { BlogPost } from "~/types/schema";
import * as styles from "./theme-page.css";

export const useThemeData = routeLoader$(async ({ params, locale, fail }) => {
  const theme = THEMES_BY_URL_SLUG[params.theme];
  if (!theme) throw fail(404, { message: "Thème non trouvé" });

  const lang = locale() || "fr";

  const [allLists, measuresByCandidate, comparatorI18nRaw, thematiquesI18nRaw] =
    await Promise.all([
      getAllLists(),
      getAllMeasuresForTags(theme.tags, lang),
      readFile(
        join(process.cwd(), "src/i18n", lang, "comparator.json"),
        "utf-8",
      ).then(
        (raw) =>
          JSON.parse(raw) as {
            comparator: {
              positioning: { labels: Record<string, Record<string, string>> };
            };
          },
      ),
      readFile(
        join(process.cwd(), "src/i18n", lang, "thematiques.json"),
        "utf-8",
      )
        .then(
          (raw) =>
            JSON.parse(raw) as {
              thematiques: {
                themes: Record<
                  string,
                  {
                    title: string;
                    h1: string;
                    intro: string;
                    seoTitle: string;
                    seoDescription: string;
                  }
                >;
              };
            },
        )
        .catch(() => ({
          thematiques: {
            themes: {} as Record<
              string,
              {
                title: string;
                h1: string;
                intro: string;
                seoTitle: string;
                seoDescription: string;
              }
            >,
          },
        })),
    ]);

  const positioningLabels =
    comparatorI18nRaw.comparator.positioning?.labels ?? {};

  const themeT = thematiquesI18nRaw.thematiques?.themes?.[theme.slug] ?? null;
  const translatedTheme = {
    ...theme,
    title: themeT?.title ?? theme.title,
    h1: themeT?.h1 ?? theme.h1,
    intro: themeT?.intro ?? theme.intro,
    seoTitle: themeT?.seoTitle ?? theme.seoTitle,
    seoDescription: themeT?.seoDescription ?? theme.seoDescription,
  };

  const relevantCharters = (theme.relevantCharters ?? [])
    .map((slug) => getCharter(slug))
    .filter((c): c is NonNullable<typeof c> => c !== null);

  const rankedCandidates = allLists
    .map((list) => {
      const entry = measuresByCandidate.find((e) => e.candidateId === list.id);
      const measures = entry?.measures ?? [];
      const positioningScore = theme.positioningDimension
        ? list.positioning[theme.positioningDimension]
        : null;
      const scoredMeasures = theme.positioningDimension
        ? measures.filter(
            (m) =>
              (m.positioning?.[theme.positioningDimension!] ?? null) !== null,
          )
        : [];
      const measurePositioningAvg =
        scoredMeasures.length > 0
          ? scoredMeasures.reduce(
              (sum, m) =>
                sum + (m.positioning![theme.positioningDimension!] ?? 0),
              0,
            ) / scoredMeasures.length
          : 0;

      const charterInfos = relevantCharters.map((charter) => {
        const signatory = charter.signatories.find(
          (s) => s.candidateId === list.id,
        );
        const totalMeasures = charter.measures.length;
        let ratio = 0;
        if (signatory) {
          if (totalMeasures === 0) {
            ratio = signatory.signed ? 1 : 0;
          } else if (signatory.signedCount != null) {
            ratio = signatory.signedCount / totalMeasures;
          } else {
            const signedSet = new Set(signatory.signedMeasureIds);
            for (const measure of charter.measures) {
              if (
                measure.goodResponse &&
                (measure.goodResponse === "non_pas_du_tout" ||
                  measure.goodResponse === "plutot_non") &&
                signatory.measureResponses?.[measure.id] === measure.goodResponse
              ) {
                signedSet.add(measure.id);
              }
            }
            ratio = signedSet.size / totalMeasures;
          }
        }
        return {
          id: charter.id,
          shortName:
            charter.id === "cite-bergere"
              ? "Cité Bergère"
              : charter.id === "greenpeace-aeroport"
              ? "Greenpeace"
              : charter.id.toUpperCase(),
          slug: charter.slug,
          ratio,
          signed: signatory?.signed ?? false,
          signedCount: signatory?.signedCount ?? null,
          totalMeasures,
        };
      });
      const charterCoefficient =
        charterInfos.length > 0
          ? 1 +
            charterInfos.reduce((sum, c) => sum + c.ratio, 0) /
              charterInfos.length
          : 1;

      return {
        id: list.id,
        name: list.name,
        headOfList: list.headOfList,
        logoUrl: list.logoUrl,
        candidatePictureUrl: list.candidatePictureUrl,
        positioningScore,
        positioningLabel:
          theme.positioningDimension && positioningScore !== null
            ? (positioningLabels[theme.positioningDimension]?.[
                String(positioningScore)
              ] ?? null)
            : null,
        measureCount: measures.length,
        measurePositioningAvg,
        measures,
        charterInfos,
        charterCoefficient,
      };
    })
    .sort((a, b) =>
      theme.positioningDimension
        ? (b.positioningScore ?? 1) *
            (b.measurePositioningAvg + 1) *
            Math.log2(b.measureCount + 1.5) *
            b.charterCoefficient -
          (a.positioningScore ?? 1) *
            (a.measurePositioningAvg + 1) *
            Math.log2(a.measureCount + 1.5) *
            a.charterCoefficient
        : b.measureCount * b.charterCoefficient -
          a.measureCount * a.charterCoefficient,
    );

  let relatedArticles: BlogPost[] = [];
  try {
    relatedArticles = await getBlogPostsByTag(lang, theme.slug);
  } catch {
    // no matching articles
  }

  return {
    translatedTheme,
    rankedCandidates,
    relatedArticles,
    lang,
  };
});

export default component$(() => {
  useSpeak({ assets: ["thematiques"] });
  const t = inlineTranslate();
  const data = useThemeData();
  const { translatedTheme, rankedCandidates, relatedArticles, lang } =
    data.value;
  const langPrefix = lang === "fr" ? "" : `/${lang}`;

  const topCandidate = rankedCandidates.find((c) => c.measureCount > 0);

  return (
    <div class={styles.container}>
      <nav class={styles.breadcrumb}>
        <Link href={`${langPrefix}/comparateur/`} class={styles.breadcrumbLink}>
          {t("thematiques.breadcrumb@@Comparateur")}
        </Link>
        <span>›</span>
        <span>{translatedTheme.title}</span>
      </nav>

      <header class={styles.header}>
        <h1 class={styles.h1}>{translatedTheme.h1}</h1>
        <p class={styles.intro}>{translatedTheme.intro}</p>
      </header>

      {topCandidate && (
        <div class={styles.quickAnswer}>
          <p>
            {t("thematiques.quickAnswerIntro@@D'après notre comparateur,")}{" "}
            <strong>{topCandidate.headOfList}</strong> ({topCandidate.name})
            {topCandidate.positioningLabel && (
              <>
                {" "}
                {t("thematiques.positionedAs@@se positionne comme")}{" "}
                <strong>{topCandidate.positioningLabel}</strong>{" "}
                {t("thematiques.on@@sur")}{" "}
                {translatedTheme.title.toLowerCase()}
              </>
            )}
            {topCandidate.measureCount > 0 && (
              <>
                {" "}
                {t("thematiques.and@@et")} {topCandidate.measureCount}{" "}
                {topCandidate.measureCount > 1
                  ? t("thematiques.proposalPlural@@propositions")
                  : t("thematiques.proposalSingular@@proposition")}{" "}
                {t("thematiques.inOurComparator@@dans notre comparateur.")}
              </>
            )}
            {topCandidate.charterInfos.some((ci) => ci.ratio > 0) && (
              <>
                {" "}
                {t("thematiques.charterSigned@@Il·elle a également signé")}{" "}
                {topCandidate.charterInfos
                  .filter((ci) => ci.ratio > 0)
                  .map((ci) => ci.shortName)
                  .join(` ${t("thematiques.and@@et")} `)}
                {"."}
              </>
            )}
          </p>
        </div>
      )}

      <section class={styles.section}>
        <h2 class={styles.sectionTitle}>
          {t(
            "thematiques.rankingSection@@Positionnement des candidats sur {{theme}}",
            {
              theme: translatedTheme.title.toLowerCase(),
            },
          )}
        </h2>
        <div class={styles.rankingTable}>
          {rankedCandidates.map((c, i) => (
            <div key={c.id} class={styles.rankingRow}>
              <span class={styles.rankNumber}>{i + 1}</span>
              <Link
                href={`${langPrefix}/listes/${c.id}/`}
                class={styles.candidateLink}
              >
                <img
                  src={c.candidatePictureUrl}
                  alt={c.headOfList}
                  width={32}
                  height={32}
                  class={styles.candidateLogo}
                />
                <span>
                  <strong>{c.headOfList}</strong>{" "}
                  <span class={styles.listName}>{c.name}</span>
                </span>
              </Link>
              {c.positioningLabel && (
                <span class={styles.scoreChip}>{c.positioningLabel}</span>
              )}
              <span class={styles.measureCountChip}>
                {c.measureCount}{" "}
                {c.measureCount !== 1
                  ? t("thematiques.measurePlural@@mesures")
                  : t("thematiques.measureSingular@@mesure")}
              </span>
              {c.charterInfos.map((ci) => (
                <span
                  key={ci.id}
                  class={
                    ci.ratio === 0
                      ? styles.charterChipUnsigned
                      : ci.ratio < 1
                        ? styles.charterChipPartial
                        : styles.charterChipSigned
                  }
                >
                  {ci.totalMeasures > 0
                    ? `${ci.shortName} ${ci.signedCount ?? Math.round(ci.ratio * ci.totalMeasures)}/${ci.totalMeasures}`
                    : `${ci.shortName} ${ci.ratio > 0 ? "✓" : "✗"}`}
                </span>
              ))}
            </div>
          ))}
        </div>
        {translatedTheme.positioningDimensionSlug && (
          <Link
            href={`${langPrefix}/comparateur/positionnement/${translatedTheme.positioningDimensionSlug}/`}
            class={styles.compassLink}
          >
            {t(
              "thematiques.compassLink@@Voir la Boussole Idéologique sur {{theme}} →",
              {
                theme: translatedTheme.title.toLowerCase(),
              },
            )}
          </Link>
        )}
      </section>

      {rankedCandidates.some((c) => c.measureCount > 0) && (
        <section class={styles.section}>
          <h2 class={styles.sectionTitle}>
            {t(
              "thematiques.proposalsSection@@Leurs propositions sur {{theme}}",
              {
                theme: translatedTheme.title.toLowerCase(),
              },
            )}
          </h2>
          {rankedCandidates
            .filter((c) => c.measureCount > 0)
            .map((c) => (
              <div key={c.id} class={styles.candidateBlock}>
                <div class={styles.candidateBlockHeader}>
                  <img
                    src={c.candidatePictureUrl}
                    alt={c.headOfList}
                    width={40}
                    height={40}
                    class={styles.candidateAvatar}
                  />
                  <Link
                    href={`${langPrefix}/listes/${c.id}/`}
                    class={styles.candidateBlockName}
                  >
                    {c.headOfList} · {c.name}
                  </Link>
                </div>
                <div class={styles.measuresGrid}>
                  {c.measures.map((m) => (
                    <article key={m.id} class={styles.measureCard}>
                      <Link
                        href={`${langPrefix}/listes/${c.id}/programme/${m.slug}/`}
                        class={styles.measureTitle}
                      >
                        {m.title}
                      </Link>
                      <div class={styles.tagList}>
                        {m.tags.map((tag) => (
                          <span key={tag} class={styles.tagBadge}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
        </section>
      )}

      <section class={styles.section}>
        <h2 class={styles.sectionTitle}>
          {t("thematiques.compareSection@@Comparer les programmes en détail")}
        </h2>
        <p>
          {t(
            "thematiques.compareIntro@@Notre comparateur vous permet de mettre côte à côte les propositions de plusieurs listes.",
          )}
        </p>
        <Link href={`${langPrefix}/comparateur/`} class={styles.comparatorCta}>
          {t("thematiques.compareCta@@Ouvrir le comparateur →")}
        </Link>
      </section>

      {relatedArticles.length > 0 && (
        <section class={styles.section}>
          <h2 class={styles.sectionTitle}>
            {t("thematiques.articlesSection@@Nos analyses")}
          </h2>
          <div class={styles.articlesGrid}>
            {relatedArticles.map((post) => (
              <article key={post.id} class={styles.articleCard}>
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.coverImageAlt ?? post.title}
                    class={styles.articleCover}
                    width={320}
                    height={160}
                  />
                )}
                <div class={styles.articleBody}>
                  <Link
                    href={`${langPrefix}/info/${post.slug}/`}
                    class={styles.articleTitle}
                  >
                    {post.title}
                  </Link>
                  {post.excerpt && (
                    <p class={styles.articleExcerpt}>{post.excerpt}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const data = resolveValue(useThemeData);
  return {
    title: data.translatedTheme.seoTitle,
    meta: [
      { name: "description", content: data.translatedTheme.seoDescription },
    ],
  };
};

export const onStaticGenerate: StaticGenerateHandler = async () => ({
  params: Object.values(THEMES).map((t) => ({ theme: t.urlSlug })),
});
