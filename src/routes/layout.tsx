import { component$, Slot } from "@builder.io/qwik";
import { Header } from "~/components/header/header";
import { UrlMappingProvider } from "./url-mapping-context";
import type { RequestHandler } from "@builder.io/qwik-city";
import { defaultLocale } from "compiled-i18n";

export const onRequest: RequestHandler = ({ locale }) => {
  // Si aucune locale n'est définie (ex: racine / sans préfixe), on force la locale par défaut
  if (!locale()) {
    locale(defaultLocale);
  }
};

export default component$(() => {
  return (
    <UrlMappingProvider>
      <Header />
      <main>
        <Slot />
      </main>
      <footer
        style={{
          textAlign: "center",
          padding: "2rem",
          color: "#666",
          borderTop: "1px solid #eee",
          marginTop: "4rem",
        }}
      >
        <p>© 2025 Montpellier Municipales - Projet Citoyen Open Source</p>
      </footer>
    </UrlMappingProvider>
  );
});
