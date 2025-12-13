import { component$, Slot } from '@builder.io/qwik';
import type { RequestHandler } from '@builder.io/qwik-city';
import { guessLocale, locales } from 'compiled-i18n';

// Helper pour remplacer la locale dans le pathname
const replaceLocale = (pathname: string, oldLocale: string, newLocale: string) => {
  const idx = pathname.indexOf(oldLocale);
  return (
    pathname.slice(0, idx) + newLocale + pathname.slice(idx + oldLocale.length)
  );
};

export const onRequest: RequestHandler = async ({
  request,
  url,
  redirect,
  pathname,
  params,
  locale: qwikLocale, // Renommé pour éviter conflit avec 'locales' de compiled-i18n
}) => {
  if (locales.includes(params.lang)) { // params.lang car notre dossier est [lang]
    qwikLocale(params.lang);
  } else {
    const acceptLang = request.headers.get('accept-language');
    const guessedLocale = guessLocale(acceptLang);
    
    const path =
      // Gérer les cas où la locale est invalide dans l'URL ou absente
      (params.lang && /^([a-z]{2})([_-]([a-z]{2}))?$/i.test(params.lang))
        ? '/' + replaceLocale(pathname, params.lang, guessedLocale)
        : `/${guessedLocale}${pathname}`; // Si pas de locale valide, ajoute la locale devinée

    throw redirect(301, `${path}${url.search}`);
  }
};

export default component$(() => {
  return <Slot />;
});
