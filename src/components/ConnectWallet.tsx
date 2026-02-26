"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export function ConnectWallet() {
  const { address, isConnected, connector } = useAccount();
  const { connectors, connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            padding: "8px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            fontSize: 13,
            fontFamily: "ui-monospace, monospace",
            background: "#f9f9f9",
          }}
        >
          {address.slice(0, 6)}…{address.slice(-4)}
          {connector && (
            <span style={{ marginLeft: 8, opacity: 0.55, fontFamily: "sans-serif" }}>
              via {connector.name}
            </span>
          )}
        </div>
        <button
          onClick={() => disconnect()}
          style={{
            padding: "8px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            background: "white",
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {connectors.map((c) => (
          <button
            key={c.id}
            onClick={() => connect({ connector: c })}
            disabled={isPending}
            style={{
              padding: "9px 16px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "#111",
              color: "white",
              fontWeight: 600,
              fontSize: 13,
              cursor: isPending ? "not-allowed" : "pointer",
              opacity: isPending ? 0.6 : 1,
            }}
          >
            {isPending ? "Connecting…" : `Connect ${c.name}`}
          </button>
        ))}
      </div>
      {error && (
        <div style={{ fontSize: 12, color: "crimson" }}>{error.message}</div>
      )}
    </div>
  );
}
