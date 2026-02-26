"use client";

import { PULSE_CURATED } from "@/lib/tokenRegistry";
import { useDexPrices } from "@/hooks/useDexPrices";
import { useTrackedTokens } from "@/hooks/useTrackedTokens";

export function PulseCuratedTable() {
  const { toggle, isTracked } = useTrackedTokens();
  const { prices, loading } = useDexPrices("pulsechain", PULSE_CURATED.map((t) => t.address));

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h3 style={{ margin: 0 }}>PulseChain Curated</h3>
        <div style={{ fontSize: 12, opacity: 0.8 }}>pricing: {loading ? "loading…" : "ready"}</div>
      </div>

      <table style={{ width: "100%", marginTop: 12, fontSize: 13 }}>
        <thead>
          <tr style={{ textAlign: "left" }}>
            <th>Token</th>
            <th>Address</th>
            <th style={{ textAlign: "right" }}>USD</th>
            <th style={{ textAlign: "right" }}>Liquidity</th>
            <th style={{ textAlign: "right" }}>Track</th>
          </tr>
        </thead>
        <tbody>
          {PULSE_CURATED.map((t) => {
            const p = prices[t.address.toLowerCase()];
            return (
              <tr key={t.address}>
                <td>
                  <b>{t.symbol}</b> <span style={{ opacity: 0.8 }}>— {t.name}</span>
                </td>
                <td style={{ fontFamily: "ui-monospace", fontSize: 12, opacity: 0.85 }}>
                  {t.address.slice(0, 6)}…{t.address.slice(-4)}
                </td>
                <td style={{ textAlign: "right" }}>{p?.priceUsd ? `$${p.priceUsd.toFixed(6)}` : "—"}</td>
                <td style={{ textAlign: "right" }}>
                  {p?.liquidityUsd ? `$${Math.round(p.liquidityUsd).toLocaleString()}` : "—"}
                </td>
                <td style={{ textAlign: "right" }}>
                  <button
                    onClick={() => toggle(t)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 10,
                      border: "1px solid #ddd",
                      cursor: "pointer",
                      background: isTracked("pulsechain", t.address) ? "#111" : "white",
                      color: isTracked("pulsechain", t.address) ? "white" : "#111",
                    }}
                  >
                    {isTracked("pulsechain", t.address) ? "Untrack" : "Track"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
