import { component$ } from "@builder.io/qwik";
import { routeLoader$, useLocation } from "@builder.io/qwik-city";
import { getBlogPosts } from "~/services/blog";
import * as styles from "./blog.css";
import { inlineTranslate, useSpeak } from "qwik-speak";
import { ArticleCard } from "~/components/article-card/article-card";

export const useBlogPosts = routeLoader$(async ({ params }) => {
  const lang = params.lang || "fr";
  return await getBlogPosts(lang);
});

export default component$(() => {
  useSpeak({ assets: ["actu"] });
  const posts = useBlogPosts();
  const loc = useLocation();
  const t = inlineTranslate();
  const currentLocale = loc.params.lang || "fr";

  return (
    <div class={styles.container}>
      <header class={styles.header}>
        <h1 class={styles.title}>{t("actu.title")}</h1>
        <p>{t("actu.subTitle")}.</p>
      </header>

      <div class={styles.postList}>
        {posts.value.map((post) => (
          <ArticleCard key={post.slug} post={post} lang={currentLocale} />
        ))}
      </div>
    </div>
  );
});
