import { component$, useTask$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { marked } from "marked";
import { useUrlMapping } from "~/routes/url-mapping-context";
import { inlineTranslate } from "qwik-speak";
import { config } from "~/speak-config";
import * as styles from "~/styles/page-content.css";
import { markdownRenderer } from "~/utils";

const CONTENT_DIR = join(process.cwd(), "src/content/qui-sommes-nous");

export const useWhoAreWeContent = routeLoader$(async ({ fail }) => {
  const lang = config.defaultLocale.lang;
  const filePath = join(CONTENT_DIR, `${lang}.md`);

  try {
    const fileContent = await readFile(filePath, "utf-8");
    const htmlContent = await marked.parse(fileContent, {
      renderer: markdownRenderer,
    });
    return { htmlContent };
  } catch (error) {
    console.error(`Error reading who-are-we file for lang ${lang}:`, error);
    throw fail(404, { errorMessage: "Content not found" });
  }
});

export default component$(() => {
  const data = useWhoAreWeContent();
  const mapping = useUrlMapping();

  useTask$(() => {
    config.supportedLocales.forEach((locale) => {
      if (locale.lang === config.defaultLocale.lang) {
        mapping[locale.lang] = `/qui-sommes-nous/`;
      } else {
        mapping[locale.lang] = `/${locale.lang}/qui-sommes-nous/`;
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
    title: t("app.footer.whoAreWe") + " - Montpellier Municipales 2026",
  };
};
