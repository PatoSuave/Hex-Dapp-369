"use client";

import { useAccount } from "wagmi";
import { ConnectWallet } from "@/components/ConnectWallet";
import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { PortfolioDashboard } from "@/components/PortfolioDashboard";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [tab, setTab] = useState<"dashboard" | "portfolio">("dashboard");

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px" }}>
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
          paddingBottom: 16,
          borderBottom: "1px solid #eee",
        }}
      >
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700 }}>⬡ HEX Dashboard</h1>
          <div style={{ fontSize: 13, opacity: 0.6, marginTop: 2 }}>
            Ethereum &amp; PulseChain
          </div>
        </div>
        <ConnectWallet />
      </header>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <TabButton active={tab === "dashboard"} onClick={() => setTab("dashboard")}>
          🏠 Dashboard
        </TabButton>
        <TabButton active={tab === "portfolio"} onClick={() => setTab("portfolio")}>
          📊 Portfolio
        </TabButton>
      </div>

      {/* Content */}
      {tab === "dashboard" && (
        <>
          {isConnected && address ? (
            <Dashboard address={address as `0x${string}`} />
          ) : (
            <div
              style={{
                padding: 48,
                textAlign: "center",
                border: "1px dashed #ddd",
                borderRadius: 16,
                color: "#888",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>👛</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                Connect your wallet
              </div>
              <div style={{ fontSize: 14 }}>
                Connect MetaMask or Rabby Wallet to view your HEX balances and stakes.
              </div>
            </div>
          )}
        </>
      )}

      {tab === "portfolio" && <PortfolioDashboard />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "9px 18px",
        borderRadius: 12,
        border: "1px solid #ddd",
        background: active ? "#111" : "white",
        color: active ? "white" : "#111",
        fontWeight: active ? 600 : 400,
        fontSize: 14,
        transition: "all 0.15s",
      }}
    >
      {children}
    </button>
  );
}
