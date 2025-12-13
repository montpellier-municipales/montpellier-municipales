import ComparatorPage, { useComparatorData, head, onStaticGenerate } from '../../comparateur/index';
import { locales, defaultLocale } from 'compiled-i18n';
import type { StaticGenerateHandler } from '@builder.io/qwik-city';

export { useComparatorData, head };
export default ComparatorPage;

export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: locales
      .filter(l => l !== defaultLocale)
      .map(l => ({ lang: l })),
  };
};
