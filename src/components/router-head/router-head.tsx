import { component$ } from "@builder.io/qwik";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";
import { config } from "~/speak-config";

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

  // Helper to generate generic path for a language
  const getPathForLang = (lang: string) => {
    if (lang === config.defaultLocale.lang) {
      return purePath;
    }
    return purePath === "/" ? `/${lang}/` : `/${lang}${purePath}`;
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

  return (
    <>
      <title>{head.title}</title>

      <link rel="canonical" href={loc.url.href} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        http-equiv="Content-Security-Policy"
        content="default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self';"
      />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

      {head.meta.map((m) => (
        <meta key={m.key} {...m} />
      ))}

      {head.links.map((l) => (
        <link key={l.key} {...l} />
      ))}

      {newLinks.map((l) => (
        <link key={l.hreflang} {...l} />
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
