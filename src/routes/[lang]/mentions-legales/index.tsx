import { component$, useTask$ } from "@builder.io/qwik";
import {
  routeLoader$,
  StaticGenerateHandler,
  type DocumentHead,
} from "@builder.io/qwik-city";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { marked } from "marked";
import { useUrlMapping } from "~/routes/url-mapping-context";
import { inlineTranslate } from "qwik-speak";
import { config } from "~/speak-config";
import * as styles from "~/styles/page-content.css";
import { markdownRenderer } from "~/utils";

const CONTENT_DIR = join(process.cwd(), "src/content/mentions-legales");

export const useLegalNoticesContent = routeLoader$(async ({ params, fail }) => {
  const lang = params.lang || config.defaultLocale.lang;
  const filePath = join(CONTENT_DIR, `${lang}.md`);

  try {
    const fileContent = await readFile(filePath, "utf-8");
    const htmlContent = await marked.parse(fileContent, {
      renderer: markdownRenderer,
    });
    return { htmlContent };
  } catch (error) {
    console.error(
      `Error reading mentions-legales file for lang ${lang}:`,
      error
    );
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
  const data = useLegalNoticesContent();
  const mapping = useUrlMapping();

  useTask$(() => {
    config.supportedLocales.forEach((locale) => {
      if (locale.lang === config.defaultLocale.lang) {
        mapping[locale.lang] = `/mentions-legales/`;
      } else {
        mapping[locale.lang] = `/${locale.lang}/mentions-legales/`;
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
    title: t("app.footer.legalNotices") + " - Montpellier Municipales 2026",
  };
};

export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: config.supportedLocales
      .filter((locale) => locale.lang !== config.defaultLocale.lang)
      .map((locale) => ({ lang: locale.lang })),
  };
};
