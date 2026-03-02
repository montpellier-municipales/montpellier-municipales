import { config } from "~/speak-config";
import PositioningPage, {
  usePositioningData,
  head,
} from "../../../comparateur/positionnement/index";
import type { StaticGenerateHandler } from "@builder.io/qwik-city";

export { usePositioningData, head };
export default PositioningPage;

export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: config.supportedLocales
      .filter((locale) => locale.lang !== config.defaultLocale.lang)
      .map((locale) => ({ lang: locale.lang })),
  };
};
