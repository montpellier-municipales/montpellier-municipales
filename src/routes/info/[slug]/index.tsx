import { component$, useTask$ } from "@builder.io/qwik";
import {
  routeLoader$,
  StaticGenerateHandler,
  type DocumentHead,
} from "@builder.io/qwik-city";
import { getBlogPost, getPostAlternates, getBlogPosts } from "~/services/blog";
import { useUrlMapping } from "~/routes/url-mapping-context";
import * as styles from "../blog.css";
import { config } from "~/speak-config";

export const useBlogPost = routeLoader$(async ({ params, fail }) => {
  const lang = params.lang || "fr";
  const slug = params.slug;

  const post = await getBlogPost(slug, lang);

  if (!post) {
    throw fail(404, {
      errorMessage: "Article non trouvé",
    });
  }

  // Récupérer les slugs alternatifs
  const alternates = await getPostAlternates(post.id);

  return { post, alternates };
});

export default component$(() => {
  const data = useBlogPost();
  const mapping = useUrlMapping();
  // const config = useSpeakConfig(); // useSpeakConfig n'est plus nécessaire

  // Mettre à jour le mapping d'URL pour le LanguageSwitcher
  useTask$(({ track }) => {
    track(() => data.value.alternates);

    Object.keys(data.value.alternates).forEach((lang) => {
      const slug = data.value.alternates[lang];
      if (lang === config.defaultLocale.lang) {
        mapping[lang] = `/info/${slug}`;
      } else {
        mapping[lang] = `/${lang}/info/${slug}`;
      }
    });
  });

  return (
    <>
      <header
        class={[
          styles.header,
          ...(data.value.post.coverImage ? [styles.headerWithCoverImage] : []),
        ]}
        style={
          data.value.post.coverImage
            ? { backgroundImage: `url('${data.value.post.coverImage}')` }
            : undefined
        }
      >
        <div class={styles.headerContent}>
          <div class={styles.container}>
            <h1 class={styles.title}>{data.value.post.title}</h1>
            <div class={styles.meta}>
              <span>{data.value.post.date}</span>
              <span>|</span>
              <span>{data.value.post.author}</span>
              {data.value.post.coverImage &&
                data.value.post.coverImageCredit && (
                  <>
                    <span>|</span>
                    <span>{data.value.post.coverImageCredit}</span>
                  </>
                )}
            </div>
          </div>
        </div>
      </header>
      <div class={styles.container}>
        <article
          class={styles.content}
          dangerouslySetInnerHTML={data.value.post.content}
        />
      </div>
    </>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const data = resolveValue(useBlogPost);
  const alternates = data.alternates;
  const links = [];

  for (const [lang, slug] of Object.entries(alternates)) {
    const href =
      lang === config.defaultLocale.lang
        ? `/info/${slug}`
        : `/${lang}/info/${slug}`; // Utilisation de defaultLocale
    links.push({
      rel: "alternate",
      hreflang: lang,
      href: href,
    });
  }

  return {
    title: data.post.title,
    meta: [
      {
        name: "description",
        content: data.post.excerpt,
      },
    ],
    links: links,
  };
};

// SSG : Génération statique pour le Français (Langue par défaut)
export const onStaticGenerate: StaticGenerateHandler = async () => {
  const posts = await getBlogPosts(config.defaultLocale.lang);

  return {
    params: posts.map((post) => ({
      slug: post.slug,
    })),
  };
};
