import {
  component$,
  useSignal,
  useTask$,
  $,
  useComputed$,
} from "@builder.io/qwik";
import {
  routeLoader$,
  useLocation,
  useNavigate,
  type DocumentHead,
  StaticGenerateHandler,
} from "@builder.io/qwik-city";
import { getAllLists, getListsByIds } from "~/services/lists";
import { _ } from "compiled-i18n";
import { Select } from "@qwik-ui/headless";
import * as styles from "./comparator.css";
import type { Candidate } from "~/types/schema";
import { LuChevronDown } from "@qwikest/icons/lucide";
import { vars } from "~/theme.css";

// Simuler les thèmes (nous les avons déjà dans src/content/themes.json, mais pour l'exemple)
interface Theme {
  id: string;
  label: Record<string, string>; // { fr: "Transports", en: "Transport" }
  icon: string;
}

// Les thèmes devraient être chargés depuis src/content/themes.json
const allThemes: Theme[] = [
  {
    id: "transport",
    label: {
      fr: "Transports & Mobilités",
      oc: "Transpòrts e Mobilitats",
      ar: "النقل والتنقل",
      en: "Transport & Mobility",
      es: "Transporte y Movilidad",
    },
    icon: "bus",
  },
  {
    id: "logement",
    label: {
      fr: "Logement & Urbanisme",
      oc: "A lotjament e Urbanisme",
      ar: "الإسكان والتخطيط العمراني",
      en: "Housing & Urban Planning",
      es: "Vivienda y Urbanismo",
    },
    icon: "home",
  },
  {
    id: "ecologie",
    label: {
      fr: "Écologie & Environnement",
      oc: "Ecologia e Environament",
      ar: "البيئة",
      en: "Ecology & Environment",
      es: "Ecología y Medio Ambiente",
    },
    icon: "leaf",
  },
  {
    id: "securite",
    label: {
      fr: "Sécurité & Tranquillité",
      oc: "Seguretat e Tranquillitat",
      ar: "الأمن والهدوء",
      en: "Security & Tranquility",
      es: "Seguridad y Tranquilidad",
    },
    icon: "shield",
  },
];

export const useComparatorData = routeLoader$(async ({ url, locale }) => {
  const allAvailableLists = await getAllLists(); // Pour le sélecteur

  const selectedIdsParam = url.searchParams.get("listes");
  let selectedLists: Candidate[] = [];
  if (selectedIdsParam) {
    const ids = selectedIdsParam.split(",").filter(Boolean);
    selectedLists = await getListsByIds(ids);
  }

  // Mapper les thèmes avec les labels pour la langue courante
  const currentLang = locale(); // La locale actuelle
  const themes = allThemes.map((theme) => ({
    ...theme,
    currentLabel: theme.label[currentLang] || theme.label["fr"],
  }));

  return {
    allAvailableLists: allAvailableLists.map((l) => ({
      id: l.id,
      name: l.name,
      headOfList: l.headOfList,
      logoUrl: l.logoUrl,
    })),
    selectedLists,
    themes,
  };
});

export default component$(() => {
  const data = useComparatorData();
  const loc = useLocation();
  const navigate = useNavigate();
  const currentLang = loc.params.lang || "fr"; // Langue de l'URL

  // Gère les IDs des listes sélectionnées pour l'URL
  const selectedListIds = useSignal<string[]>(
    data.value.selectedLists.map((l) => l.id)
  );

  // Met à jour l'URL lorsque la sélection change
  useTask$(({ track }) => {
    track(() => selectedListIds.value);
    const newSearchParams = new URLSearchParams();
    if (selectedListIds.value.length > 0) {
      newSearchParams.set("listes", selectedListIds.value.join(","));
    }
    // navigate pour changer l'URL sans recharger la page
    navigate(`${loc.url.pathname}?${newSearchParams.toString()}`);
  });

  // Pour le sélecteur, on veut la liste de TOUS les IDs (y compris ceux non sélectionnés)
  const allListOptions = data.value.allAvailableLists.map((list) => ({
    value: list.id,
    label: `${list.name} (${list.headOfList})`,
  }));

  // Filtrer les listes déjà sélectionnées du menu déroulant
  const availableOptions = useComputed$(() => {
    return allListOptions.filter(
      (option) => !selectedListIds.value.includes(option.value)
    );
  });

  const handleAddList = $(async (newValue: string) => {
    if (newValue && !selectedListIds.value.includes(newValue)) {
      selectedListIds.value = [...selectedListIds.value, newValue];
    }
  });

  const handleRemoveList = $((idToRemove: string) => {
    selectedListIds.value = selectedListIds.value.filter(
      (id) => id !== idToRemove
    );
  });

  return (
    <div class={styles.container}>
      <h1 class={styles.title}>{_("app.menu.comparator")}</h1>

      <div class={styles.selectorContainer}>
        <label class={styles.selectorLabel}>{_("comparator.addList")}</label>
        <Select.Root bind:value={selectedListIds} onChange$={handleAddList}>
          {" "}
          {/* Bind au tableau pour simuler un multi-select simplifié */}
          <Select.Trigger class={styles.select}>
            <Select.DisplayValue
              placeholder={_("comparator.selectListPlaceholder")}
            />
            <LuChevronDown />
          </Select.Trigger>
          <Select.Popover>
            {availableOptions.value.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                <Select.ItemLabel>{option.label}</Select.ItemLabel>
              </Select.Item>
            ))}
          </Select.Popover>
        </Select.Root>
      </div>

      {data.value.selectedLists.length === 0 && (
        <p style={{ textAlign: "center", color: vars.color.textMuted }}>
          {_("comparator.noListSelected")}
        </p>
      )}

      {data.value.selectedLists.length > 0 && (
        <div
          class={styles.comparatorGrid}
          style={{
            gridTemplateColumns: `1fr repeat(${data.value.selectedLists.length}, 1fr)`,
          }}
        >
          {/* Colonne des thèmes */}
          <div style={{ padding: "1rem", fontWeight: "bold" }}>
            {_("comparator.themes")}
          </div>

          {/* En-têtes des listes sélectionnées */}
          {data.value.selectedLists.map((list) => (
            <div key={list.id} class={styles.listColumnHeader}>
              <img
                src={list.logoUrl}
                alt={`Logo ${list.name}`}
                class={styles.listLogo}
                width={60}
                height={60}
              />
              <span>{list.name}</span>
              <button
                onClick$={() => handleRemoveList(list.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: vars.color.primaryText,
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                ({_("comparator.remove")})
              </button>
            </div>
          ))}

          {/* Comparaison des programmes par thème */}
          {data.value.themes.map((theme) => (
            <>
              {/* Nom du thème */}
              <div class={styles.themeColumn} style={{ gridColumn: "1 / 2" }}>
                {theme.currentLabel}
              </div>

              {/* Programmes pour ce thème */}
              {data.value.selectedLists.map((list) => {
                const programPoint = list.program.find(
                  (p) => p.themeId === theme.id
                );
                return (
                  <div
                    key={`${list.id}-${theme.id}`}
                    class={styles.programItem}
                  >
                    {programPoint
                      ? programPoint.summary[currentLang] ||
                        programPoint.summary["fr"]
                      : _("comparator.noProgramForTheme")}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: _("app.menu.comparator"),
  meta: [
    {
      name: "description",
      content: _("comparator.metaDescription"),
    },
  ],
};

// SSG : Génération statique (la page vide par défaut)
export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: [{}], // Génère une seule page /comparateur (vide) pour chaque langue
  };
};
