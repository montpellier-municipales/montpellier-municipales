import { component$, useVisibleTask$, useSignal, useStore } from "@builder.io/qwik";
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
import patrimoineDataRaw from "~/content/data/ville_patrimoine.json";
import type { AssetLine } from "~/types/ville";

export const PatrimoineEvolutionChart = component$(() => {
  const canvasRef = useSignal<HTMLCanvasElement>();
  const state = useStore({
    selectedYear: null as string | null,
    items: [] as AssetLine[],
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    Chart.register(
      BarController,
      BarElement,
      LinearScale,
      CategoryScale,
      Title,
      Tooltip,
      Legend
    );

    if (!canvasRef.value) return;

    const data: Record<string, AssetLine[]> = patrimoineDataRaw as any;
    const years = Object.keys(data).sort();

    const entryData = years.map(year => 
        data[year]
            .filter(l => l.entreeSortie === "E")
            .reduce((sum, l) => sum + l.valeurAcquisition, 0)
    );

    const exitData = years.map(year => 
        data[year]
            .filter(l => l.entreeSortie === "S")
            .reduce((sum, l) => sum + l.valeurAcquisition, 0)
    );

    const ctx = canvasRef.value.getContext("2d");
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: years,
        datasets: [
          {
            label: "Entrées (Acquisitions)",
            data: entryData,
            backgroundColor: "#48BB78", // Green
            borderColor: "#38A169",
            borderWidth: 1,
          },
          {
            label: "Sorties (Cessions/Mises au rebut)",
            data: exitData,
            backgroundColor: "#F56565", // Red
            borderColor: "#E53E3E",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: { display: true, text: "Flux du Patrimoine (Valeur des mouvements)", font: { size: 16 } },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        return context.dataset.label + ": " + 
                        new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(context.parsed.y || 0);
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => new Intl.NumberFormat("fr-FR", { notation: "compact" }).format(Number(value)) + " €"
                }
            }
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                const year = years[index];
                state.selectedYear = year;
                // Sort by value desc
                state.items = (data[year] || []).sort((a, b) => b.valeurAcquisition - a.valeurAcquisition);
            }
        },
        onHover: (event, elements) => {
            const native = event.native;
            if (native && native.target) {
                (native.target as HTMLElement).style.cursor = elements.length ? 'pointer' : 'default';
            }
        }
      },
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
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          border: "1px solid #e2e8f0",
        }}
      >
        <canvas ref={canvasRef} />
      </div>

      {state.selectedYear && (
        <div style={{ backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", border: "1px solid #e2e8f0", animation: "fadeIn 0.3s ease-in-out" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                    Détails des mouvements {state.selectedYear}
                </h3>
                <button 
                    onClick$={() => state.selectedYear = null}
                    style={{ padding: "0.25rem 0.75rem", background: "#EDF2F7", borderRadius: "4px", fontSize: "0.9rem", border: "1px solid #CBD5E0", cursor: "pointer" }}
                >
                    Fermer
                </button>
            </div>
            <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                    <thead>
                        <tr style={{ background: "#F7FAFC", textAlign: "left" }}>
                            <th style={{ padding: "0.75rem", borderBottom: "2px solid #E2E8F0" }}>Type</th>
                            <th style={{ padding: "0.75rem", borderBottom: "2px solid #E2E8F0" }}>Libellé</th>
                            <th style={{ padding: "0.75rem", borderBottom: "2px solid #E2E8F0", textAlign: "right" }}>Valeur</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.items.slice(0, 20).map((item, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #E2E8F0" }}>
                                <td style={{ padding: "0.75rem" }}>
                                    <span style={{ 
                                        display: "inline-block", 
                                        padding: "0.2rem 0.5rem", 
                                        borderRadius: "4px", 
                                        fontSize: "0.75rem", 
                                        fontWeight: "bold",
                                        backgroundColor: item.entreeSortie === "E" ? "#C6F6D5" : "#FED7D7",
                                        color: item.entreeSortie === "E" ? "#22543D" : "#9B2C2C"
                                    }}>
                                        {item.entreeSortie === "E" ? "Entrée" : "Sortie"}
                                    </span>
                                </td>
                                <td style={{ padding: "0.75rem" }}>{item.libelle}</td>
                                <td style={{ padding: "0.75rem", textAlign: "right", fontFamily: "monospace" }}>
                                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(item.valeurAcquisition)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {state.items.length > 20 && (
                    <p style={{ textAlign: "center", color: "#718096", marginTop: "1rem", fontStyle: "italic" }}>
                        ... et {state.items.length - 20} autres mouvements non affichés.
                    </p>
                )}
            </div>
        </div>
      )}
    </div>
  );
});
