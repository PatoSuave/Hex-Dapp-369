"use client";

import { useMemo, useState } from "react";
import { useEthereumTop200 } from "@/hooks/useEthereumTop200";
import { useDexPrices } from "@/hooks/useDexPrices";
import { useTrackedTokens } from "@/hooks/useTrackedTokens";

export function EthereumTop200Table() {
  const { data, error } = useEthereumTop200();
  const { toggle, isTracked } = useTrackedTokens();

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 50;

  const filtered = useMemo(() => {
    const tokens = data?.tokens ?? [];
    const query = q.trim().toLowerCase();
    if (!query) return tokens;
    return tokens.filter((t) => t.symbol.toLowerCase().includes(query) || t.name.toLowerCase().includes(query));
  }, [data?.tokens, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const clampedPage = Math.min(page, totalPages);

  const visible = useMemo(() => {
    const start = (clampedPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, clampedPage]);

  const { prices, loading } = useDexPrices(
    "ethereum",
    visible.map((t) => t.address)
  );

  if (error) {
    return (
      <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
        Error: {error}
      </div>
    );
  }
  if (!data) {
    return (
      <div style={{ padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
        Loading Ethereum top 200…
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h3 style={{ margin: 0 }}>Ethereum Top 200 (+ HEX)</h3>
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          updated: {new Date(data.updatedAt).toLocaleString()} · pricing: {loading ? "loading…" : "ready"}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Search symbol or name…"
          style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        />
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button
            disabled={clampedPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd" }}
          >
            Prev
          </button>
          <div style={{ fontSize: 13 }}>
            {clampedPage} / {totalPages}
          </div>
          <button
            disabled={clampedPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #ddd" }}
          >
            Next
          </button>
        </div>
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
          {visible.map((t) => {
            const p = prices[t.address.toLowerCase()];
            return (
              <tr key={t.address}>
                <td>
                  {t.logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.logo} alt={t.symbol} width={18} height={18} style={{ borderRadius: "50%", marginRight: 6, verticalAlign: "middle" }} />
                  )}
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
                    onClick={() => toggle({ chain: "ethereum", address: t.address, symbol: t.symbol, name: t.name })}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 10,
                      border: "1px solid #ddd",
                      cursor: "pointer",
                      background: isTracked("ethereum", t.address) ? "#111" : "white",
                      color: isTracked("ethereum", t.address) ? "white" : "#111",
                    }}
                  >
                    {isTracked("ethereum", t.address) ? "Untrack" : "Track"}
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
