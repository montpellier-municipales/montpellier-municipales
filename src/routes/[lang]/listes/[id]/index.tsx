import ListDetails, { useListDetails } from '../../../listes/[id]/index';
import { locales, defaultLocale } from 'compiled-i18n';
import { getAllLists } from '~/services/lists';
import type { StaticGenerateHandler } from '@builder.io/qwik-city';

export { useListDetails };
export default ListDetails;

export const onStaticGenerate: StaticGenerateHandler = async () => {
  const params: { lang: string; id: string }[] = [];
  const lists = await getAllLists();
  const targetLangs = locales.filter(l => l !== defaultLocale);

  for (const list of lists) {
    for (const loc of targetLangs) {
      params.push({
        lang: loc,
        id: list.id,
      });
    }
  }

  return { params };
};