import chartersData from "~/content/charters.json";
import type { Charter } from "~/types/schema";

export const getAllCharters = (): Charter[] => chartersData as Charter[];

export const getCharter = (slug: string): Charter | null =>
  (chartersData as Charter[]).find((c) => c.slug === slug) ?? null;
