import { component$ } from "@builder.io/qwik";
import {
  DocumentHead,
  routeLoader$,
  StaticGenerateHandler,
} from "@builder.io/qwik-city";
import { getProgramMeasure, getCandidateProgram } from "~/services/program";
import { getList, getAllLists } from "~/services/lists";
import * as styles from "./measure-details.css";
import { Language } from "~/types/schema";
import { inlineTranslate, useSpeak } from "qwik-speak";
import { LuArrowLeft } from "@qwikest/icons/lucide";

export const useMeasureDetails = routeLoader$(async (requestEvent) => {
  const { id: candidateId, slug: measureSlug } = requestEvent.params;
  const lang = (requestEvent.params.lang as Language) || Language.fr;

  const candidate = await getList(candidateId);
  if (!candidate) {
    throw requestEvent.fail(404, { message: "Candidat non trouvé" });
  }

  const measure = await getProgramMeasure(candidateId, measureSlug, lang);
  if (!measure) {
    throw requestEvent.fail(404, { message: "Mesure non trouvée" });
  }

  return { candidate, measure, lang };
});

export default component$(() => {
  useSpeak({ assets: ["list"] });
  const data = useMeasureDetails();
  const t = inlineTranslate();

  const candidate = data.value.candidate;
  const measure = data.value.measure;
  const lang = data.value.lang;

  const backUrl = lang === "fr" ? `/listes/${candidate.id}/#program` : `/${lang}/listes/${candidate.id}/#program`;

  return (
    <article class={styles.container}>
      <a href={backUrl} class={styles.backLink}>
        <LuArrowLeft width={20} height={20} />
        {t("list.backToList@@Retour à la liste")}
      </a>

      <header class={styles.header}>
        <div class={styles.tagList}>
          {measure.tags.map((tag) => (
            <span key={tag} class={styles.tagBadge}>
              {tag}
            </span>
          ))}
        </div>
        <h1 class={styles.title}>{measure.title}</h1>
        <p style={{ color: vars.color.textMuted }}>
          {t("list.measureBy@@Une mesure proposée par {{candidate}}", {
            candidate: candidate.name,
          })}
        </p>
      </header>

      <div
        class={styles.content}
        dangerouslySetInnerHTML={measure.content}
      ></div>
    </article>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const data = resolveValue(useMeasureDetails);
  return {
    title: `${data.measure.title} · ${data.candidate.name}`,
    meta: [
      {
        name: "description",
        content: data.measure.title,
      },
    ],
  };
};

export const onStaticGenerate: StaticGenerateHandler = async () => {
  const lists = await getAllLists();
  const params = [];

  for (const list of lists) {
    const measures = await getCandidateProgram(list.id, "fr");
    for (const measure of measures) {
      params.push({
        id: list.id,
        slug: measure.slug,
      });
    }
  }

  return { params };
};

// We need to import vars as well for the component to work
import { vars } from "~/theme.css";
