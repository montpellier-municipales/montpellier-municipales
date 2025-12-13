import { component$ } from '@builder.io/qwik';
import { routeLoader$, Link } from '@builder.io/qwik-city';
import { getLocale, defaultLocale } from 'compiled-i18n'; // Imports de compiled-i18n
import { getBlogPosts } from '~/services/blog';
import * as styles from './blog.css';

export const useBlogPosts = routeLoader$(async ({ params }) => {
  const lang = params.lang || 'fr'; 
  return await getBlogPosts(lang);
});

export default component$(() => {
  const posts = useBlogPosts();
  const currentLocale = getLocale(); // Utilisation de getLocale de compiled-i18n
  // const config = useSpeakConfig(); // Non nécessaire avec compiled-i18n

  return (
    <div class={styles.container}>
      <header class={styles.header}>
        <h1 class={styles.title}>Actualités</h1>
        <p>Actualités et analyses de la campagne.</p>
      </header>

      <div class={styles.postList}>
        {posts.value.map((post) => {
          // Si la langue est celle par défaut, on ne met pas de préfixe
          const prefix = currentLocale === defaultLocale ? '' : `/${currentLocale}`;
          
          return (
            <Link key={post.slug} href={`${prefix}/info/${post.slug}`} class={styles.postCard}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{post.title}</h2>
              <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
                {post.date} • Par {post.author}
              </div>
              <p>{post.excerpt}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
});
