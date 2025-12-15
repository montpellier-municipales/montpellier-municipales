import { component$ } from "@builder.io/qwik";
import { routeLoader$, Link, useLocation } from "@builder.io/qwik-city";
import { getBlogPosts } from "~/services/blog";
import * as styles from "./blog.css";
import { inlineTranslate, useSpeak } from "qwik-speak";

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
        {posts.value.map((post) => {
          // Si la langue est celle par défaut, on ne met pas de préfixe
          const prefix = currentLocale === "fr" ? "" : `/${currentLocale}`;

          return (
            <Link
              key={post.slug}
              href={`${prefix}/info/${encodeURI(post.slug)}`}
              class={styles.postCard}
            >
              <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                {post.title}
              </h2>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#666",
                  marginBottom: "1rem",
                }}
              >
                {post.date}
              </div>
              <p>{post.excerpt}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
});
