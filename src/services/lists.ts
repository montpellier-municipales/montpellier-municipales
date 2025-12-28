import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import type { Candidate } from "~/types/schema";

const LISTS_DIR = join(process.cwd(), "src/content/lists");

async function readMarkdownFiles(
  dir: string
): Promise<Record<string, string> | undefined> {
  try {
    const files = await readdir(dir);
    const result: Record<string, string> = {};
    let hasContent = false;

    for (const file of files) {
      if (file.endsWith(".md")) {
        const lang = file.replace(".md", "");
        const content = await readFile(join(dir, file), "utf-8");
        result[lang] = content;
        hasContent = true;
      }
    }
    return hasContent ? result : undefined;
  } catch {
    // Directory might not exist or be empty, which is fine
    return undefined;
  }
}

export const getList = async (id: string): Promise<Candidate | null> => {
  try {
    const listDir = join(LISTS_DIR, id);
    const dataPath = join(listDir, "data.json");

    const fileContent = await readFile(dataPath, "utf-8");
    const listData = JSON.parse(fileContent) as Candidate;

    if (listData.disabled) return null;

    // Load markdown content
    const presentation = await readMarkdownFiles(join(listDir, "presentation"));
    const vision = await readMarkdownFiles(join(listDir, "vision"));

    return {
      ...listData,
      presentation: presentation as any,
      vision: vision as any,
    };
  } catch (error) {
    console.error(`Error reading list ${id}:`, error);
    return null;
  }
};

export const getAllLists = async (): Promise<Candidate[]> => {
  try {
    const entries = await readdir(LISTS_DIR);
    const listIds: string[] = [];

    for (const entry of entries) {
      const fullPath = join(LISTS_DIR, entry);
      const stats = await stat(fullPath);
      if (stats.isDirectory()) {
        try {
          // Check if data.json exists to confirm it's a list folder
          await stat(join(fullPath, "data.json"));
          listIds.push(entry);
        } catch {
          // Not a list folder
        }
      }
    }

    const lists = await Promise.all(listIds.map((id) => getList(id)));

    const validLists = lists.filter((list): list is Candidate => list !== null);

    // --- Logique de tri aléatoire pondéré ---
    const maxFame = 10; // Définir la notoriété maximale attendue
    const weightedLists: Candidate[] = [];

    for (const list of validLists) {
      // Si 'fame' n'est pas défini, on lui donne une valeur par défaut (ex: 5)
      const fameScore = list.fame ?? maxFame / 2;
      // Calculer un poids inverse : plus la notoriété est faible, plus le poids est élevé
      const weight = maxFame - fameScore + 1; // +1 pour que le poids ne soit jamais zéro

      // Ajouter la liste 'weight' fois au tableau temporaire
      for (let i = 0; i < weight; i++) {
        weightedLists.push(list);
      }
    }

    // Mélanger le tableau pondéré (algorithme de Fisher-Yates)
    for (let i = weightedLists.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [weightedLists[i], weightedLists[j]] = [
        weightedLists[j],
        weightedLists[i],
      ];
    }

    // Prendre un sous-ensemble unique si besoin, ou retourner la liste mélangée
    // Pour l'affichage, on veut des éléments uniques. Un Set est utile.
    // Ou, pour conserver l'ordre pondéré, on peut prendre les N premiers éléments du mélange
    // et s'assurer qu'ils sont uniques (plus complexe).

    // Pour l'affichage de la Home, on veut des listes uniques, mélangées selon leur poids.
    // Un simple mélange du tableau original, puis on tire les N premiers, mais ça ne donne pas l'effet pondéré.
    // L'approche de la duplication donne un mélange plus réaliste.
    // Ensuite on retire les doublons pour l'affichage final, tout en gardant l'ordre relatif.

    const finalOrder: Candidate[] = [];
    const seenIds = new Set<string>();
    for (const list of weightedLists) {
      if (!seenIds.has(list.id)) {
        finalOrder.push(list);
        seenIds.add(list.id);
      }
    }

    return finalOrder;
  } catch (error) {
    console.error("Error reading lists directory:", error);
    return [];
  }
};

export const getListsByIds = async (ids: string[]): Promise<Candidate[]> => {
  const promises = ids.map((id) => getList(id));
  const results = await Promise.all(promises);
  return results.filter((l): l is Candidate => l !== null);
};