import { component$ } from "@builder.io/qwik";
import { spacer } from "./spacer.css";

export const Spacer = component$(() => <hr class={spacer} />);
