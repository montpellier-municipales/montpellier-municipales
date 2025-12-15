import ListDetails, { useListDetails } from "../../../listes/[id]/index";
import { getAllLists } from "~/services/lists";
import type { StaticGenerateHandler } from "@builder.io/qwik-city";
import { config } from "~/speak-config";

export { useListDetails };
export default ListDetails;

export const onStaticGenerate: StaticGenerateHandler = async () => {
  const params: { lang: string; id: string }[] = [];
  const lists = await getAllLists();
  const targetLangs = config.supportedLocales.filter(
    (locale) => locale.lang !== config.defaultLocale.lang
  );

  for (const list of lists) {
    for (const loc of targetLangs) {
      params.push({
        lang: loc.lang,
        id: list.id,
      });
    }
  }

  return { params };
};
