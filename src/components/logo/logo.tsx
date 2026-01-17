import { component$ } from "@builder.io/qwik";

import MontpellierMunicipalesLogo from "~/static/monptellier-municipales-2.svg?jsx";
import { subTitle, title } from "./logo.css";

interface Props {
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span" | "p";
}

export const Logo = component$<Props>(({ tag = "h1" }) => {
  const Tag = tag;

  return (
    <>
      <MontpellierMunicipalesLogo height="32px" preserveAspectRatio="xMinYMin meet" />
      <Tag class={title}>
        <div>Montpellier</div>
        <div class={subTitle}>municipales 2026</div>
      </Tag>
    </>
  );
});
