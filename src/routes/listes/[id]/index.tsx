import { component$, useSignal, useComputed$ } from "@builder.io/qwik";
import {
  DocumentHead,
  routeLoader$,
  StaticGenerateHandler,
  useLocation,
} from "@builder.io/qwik-city";
import { getList, getAllLists } from "~/services/lists";
import { getBlogPostsByTag } from "~/services/blog";
import { getCandidateProgram } from "~/services/program";
import * as styles from "./list-details.css";
import { marked } from "marked";
import { Language } from "~/types/schema";
import { inlineTranslate, useSpeak } from "qwik-speak";
import { ArticleCard } from "~/components/article-card/article-card";
import { Dropdown } from "~/components/ui/dropdown/dropdown";
import { AnchorNav } from "~/components/ui/anchor-nav/anchor-nav";

// Loader pour récupérer les données côté serveur
export const useListDetails = routeLoader$(async (requestEvent) => {
  const listId = requestEvent.params.id;
  const lang = requestEvent.params.lang || "fr";
  const list = await getList(listId);

  if (!list) {
    throw requestEvent.fail(404, {
      errorMessage: "Liste non trouvée",
    });
  }

  const relatedPosts = await getBlogPostsByTag(lang, listId);
  const measures = await getCandidateProgram(listId, lang);

  const presentation = list.presentation
    ? (
        await Promise.all(
          Object.entries(list.presentation).map(
            async ([language, presentationMd]) => {
              const localPresentation = await marked.parse(presentationMd);
              return { [language]: localPresentation };
            }
          )
        )
      ).reduce((acc, pres) => {
        return Object.assign(acc, pres);
      }, {})
    : {};
  const vision = list.vision
    ? (
        await Promise.all(
          Object.entries(list.vision).map(async ([language, visionMd]) => {
            const localeVision = await marked.parse(visionMd);
            return { [language]: localeVision };
          })
        )
      ).reduce((acc, pres) => {
        return Object.assign(acc, pres);
      }, {})
    : {};

  return { ...list, presentation, vision, relatedPosts, measures };
});

export default component$(() => {
  useSpeak({ assets: ["list"] });
  const list = useListDetails();
  const loc = useLocation();
  const t = inlineTranslate();
  const currentLocale = (loc.params.lang as Language) ?? Language.fr;

  const selectedTag = useSignal<string>("");
  const allMeasuresLabel = t("list.allMeasures@@Toutes les mesures");
  const presentationLabel = t("list.presentationTitle@@Présentation");
  const programLabel = t("list.programTitle@@Le programme");
  const newsLabel = t("app.latestNews@@Dernières actualités");

  // Randomize measures on mount/load
  const randomizedMeasures = useComputed$(() => {
    return [...list.value.measures].sort(() => Math.random() - 0.5);
  });

  const allTags = useComputed$(() => {
    const tags = new Set<string>();
    list.value.measures.forEach((m) => {
      m.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  });

  const tagOptions = useComputed$(() => {
    const options = [{ value: "all", label: allMeasuresLabel }];
    allTags.value.forEach((tag) => {
      options.push({ value: tag, label: tag });
    });
    return options;
  });

  const filteredMeasures = useComputed$(() => {
    if (!selectedTag.value || selectedTag.value === "all")
      return randomizedMeasures.value;
    return randomizedMeasures.value.filter((m) =>
      m.tags.includes(selectedTag.value)
    );
  });

  const anchors = useComputed$(() => {
    const items = [];
    items.push({ id: "presentation", label: presentationLabel });
    if (list.value.measures.length > 0) {
      items.push({ id: "program", label: programLabel });
    }
    if (list.value.relatedPosts.length > 0) {
      items.push({ id: "news", label: newsLabel });
    }
    return items;
  });

  return (
    <div class={styles.container}>
      <header class={styles.header}>
        {/* Placeholder image si pas d'image réelle */}
        <div class={styles.logo}>
          {list.value.logoUrl && (
            // eslint-disable-next-line qwik/jsx-img
            <img
              src={list.value.logoUrl}
              alt={`Logo ${list.value.name}`}
              style={{ maxWidth: 120, maxHeight: 120 }}
            />
          )}
        </div>

        <div>
          <h1 class={styles.title}>{list.value.name}</h1>
          <p class={styles.subtitle}>
            {t("list.headOfList@@Tête de liste : {{name}}", {
              name: list.value.headOfList,
            })}
          </p>
          <div style={{ marginTop: "0.5rem" }}>
            {list.value.parties.map((party) => (
              <span key={party} class={styles.party}>
                {party}
              </span>
            ))}
          </div>
        </div>
      </header>

      {anchors.value.length > 0 && <AnchorNav anchors={anchors.value} />}

      <div id="presentation">
        <section
          class={styles.listSection}
          dangerouslySetInnerHTML={list.value.presentation?.[currentLocale]}
        ></section>

        <section
          class={styles.listSection}
          dangerouslySetInnerHTML={list.value.vision?.[currentLocale]}
        ></section>
      </div>

      {list.value.measures.length > 0 && (
        <section id="program" class={styles.listSection}>
          <div class={styles.programHeader}>
            <h2>{t("list.programTitle@@Le programme")}</h2>

            <div class={styles.filterContainer}>
              <Dropdown
                options={tagOptions.value}
                value={selectedTag.value}
                onChange$={(val) => (selectedTag.value = val)}
                placeholder={t("list.filterByCategory@@Filtrer les mesures...")}
              />
            </div>
          </div>

          <div style={{ display: "grid", gap: "0rem" }}>
            {filteredMeasures.value.map((measure) => (
              <a
                key={measure.id}
                href={
                  currentLocale === "fr"
                    ? `/listes/${list.value.id}/programme/${measure.slug}/`
                    : `/${currentLocale}/listes/${list.value.id}/programme/${measure.slug}/`
                }
                class={styles.measureCardLink}
              >
                <article class={styles.measureCard}>
                  <div class={styles.tagList}>
                    {measure.tags.map((tag) => (
                      <span key={tag} class={styles.tagBadge}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 class={styles.measureTitle}>{measure.title}</h3>
                  <div
                    class={styles.measurePreview}
                    dangerouslySetInnerHTML={measure.content}
                  ></div>
                </article>
              </a>
            ))}
          </div>
        </section>
      )}

      {list.value.relatedPosts.length > 0 && (
        <section id="news" class={styles.listSection}>
          <h2>{t("app.latestNews@@Dernières actualités")}</h2>
          <div style={{ display: "grid", gap: "1rem" }}>
            {list.value.relatedPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} lang={currentLocale} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const t = inlineTranslate();
  const list = resolveValue(useListDetails);
  return {
    title: `${list.name} · ${list.headOfList}`,
    meta: [
      {
        name: "description",
        content: t("list.description", {
          listName: list.name,
          headOfList: list.headOfList,
        }),
      },
    ],
  };
};

// SSG : Génération statique pour les Listes (Français)
export const onStaticGenerate: StaticGenerateHandler = async () => {
  const lists = await getAllLists();
  return {
    params: lists.map((list) => ({
      id: list.id,
    })),
  };
};