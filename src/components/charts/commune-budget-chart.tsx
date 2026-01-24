import { component$, useStore, useComputed$ } from "@builder.io/qwik";
import type { ApcpData } from "~/types/apcp";
import { vars } from "~/theme.css";
import communesData from "~/content/data/communes.json";

interface CommuneBudgetChartProps {
  data: ApcpData;
}

// Convertir les données de communes en Map pour un accès rapide
const POPULATION_MAP = new Map(communesData.map((c) => [c.name, c.population]));

export const CommuneBudgetChart = component$<CommuneBudgetChartProps>(
  ({ data }) => {
    const state = useStore({
      viewMode: "total" as "total" | "perCapita",
    });

    const chartData = useComputed$(() => {
      const totals: Record<string, number> = {};
      const OTHER_LABEL = "Métropole / Non affecté";

      const LINE_5_WEIGHTS = {
        "Saint-Jean-de-Védas": 2 / 26,
        Montpellier: 22 / 26,
        "Montferrier-sur-Lez": 1 / 26,
        Clapiers: 1 / 26,
      };

      // Configuration des répartitions pondérées
      const WEIGHTED_DISTRIBUTIONS: Record<string, Record<string, number>> = {
        M21TRAML5: LINE_5_WEIGHTS,
        M21OUES01: LINE_5_WEIGHTS,
        M21OUES02: LINE_5_WEIGHTS,
        M21ROUL2: LINE_5_WEIGHTS,
        M22METRO01: {
          Montpellier: 85 / 113,
          "Castelnau-le-Lez": 4 / 113,
          Castries: 4 / 113,
          Vendargues: 2 / 113,
          "Le Crès": 2 / 113,
          Grabels: 6 / 113,
          Cournonsec: 2 / 113,
          Cournonterral: 2 / 113,
          Pignan: 2 / 113,
          Fabrègues: 2 / 113,
          Lavérune: 1 / 113,
          "Saint-Jean-de-Védas": 1 / 113,
        },
      };

      data.apcps.forEach((apcp) => {
        const amount = apcp.cp_realise;

        if (WEIGHTED_DISTRIBUTIONS[apcp.id]) {
          const weights = WEIGHTED_DISTRIBUTIONS[apcp.id];
          Object.entries(weights).forEach(([commune, weight]) => {
            totals[commune] = (totals[commune] || 0) + amount * weight;
          });
        } else if (!apcp.communes || apcp.communes.length === 0) {
          totals[OTHER_LABEL] = (totals[OTHER_LABEL] || 0) + amount;
        } else {
          const splitAmount = amount / apcp.communes.length;
          apcp.communes.forEach((commune) => {
            totals[commune] = (totals[commune] || 0) + splitAmount;
          });
        }
      });

      let result = Object.entries(totals).map(([name, value]) => ({
        name,
        value,
      }));

      if (state.viewMode === "perCapita") {
        result = result
          .filter((item) => item.name !== OTHER_LABEL) // On exclut "Non affecté" car pas de population
          .map((item) => {
            const pop = POPULATION_MAP.get(item.name) || 1; // Avoid division by zero
            return { name: item.name, value: item.value / pop };
          });
      }

      return result.sort((a, b) => b.value - a.value);
    });

    const maxVal = useComputed$(() =>
      Math.max(...chartData.value.map((d) => d.value))
    );

    const formatCurrency = (val: number) =>
      new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: state.viewMode === "perCapita" ? 2 : 0,
        notation: state.viewMode === "total" ? "compact" : "standard",
      }).format(val);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: vars.color.title,
              margin: 0,
            }}
          >
            Répartition de l'investissement par commune
          </h3>

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              backgroundColor: vars.color.background,
              padding: "0.25rem",
              borderRadius: "6px",
              border: `1px solid ${vars.color.border}`,
            }}
          >
            <button
              onClick$={() => (state.viewMode = "total")}
              style={{
                padding: "0.25rem 0.75rem",
                borderRadius: "4px",
                border: "none",
                backgroundColor:
                  state.viewMode === "total"
                    ? vars.color.surface
                    : "transparent",
                boxShadow: state.viewMode === "total" ? vars.shadow.sm : "none",
                color:
                  state.viewMode === "total"
                    ? vars.color.primary
                    : vars.color.textMuted,
                fontWeight: state.viewMode === "total" ? "600" : "normal",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              Total
            </button>
            <button
              onClick$={() => (state.viewMode = "perCapita")}
              style={{
                padding: "0.25rem 0.75rem",
                borderRadius: "4px",
                border: "none",
                backgroundColor:
                  state.viewMode === "perCapita"
                    ? vars.color.surface
                    : "transparent",
                boxShadow:
                  state.viewMode === "perCapita" ? vars.shadow.sm : "none",
                color:
                  state.viewMode === "perCapita"
                    ? vars.color.primary
                    : vars.color.textMuted,
                fontWeight: state.viewMode === "perCapita" ? "600" : "normal",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              Par habitant
            </button>
          </div>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {chartData.value.map((item) => (
            <div
              key={item.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                fontSize: "0.9rem",
              }}
            >
              <div
                style={{
                  width: "120px",
                  textAlign: "right",
                  color: vars.color.text,
                  fontWeight: "500",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={item.name}
              >
                {item.name}
              </div>

              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    height: "24px",
                    backgroundColor:
                      item.name === "Montpellier"
                        ? vars.color.primary
                        : vars.color.secondary,
                    width: `${(item.value / maxVal.value) * 100}%`,
                    borderRadius: "4px",
                    transition: "width 0.5s ease-out",
                    minWidth: "2px",
                  }}
                />
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: vars.color.textMuted,
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatCurrency(item.value)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            fontSize: "0.8rem",
            color: vars.color.textMuted,
            marginTop: "1rem",
            fontStyle: "italic",
          }}
        >
          * Pour les programmes concernant plusieurs communes, le montant est
          divisé équitablement, sauf pour le Tramway Ligne 5 et le Bustram
          (répartition selon le nombre d'arrêts par commune).
          {state.viewMode === "perCapita" &&
            " Les montants 'Non affecté' sont exclus de la vue par habitant."}
        </p>
      </div>
    );
  }
);
