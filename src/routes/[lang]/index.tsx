import Home, { useLists, head } from '../index';
import { locales, defaultLocale } from 'compiled-i18n';
import type { StaticGenerateHandler } from '@builder.io/qwik-city';

export { useLists, head };
export default Home;

export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: locales
      .filter(l => l !== defaultLocale)
      .map(l => ({ lang: l })),
  };
};
