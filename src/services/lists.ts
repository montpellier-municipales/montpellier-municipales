import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import type { Candidate } from "~/types/schema";

const LISTS_DIR = join(process.cwd(), "src/content/lists");

export const getList = async (id: string): Promise<Candidate | null> => {
  try {
    const filePath = join(LISTS_DIR, `${id}.json`);
    const fileContent = await readFile(filePath, "utf-8");
    return JSON.parse(fileContent) as Candidate;
  } catch (error) {
    console.error(`Error reading list ${id}:`, error);
    return null;
  }
};

export const getAllLists = async (): Promise<Candidate[]> => {
  try {
    const files = await readdir(LISTS_DIR);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const lists = await Promise.all(
      jsonFiles.map(async (file) => {
        const id = file.replace(".json", "");
        return getList(id);
      })
    );

    const validLists = lists.filter((list): list is Candidate => list !== null);

    // --- Logique de tri aléatoire pondéré ---
    const maxFame = 10; // Définir la notoriété maximale attendue
    const weightedLists: Candidate[] = [];

    for (const list of validLists) {
      // Si 'fame' n'est pas défini, on lui donne une valeur par défaut (ex: 5)
      const fameScore = list.fame ?? (maxFame / 2); 
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
      [weightedLists[i], weightedLists[j]] = [weightedLists[j], weightedLists[i]];
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
    for(const list of weightedLists) {
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