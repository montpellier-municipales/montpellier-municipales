import { component$, useVisibleTask$, useSignal } from "@builder.io/qwik";
import {
  Chart,
  LineController,
  BarController,
  LineElement,
  BarElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import loanDataRaw from "~/content/data/ville_loans.json";
import debtSummaryRaw from "~/content/data/ville_debt_summary.json";
import type { LoanLine } from "~/types/ville";

export const VilleDebtEvolutionChart = component$(() => {
  const canvasRef = useSignal<HTMLCanvasElement>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    Chart.register(
      LineController,
      BarController,
      LineElement,
      BarElement,
      PointElement,
      LinearScale,
      CategoryScale,
      Title,
      Tooltip,
      Legend
    );

    if (!canvasRef.value) return;

    const data: Record<string, LoanLine[]> = loanDataRaw as any;
    const debtSummary: Record<string, { newDebtBudgeted: number, totalRealExpenses: number }> = debtSummaryRaw as any;
    const years = Object.keys(data).sort();

    const outstandingRealized = years.map(year => 
        (data[year] || []).reduce((sum, l) => sum + l.capitalRemainingEnd, 0)
    );

    const newDebtBudgeted = years.map(year => debtSummary[year]?.newDebtBudgeted || 0);

    const annuityData = years.map(year => 
        (data[year] || []).reduce((sum, l) => sum + l.capitalRepaid + l.interestPaid, 0)
    );

    const ratiosStock = years.map((year, i) => {
        const totalDebt = outstandingRealized[i] + newDebtBudgeted[i];
        const totalBudget = debtSummary[year]?.totalRealExpenses || 0;
        return totalBudget > 0 ? (totalDebt / totalBudget) * 100 : 0;
    });

    const ratiosAnnuity = years.map((year, i) => {
        const annuity = annuityData[i];
        const totalBudget = debtSummary[year]?.totalRealExpenses || 0;
        return totalBudget > 0 ? (annuity / totalBudget) * 100 : 0;
    });

    const ctx = canvasRef.value.getContext("2d");
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: years,
        datasets: [
          {
            type: 'bar',
            label: "Encours (Contrats existants)",
            data: outstandingRealized,
            backgroundColor: "#2b6cb0",
            stack: 'stock',
            order: 3,
            yAxisID: 'y',
          },
          {
            type: 'bar',
            label: "Emprunt Nouveau (Budgeté)",
            data: newDebtBudgeted,
            backgroundColor: "#90cdf4",
            stack: 'stock',
            order: 3,
            yAxisID: 'y',
          },
          {
            type: 'line',
            label: "Annuité (Remboursement)",
            data: annuityData,
            borderColor: "#e53e3e",
            backgroundColor: "#e53e3e",
            yAxisID: 'y1',
            borderDash: [5, 5],
            tension: 0.3,
            order: 2,
          },
          {
            type: 'line',
            label: "% Dette / Budget",
            data: ratiosStock,
            borderColor: "#4a5568",
            backgroundColor: "transparent",
            yAxisID: 'yRatio',
            order: 1,
            pointRadius: 4,
            borderWidth: 2,
          },
          {
            type: 'line',
            label: "% Annuité / Budget",
            data: ratiosAnnuity,
            borderColor: "#718096",
            backgroundColor: "transparent",
            yAxisID: 'yRatio',
            order: 1,
            pointRadius: 4,
            borderWidth: 2,
            borderDash: [2, 2],
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            title: { display: true, text: "Dette de la Ville : Encours, Annuité et Ratios", font: { size: 16 } },
            legend: { position: 'bottom' },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const val = context.parsed.y || 0;
                        if (context.dataset.yAxisID === 'yRatio') {
                            return `${context.dataset.label}: ${val.toFixed(1)}%`;
                        }
                        return context.dataset.label + ": " + 
                        new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(val);
                    }
                }
            }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                beginAtZero: true,
                title: { display: true, text: "Encours (€)" },
                ticks: { callback: (val) => new Intl.NumberFormat("fr-FR", { notation: "compact" }).format(Number(val)) + " €" },
                stacked: true
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                beginAtZero: true,
                grid: { drawOnChartArea: false },
                title: { display: true, text: "Annuité (€)" },
                ticks: { callback: (val) => new Intl.NumberFormat("fr-FR", { notation: "compact" }).format(Number(val)) + " €" }
            },
            yRatio: {
                type: 'linear',
                display: true,
                position: 'right',
                beginAtZero: true,
                grid: { drawOnChartArea: false },
                title: { display: true, text: "Ratio (%)" },
                ticks: { callback: (val) => val + "%" },
                suggestedMax: 100
            },
            x: {
                stacked: true
            }
        }
      },
    });

    cleanup(() => chart.destroy());
  });

  return (
    <div
      style={{
        height: "500px", // Increased height for better clarity
        width: "100%",
        marginBottom: "2rem",
        backgroundColor: "white",
        padding: "1rem",
        borderRadius: "0.5rem",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        border: "1px solid #e2e8f0",
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
});
