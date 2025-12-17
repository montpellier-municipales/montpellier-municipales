import { component$, useTask$ } from "@builder.io/qwik";
import { routeLoader$, StaticGenerateHandler, type DocumentHead } from "@builder.io/qwik-city";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { marked } from "marked";
import { useUrlMapping } from "~/routes/url-mapping-context";
import { inlineTranslate } from "qwik-speak";
import { config } from "~/speak-config";
import * as styles from "../inscription/inscription.css"; // Réutilisation du style
import { markdownRenderer } from "~/utils";

const CONTENT_DIR = join(process.cwd(), "src/content/role-mairie-metropole");

export const useRoleContent = routeLoader$(async ({ params, fail }) => {
  const lang = params.lang || config.defaultLocale.lang;
  const filePath = join(CONTENT_DIR, `${lang}.md`);

  try {
    const fileContent = await readFile(filePath, "utf-8");
    const htmlContent = await marked.parse(fileContent, {
      renderer: markdownRenderer,
    });
    return { htmlContent };
  } catch (error) {
    console.error(`Error reading role content file for lang ${lang}:`, error);
    if (lang !== config.defaultLocale.lang) {
      try {
        const fallbackPath = join(
          CONTENT_DIR,
          `${config.defaultLocale.lang}.md`
        );
        const fallbackContent = await readFile(fallbackPath, "utf-8");
        const htmlContent = await marked.parse(fallbackContent, {
          renderer: markdownRenderer,
        });
        return { htmlContent };
      } catch {
        throw fail(404, { errorMessage: "Content not found" });
      }
    }
    throw fail(404, { errorMessage: "Content not found" });
  }
});

export default component$(() => {
  const data = useRoleContent();
  const mapping = useUrlMapping();

  useTask$(() => {
    config.supportedLocales.forEach((locale) => {
      if (locale.lang === config.defaultLocale.lang) {
        mapping[locale.lang] = `/role-mairie-metropole/`;
      } else {
        mapping[locale.lang] = `/${locale.lang}/role-mairie-metropole/`;
      }
    });
  });

  return (
    <div class={styles.container}>
      <article
        class={styles.content}
        dangerouslySetInnerHTML={data.value.htmlContent as string}
      />
    </div>
  );
});

export const head: DocumentHead = () => {
  const t = inlineTranslate();
  return {
    title: t("app.roleMairieMetropole.title"),
    meta: [
      {
        name: "description",
        content: t("app.roleMairieMetropole.description"),
      },
    ],
  };
};


// SSG : Génération statique pour les Listes (Français)
export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: config.supportedLocales
      .filter((locale) => locale.lang !== config.defaultLocale.lang)
      .map((locale) => ({ lang: locale.lang })),
  };
};
