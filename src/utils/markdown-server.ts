import { type RequestHandler } from "@builder.io/qwik-city";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { config } from "~/speak-config";
import { getBlogPost } from "~/services/blog";
import { getAllLists } from "~/services/lists";
import { getAllMeasuresForTags } from "~/services/program";
import { THEMES_BY_URL_SLUG } from "~/services/thematiques";

/**
 * Charge les traductions manuellement pour la génération de markdown
 */
async function getTranslations(lang: string, asset: string) {
  try {
    const path = join(process.cwd(), "src/i18n", lang, `${asset}.json`);
    const content = await readFile(path, "utf-8");
    return JSON.parse(content);
  } catch {
    return {};
  }
}

export const serveStaticMarkdown = (pageDir: string): RequestHandler => {
  return async (ev) => {
    try {
        const lang = ev.params.lang || config.defaultLocale.lang;
        const filePath = join(process.cwd(), "src/content", pageDir, `${lang}.md`);
        const content = await readFile(filePath, "utf-8");
        
        ev.headers.set("Content-Type", "text/markdown; charset=utf-8");
        ev.text(200, content);
    } catch {
        ev.text(404, "Markdown not found");
    }
  };
};

export const serveHomeMarkdown: RequestHandler = async (ev) => {
    try {
        const lang = ev.params.lang || config.defaultLocale.lang;
        const filePath = join(process.cwd(), "src/content/home", `${lang}.md`);
        let content = await readFile(filePath, "utf-8");
        
        const homeTranslations = await getTranslations(lang, "home");
        const lists = await getAllLists();

        // 1. Générer le markdown du Countdown
        const targetDate = "6 février 2026";
        const countdownTitle = homeTranslations.home?.countdown?.title || "Fin des inscriptions";
        const countdownMd = `> **${countdownTitle}**
> Date limite : ${targetDate}
> ${homeTranslations.home?.countdown?.euMessage || ""}`;

        // 2. Générer le markdown de la liste des candidats (Table + Détails)
        const tableHeaderList = homeTranslations.home?.list || "Liste";
        const tableHeaderHead = homeTranslations.home?.headOfList || "Tête de liste";
        const tableHeaderParties = homeTranslations.home?.parties || "Partis"; // Fallback if key missing

        let candidatesMd = `| ${tableHeaderList} | ${tableHeaderHead} | ${tableHeaderParties} |
| :--- | :--- | :--- |
`;
        let candidatesDetailsMd = "\n\n";

        const listPromises = lists.map(async (list) => {
            const link = `https://montpellier-municipales.fr${lang === 'fr' ? '' : '/' + lang}/listes/${list.id}`;
            const parties = list.parties.join(", ");
            
            // Table row
            const row = `| [${list.name}](${link}) | ${list.headOfList} | ${parties} |
`;

            // Detailed content from presentation file
            let presentationContent = "";
            try {
                const presPath = join(process.cwd(), "src/content/lists", list.id, "presentation", `${lang}.md`);
                presentationContent = await readFile(presPath, "utf-8");
            } catch {
                try {
                    // Fallback to FR
                    const presPathFr = join(process.cwd(), "src/content/lists", list.id, "presentation", `fr.md`);
                    presentationContent = await readFile(presPathFr, "utf-8");
                } catch {
                    presentationContent = "";
                }
            }

            const detail = `
### [${list.name}](${link})

**${tableHeaderHead} :** ${list.headOfList}  
**${tableHeaderParties} :** ${parties}

${presentationContent}

---
`;
            return { row, detail };
        });

        const listResults = await Promise.all(listPromises);
        
        listResults.forEach(res => {
            candidatesMd += res.row;
            candidatesDetailsMd += res.detail;
        });

        const fullCandidatesSection = candidatesMd + candidatesDetailsMd;

        // 3. Remplacer les placeholders
        content = content.replace("<!-- countdown -->", countdownMd);
        content = content.replace("<!-- candidates -->", fullCandidatesSection);

        ev.headers.set("Content-Type", "text/markdown; charset=utf-8");
        ev.text(200, content);
    } catch (e) {
        console.error("Error serving home markdown:", e);
        ev.text(404, "Markdown not found");
    }
};

export const serveBlogMarkdown: RequestHandler = async (ev) => {
    try {
        const lang = ev.params.lang || config.defaultLocale.lang;
        const slug = ev.params.slug;
        
        const post = await getBlogPost(slug, lang);
        
        if (!post) {
            ev.text(404, "Post not found");
            return;
        }

        const filePath = join(process.cwd(), "src/content/blog", post.id, `${lang}.md`);
        const content = await readFile(filePath, "utf-8");

        ev.headers.set("Content-Type", "text/markdown; charset=utf-8");
        ev.text(200, content);
    } catch {
        ev.text(404, "Markdown source not found");
    }
};

