import MeasureDetails, { useMeasureDetails } from "../../../../../listes/[id]/programme/[slug]/index";
import { getAllLists } from "~/services/lists";
import { getCandidateProgram } from "~/services/program";
import type { StaticGenerateHandler } from "@builder.io/qwik-city";
import { config } from "~/speak-config";

export { useMeasureDetails };
export default MeasureDetails;

export const onStaticGenerate: StaticGenerateHandler = async () => {
  const params: { lang: string; id: string; slug: string }[] = [];
  const lists = await getAllLists();
  const targetLangs = config.supportedLocales.filter(
    (locale) => locale.lang !== config.defaultLocale.lang
  );

  for (const list of lists) {
    for (const loc of targetLangs) {
      const measures = await getCandidateProgram(list.id, loc.lang);
      for (const measure of measures) {
        params.push({
          lang: loc.lang,
          id: list.id,
          slug: measure.slug,
        });
      }
    }
  }

  return { params };
};
