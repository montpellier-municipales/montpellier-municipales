import { component$ } from "@builder.io/qwik";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";
import { config } from "~/speak-config";

const ORIGIN = "https://montpellier-municipales.fr";

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  // Helper to get the path without language prefix
  const getPurePath = (pathname: string) => {
    for (const locale of config.supportedLocales) {
      if (locale.lang === config.defaultLocale.lang) continue;
      if (
        pathname.startsWith(`/${locale.lang}/`) ||
        pathname === `/${locale.lang}`
      ) {
        return pathname.substring(locale.lang.length + 1) || "/";
      }
    }
    return pathname;
  };

  const purePath = getPurePath(loc.url.pathname);

  // Helper to generate absolute path for a language
  const getPathForLang = (lang: string) => {
    let path = "";
    if (lang === config.defaultLocale.lang) {
      path = purePath;
    } else {
      path = purePath === "/" ? `/${lang}/` : `/${lang}${purePath}`;
    }
    return `${ORIGIN}${path}`;
  };

  // Identify existing alternates provided by the page (e.g. blog posts)
  const existingAlternates = new Set(
    head.links
      .filter((l) => l.rel === "alternate" && l.hreflang)
      .map((l) => l.hreflang)
  );

  const newLinks = [];

  // Generate missing alternates
  config.supportedLocales.forEach((locale) => {
    if (!existingAlternates.has(locale.lang)) {
      newLinks.push({
        rel: "alternate",
        hreflang: locale.lang,
        href: getPathForLang(locale.lang),
      });
    }
  });

  // Add x-default if missing (points to default lang)
  if (!existingAlternates.has("x-default")) {
    newLinks.push({
      rel: "alternate",
      hreflang: "x-default",
      href: getPathForLang(config.defaultLocale.lang),
    });
  }

  // Add markdown source link for content pages
  const cleanPurePath = purePath.endsWith("/") && purePath.length > 1 ? purePath.slice(0, -1) : purePath;
  const isContentPage = [
    "/",
    "/contact",
    "/inscription",
    "/mentions-legales",
    "/politique-confidentialite",
    "/qui-sommes-nous",
    "/role-mairie-metropole",
  ].includes(cleanPurePath) || (cleanPurePath.startsWith("/info/") && cleanPurePath.length > 6);

  if (isContentPage) {
    let mdHref = "";
    const basePath = loc.url.pathname.endsWith("/") ? loc.url.pathname.slice(0, -1) : loc.url.pathname;
    
    if (cleanPurePath === "/") {
      mdHref = basePath + "/index.md";
    } else {
      mdHref = basePath + ".md";
    }

    newLinks.push({
      rel: "alternate",
      type: "text/markdown",
      href: `${ORIGIN}${mdHref}`, // Make markdown link absolute too? Usually useful but not strictly required by SEO. Doing it for consistency.
      title: "Markdown Source",
    } as any);
  }

  // Ensure absolute canonical URL
  const canonicalUrl = `${ORIGIN}${loc.url.pathname}`;

  return (
    <>
      <title>{head.title}</title>

      <link rel="canonical" href={canonicalUrl} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'self' https://www.youtube.com https://youtube.com;"
      />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

      {head.meta.map((m) => (
        <meta key={m.key} {...m} />
      ))}

      {head.links.map((l) => {
        // Fix existing alternate links to be absolute if they are relative
        if (l.rel === "alternate" && l.href && l.href.startsWith("/")) {
            return <link key={l.key} {...l} href={`${ORIGIN}${l.href}`} />;
        }
        return <link key={l.key} {...l} />;
      })}

      {newLinks.map((l) => (
        <link key={l.hreflang || l.title} {...l} />
      ))}

      {head.styles.map((s) => (
        <style
          key={s.key}
          {...s.props}
          {...(s.props?.dangerouslySetInnerHTML
            ? {}
            : { dangerouslySetInnerHTML: s.style })}
        />
      ))}

      {head.scripts.map((s) => (
        <script
          key={s.key}
          {...s.props}
          {...(s.props?.dangerouslySetInnerHTML
            ? {}
            : { dangerouslySetInnerHTML: s.script })}
        />
      ))}
    </>
  );
});
