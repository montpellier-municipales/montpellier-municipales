import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { ProgramMeasure } from "~/types/schema";
import { getAllLists } from "~/services/lists";

const LISTS_DIR = join(process.cwd(), "src/content/lists");

/**
 * Lit un fichier de mesure de programme et retourne son contenu
 */
async function parseMeasureFile(
  filePath: string,
  measureId: string,
  lang: string
): Promise<ProgramMeasure | null> {
  try {
    const fileContent = await readFile(filePath, "utf-8");
    const { data, content: markdownContent } = matter(fileContent);
    const htmlContent = await marked.parse(markdownContent);

    return {
      id: measureId,
      slug: data.slug || measureId,
      lang,
      title: data.title,
      image: data.image,
      imageAlt: data.imageAlt,
      imageCredit: data.imageCredit,
      tags: data.tags || [],
      content: htmlContent as string,
      contentMarkdown: markdownContent,
      positioning: data.positioning,
    };
  } catch {
    return null;
  }
}

/**
 * Récupère toutes les mesures d'un candidat pour une langue donnée
 */
export const getCandidateProgram = async (
  candidateId: string,
  lang: string
): Promise<ProgramMeasure[]> => {
  const programDir = join(LISTS_DIR, candidateId, "program");

  try {
    const entries = await readdir(programDir);
    const measurePromises = entries.map(async (measureId) => {
      const measurePath = join(programDir, measureId);
      const entryStat = await stat(measurePath);

      if (entryStat.isDirectory()) {
        const filePath = join(measurePath, `${lang}.md`);
        return await parseMeasureFile(filePath, measureId, lang);
      }
      return null;
    });

    const measures = await Promise.all(measurePromises);
    return measures.filter((m): m is ProgramMeasure => m !== null);
  } catch {
    // Si le dossier program n'existe pas encore
    return [];
  }
};

/**
 * Récupère toutes les mesures correspondant à un positionnement donné, pour toutes les listes
 */
export async function getAllMeasuresForPositioningValue(
  dimension: string,
  value: number,
  lang: string,
): Promise<
  Array<
    ProgramMeasure & {
      candidateId: string;
      candidateName: string;
      candidateHeadOfList: string;
      candidateLogo: string;
    }
  >
> {
  const allLists = await getAllLists();
  const results = await Promise.all(
    allLists.map(async (list) => {
      const measures = await getCandidateProgram(list.id, lang);
      return measures
        .filter(
          (m) =>
            m.positioning?.[dimension as keyof typeof m.positioning] === value,
        )
        .map((m) => ({
          ...m,
          candidateId: list.id,
          candidateName: list.name,
          candidateHeadOfList: list.headOfList,
          candidateLogo: list.candidatePictureUrl,
        }));
    }),
  );
  return results.flat();
}

/**
 * Récupère une mesure spécifique
 */
export const getProgramMeasure = async (
  candidateId: string,
  measureSlug: string,
  lang: string
): Promise<ProgramMeasure | null> => {
  const measures = await getCandidateProgram(candidateId, lang);
  return measures.find((m) => m.slug === measureSlug) || null;
};
