import { component$, useVisibleTask$, useSignal } from "@builder.io/qwik";
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import personnelDataRaw from "~/content/data/ville_personnel.json";
import type { PersonnelLine } from "~/types/ville";

const SECTOR_LABELS: Record<string, string> = {
  ADM: "Filière administrative",
  TECH: "Technique",
  S: "Sociale",
  MS: "Médico-sociale",
  MT: "Médico-technique",
  SP: "Sportive",
  CULT: "Culturelle",
  ANIM: "Animation",
  POL: "Police",
  POMP: "Sapeurs-pompiers",
  X: "Emplois non cités",
  DIR1: "Directeur général des services",
  DIR2: "Directeur général adjoint des services",
  DIR4: "Directeur général des services techniques",
  DIR5: "Emplois créés (art. L. 313-1 CGFP)",
  DIR6: "Directeur départemental - SDIS",
  DIR7: "Directeur départemental adjoint - SDIS",
  URB: "Urbanisme",
};

export const PersonnelEvolutionChart = component$(() => {
  const canvasSectorRef = useSignal<HTMLCanvasElement>();
  const canvasCategoryRef = useSignal<HTMLCanvasElement>();
  const selectedSector = useSignal<string | null>(null);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    Chart.register(
      BarController,
      BarElement,
      LinearScale,
      CategoryScale,
      Title,
      Tooltip,
      Legend
    );
  }, { strategy: "document-ready" });

  // Chart 1: Sector (Interactive)
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    if (!canvasSectorRef.value) return;

    const data: Record<string, PersonnelLine[]> = personnelDataRaw as any;
    const years = Object.keys(data).sort();

    const sectors = new Set<string>();
    Object.values(data).flat().forEach((p) => {
        if (p.secteur) sectors.add(p.secteur);
    });
    const sectorList = Array.from(sectors).sort();

    const datasets = sectorList.map((secteur, index) => {
        const counts = years.map(year => {
            const lines = data[year] || [];
            return lines
                .filter(l => l.secteur === secteur)
                .reduce((sum, l) => sum + l.effectifPourvu, 0);
        });
        
        const hue = (index * 137.508) % 360;
        const color = `hsl(${hue}, 65%, 60%)`;

        return {
            label: SECTOR_LABELS[secteur] || secteur || "Non défini",
            data: counts,
            backgroundColor: color,
        };
    });

    const ctx = canvasSectorRef.value.getContext("2d");
    if (!ctx) return;

    const chart = new Chart(ctx, {
        type: 'bar',
        data: { labels: years, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: "Évolution des Effectifs par Secteur", font: { size: 16 } },
                legend: { position: 'bottom' },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            let label = context.dataset.label || '';
                            if (label) label += ': ';
                            if (context.parsed.y !== null) label += context.parsed.y.toFixed(1);
                            return label;
                        }
                    }
                }
            },
            scales: { x: { stacked: true }, y: { stacked: true } },
            onClick: (event, elements) => {
                if (elements.length > 0) {
                    const datasetIndex = elements[0].datasetIndex;
                    const clickedSector = sectorList[datasetIndex];
                    selectedSector.value = clickedSector;
                }
            },
            onHover: (event, elements) => {
                const native = event.native;
                if (native && native.target) {
                    (native.target as HTMLElement).style.cursor = elements.length ? 'pointer' : 'default';
                }
            }
        }
    });

    cleanup(() => chart.destroy());
  });

  // Chart 2: Category (Reactive)
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track, cleanup }) => {
    const currentSector = track(() => selectedSector.value);
    if (!canvasCategoryRef.value) return;

    const data: Record<string, PersonnelLine[]> = personnelDataRaw as any;
    const years = Object.keys(data).sort();

    const getFilteredLines = (year: string) => {
        const lines = data[year] || [];
        if (currentSector) {
            return lines.filter(l => l.secteur === currentSector);
        }
        return lines;
    };

    const categories = new Set<string>();
    years.forEach(year => {
        getFilteredLines(year).forEach(p => {
            const cat = p.categorie ? `Catégorie ${p.categorie}` : "Non défini";
            categories.add(cat);
        });
    });
    const categoryList = Array.from(categories).sort();

    const datasets = categoryList.map((cat, index) => {
        const counts = years.map(year => {
            const lines = getFilteredLines(year);
            return lines
                .filter(l => (l.categorie ? `Catégorie ${l.categorie}` : "Non défini") === cat)
                .reduce((sum, l) => sum + l.effectifPourvu, 0);
        });

        const hue = (index * 137.508 + 60) % 360;
        const color = `hsl(${hue}, 65%, 60%)`;

        return {
            label: cat,
            data: counts,
            backgroundColor: color,
        };
    });

    const ctx = canvasCategoryRef.value.getContext("2d");
    if (!ctx) return;

    const title = currentSector 
        ? `Évolution par Catégorie (${SECTOR_LABELS[currentSector] || currentSector})`
        : "Évolution des Effectifs par Catégorie (Global)";

    const chart = new Chart(ctx, {
        type: 'bar',
        data: { labels: years, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: { display: true, text: title, font: { size: 16 } },
                legend: { position: 'bottom' },
            },
            scales: { x: { stacked: true }, y: { stacked: true } }
        }
    });

    cleanup(() => chart.destroy());
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        <div
        style={{
            height: "400px",
            width: "100%",
            backgroundColor: "white",
            padding: "1rem",
            borderRadius: "0.5rem",
            boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            border: "1px solid #e2e8f0",
        }}
        >
        <canvas ref={canvasSectorRef} />
        </div>

        {selectedSector.value && (
            <div style={{ display: "flex", justifyContent: "center" }}>
                <button 
                    onClick$={() => selectedSector.value = null}
                    style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#e2e8f0",
                        color: "#2d3748",
                        border: "1px solid #cbd5e0",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    Réinitialiser le filtre ({SECTOR_LABELS[selectedSector.value] || selectedSector.value})
                </button>
            </div>
        )}

        <div
        style={{
            height: "400px",
            width: "100%",
            backgroundColor: "white",
            padding: "1rem",
            borderRadius: "0.5rem",
            boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            border: "1px solid #e2e8f0",
        }}
        >
        <canvas ref={canvasCategoryRef} />
        </div>
    </div>
  );
});