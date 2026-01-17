import { component$, Slot } from "@builder.io/qwik";
import { Header } from "~/components/header/header";
import { UrlMappingProvider } from "./url-mapping-context";
import type { RequestHandler } from "@builder.io/qwik-city";
import { config } from "~/speak-config";
import { Footer } from "~/components/container/footer/footer";

export const onRequest: RequestHandler = ({ locale }) => {
  // Si aucune locale n'est définie (ex: racine / sans préfixe), on force la locale par défaut
  if (!locale()) {
    locale(config.defaultLocale.lang);
  }
};

export default component$(() => {
  return (
    <UrlMappingProvider>
      <Header />
      <main>
        <Slot />
      </main>
      <Footer />
    </UrlMappingProvider>
  );
});
