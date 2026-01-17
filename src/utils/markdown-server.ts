import { type RequestHandler } from "@builder.io/qwik-city";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { config } from "~/speak-config";
import { getBlogPost } from "~/services/blog";
import { getAllLists } from "~/services/lists";

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