export const serveThemeMarkdown: RequestHandler = async (ev) => {
    try {
        const lang = ev.params.lang || config.defaultLocale.lang;
        const theme = THEMES_BY_URL_SLUG[ev.params.theme];
        if (!theme) {
            ev.text(404, "Theme not found");
            return;
        }

        const langPrefix = lang === config.defaultLocale.lang ? "" : `/${lang}`;
        const baseUrl = `https://montpellier-municipales.fr${langPrefix}`;

        const [thematiquesI18n, comparatorI18n, allLists, measuresByCandidate] =
            await Promise.all([
                getTranslations(lang, "thematiques"),
                getTranslations(lang, "comparator"),
                getAllLists(),
                getAllMeasuresForTags(theme.tags, lang),
            ]);

        const positioningLabels =
            (comparatorI18n as { comparator?: { positioning?: { labels?: Record<string, Record<string, string>> } } })
                .comparator?.positioning?.labels ?? {};

        const themeT =
            (thematiquesI18n as { thematiques?: { themes?: Record<string, { title: string; h1: string; intro: string }> } })
                .thematiques?.themes?.[theme.slug] ?? null;

        const title = themeT?.title ?? theme.title;
        const h1 = themeT?.h1 ?? theme.h1;
        const intro = themeT?.intro ?? theme.intro;

        const ui = (thematiquesI18n as {
            thematiques?: {
                rankingSection?: string;
                proposalsSection?: string;
                measureSingular?: string;
                measurePlural?: string;
            };
        }).thematiques ?? {};

        const rankingSection = (ui.rankingSection ?? "Positionnement des candidats sur {{theme}}").replace("{{theme}}", title.toLowerCase());
        const proposalsSection = (ui.proposalsSection ?? "Leurs propositions sur {{theme}}").replace("{{theme}}", title.toLowerCase());
        const measureSingular = ui.measureSingular ?? "mesure";
        const measurePlural = ui.measurePlural ?? "mesures";

        const rankedCandidates = allLists
            .map((list) => {
                const entry = measuresByCandidate.find((e) => e.candidateId === list.id);
                const measures = entry?.measures ?? [];
                const positioningScore = theme.positioningDimension
                    ? list.positioning[theme.positioningDimension]
                    : null;
                const scoredMeasures = theme.positioningDimension
                    ? measures.filter(
                          (m) => (m.positioning?.[theme.positioningDimension!] ?? null) !== null,
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
                const positioningLabel =
                    theme.positioningDimension && positioningScore !== null
                        ? (positioningLabels[theme.positioningDimension]?.[String(positioningScore)] ?? null)
                        : null;
                return {
                    id: list.id,
                    name: list.name,
                    headOfList: list.headOfList,
                    positioningScore,
                    positioningLabel,
                    measureCount: measures.length,
                    measurePositioningAvg,
                    measures,
                };
            })
            .sort((a, b) =>
                theme.positioningDimension
                    ? (b.positioningScore ?? 1) *
                          b.measurePositioningAvg *
                          Math.log2(b.measureCount + 1.5) -
                      (a.positioningScore ?? 1) *
                          a.measurePositioningAvg *
                          Math.log2(a.measureCount + 1.5)
                    : b.measureCount - a.measureCount,
            );

        const lines: string[] = [];
        lines.push(`# ${h1}`);
        lines.push("");
        lines.push(intro);
        lines.push("");
        lines.push(`Source: ${baseUrl}/thematiques/${theme.urlSlug}/`);
        lines.push("");

        lines.push(`## ${rankingSection}`);
        lines.push("");
        rankedCandidates.forEach((c, i) => {
            const labelPart = c.positioningLabel ? ` — ${c.positioningLabel}` : "";
            const countPart = ` — ${c.measureCount} ${c.measureCount !== 1 ? measurePlural : measureSingular}`;
            lines.push(
                `${i + 1}. **${c.headOfList}** ([${c.name}](${baseUrl}/listes/${c.id}/))${labelPart}${countPart}`,
            );
        });
        lines.push("");

        const candidatesWithMeasures = rankedCandidates.filter((c) => c.measureCount > 0);
        if (candidatesWithMeasures.length > 0) {
            lines.push(`## ${proposalsSection}`);
            lines.push("");
            for (const c of candidatesWithMeasures) {
                lines.push(`### ${c.headOfList} · ${c.name}`);
                lines.push("");
                for (const m of c.measures) {
                    lines.push(
                        `- [${m.title}](${baseUrl}/listes/${c.id}/programme/${m.slug}/)`,
                    );
                }
                lines.push("");
            }
        }

        ev.headers.set("Content-Type", "text/markdown; charset=utf-8");
        ev.text(200, lines.join("\n"));
    } catch (e) {
        console.error("Error serving theme markdown:", e);
        ev.text(404, "Markdown not found");
    }
};