"use client";

import { useState } from "react";
import { EthereumTop200Table } from "./EthereumTop200Table";
import { PulseCuratedTable } from "./PulseCuratedTable";

export function PortfolioDashboard() {
  const [tab, setTab] = useState<"ethereum" | "pulsechain">("ethereum");

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => setTab("ethereum")}
          style={{
            padding: "8px 16px",
            borderRadius: 12,
            border: "1px solid #ddd",
            background: tab === "ethereum" ? "#111" : "white",
            color: tab === "ethereum" ? "white" : "#111",
            fontWeight: tab === "ethereum" ? 600 : 400,
            cursor: "pointer",
          }}
        >
          Ethereum
        </button>
        <button
          onClick={() => setTab("pulsechain")}
          style={{
            padding: "8px 16px",
            borderRadius: 12,
            border: "1px solid #ddd",
            background: tab === "pulsechain" ? "#111" : "white",
            color: tab === "pulsechain" ? "white" : "#111",
            fontWeight: tab === "pulsechain" ? 600 : 400,
            cursor: "pointer",
          }}
        >
          PulseChain
        </button>
      </div>

      {tab === "ethereum" ? <EthereumTop200Table /> : <PulseCuratedTable />}
    </div>
  );
}
