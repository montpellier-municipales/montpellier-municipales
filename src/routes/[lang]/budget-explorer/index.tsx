import {
  type DocumentHead,
  type StaticGenerateHandler,
} from "@builder.io/qwik-city";
import BudgetExplorerPage, {
  useBudgetData,
  useLoanData,
  useApcpData,
  head as baseHead,
} from "../../budget-explorer/index";
import { config } from "~/speak-config";

export { useBudgetData, useLoanData, useApcpData };
export default BudgetExplorerPage;

export const head: DocumentHead = baseHead;

export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: config.supportedLocales
      .filter((locale) => locale.lang !== config.defaultLocale.lang)
      .map((locale) => ({ lang: locale.lang })),
  };
};
