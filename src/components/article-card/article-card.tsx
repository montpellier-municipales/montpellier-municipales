import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import * as styles from "./article-card.css";
import type { BlogPost } from "~/types/schema";

interface ArticleCardProps {
  post: BlogPost;
  lang: string;
}

export const ArticleCard = component$<ArticleCardProps>(({ post, lang }) => {
  // Si la langue est celle par défaut (fr), on ne met pas de préfixe pour garder les URLs propres
  // Mais attention, si votre logique de routage impose toujours /fr/, ajustez ici.
  // D'après le code existant dans routes/info/index.tsx : const prefix = currentLocale === "fr" ? "" : `/${currentLocale}`;
  const prefix = lang === "fr" ? "" : `/${lang}`;
  const href = `${prefix}/info/${encodeURI(post.slug)}`;

  return (
    <Link href={href} class={styles.card}>
      <h2 class={styles.title}>{post.title}</h2>
      <div class={styles.date}>{post.date}</div>
      {post.excerptHtml ? (
        <div class={styles.excerpt} dangerouslySetInnerHTML={post.excerptHtml} />
      ) : (
        <p class={styles.excerpt}>{post.excerpt}</p>
      )}
    </Link>
  );
});
