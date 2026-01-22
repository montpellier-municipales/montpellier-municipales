import { type RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async ({ redirect, params }) => {
  throw redirect(302, `/${params.lang}/budget/montpellier/`);
};