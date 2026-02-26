"use client";

import { useState } from "react";
import { useHexPrices } from "@/hooks/useHexPrices";
import { useHexSummary, HexStakeRow } from "@/hooks/useHexSummary";
import { GoodAccountingPanel } from "./GoodAccountingPanel";
import { useEnsureChain } from "@/hooks/useEnsureChain";

export function Dashboard({ address }: { address: `0x${string}` }) {
  const prices = useHexPrices();
  const [selected, setSelected] = useState<HexStakeRow | undefined>(undefined);

  const { ensureChain } = useEnsureChain();

  const eth = useHexSummary(address, 1);
  const pls = useHexSummary(address, 369);

  const ethPrice = prices?.ethereum?.priceUsd ?? 0;
  const plsPrice = prices?.pulsechain?.priceUsd ?? 0;

  const ethHexUsd = eth.hexAmount * ethPrice;
  const plsHexUsd = pls.hexAmount * plsPrice;

  const onPickStake = async (r: HexStakeRow) => {
    setSelected(r);
    await ensureChain(r.chainId);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {/* Balances */}
      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
        <h3 style={{ margin: 0 }}>Balances</h3>
        <div style={{ marginTop: 10, fontSize: 13, opacity: 0.85 }}>
          DexScreener (highest liquidity). Updated:{" "}
          {prices?.updatedAt ? new Date(prices.updatedAt).toLocaleTimeString() : "—"}
        </div>

        <div style={{ marginTop: 12, display: "grid", gap: 14 }}>
          <div style={{ padding: 12, background: "#f9f9f9", borderRadius: 10 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Ethereum</div>
            <div>HEX: {eth.hexAmount.toLocaleString()} {ethPrice > 0 && <span style={{ opacity: 0.7 }}>(~${ethHexUsd.toFixed(2)})</span>}</div>
            <div>
              Native: {eth.native.data?.formatted ?? "—"} {eth.native.data?.symbol ?? "ETH"}
            </div>
            {ethPrice > 0 && (
              <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                HEX @ ${ethPrice.toFixed(6)} via {prices?.ethereum?.dex}
              </div>
            )}
          </div>

          <div style={{ padding: 12, background: "#f9f9f9", borderRadius: 10 }}>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>PulseChain</div>
            <div>HEX: {pls.hexAmount.toLocaleString()} {plsPrice > 0 && <span style={{ opacity: 0.7 }}>(~${plsHexUsd.toFixed(2)})</span>}</div>
            <div>
              Native: {pls.native.data?.formatted ?? "—"} {pls.native.data?.symbol ?? "PLS"}
            </div>
            {plsPrice > 0 && (
              <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                HEX @ ${plsPrice.toFixed(6)} via {prices?.pulsechain?.dex}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Good Accounting */}
      <GoodAccountingPanel selected={selected} />

      {/* Stakes */}
      <div style={{ gridColumn: "1 / -1", border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
        <h3 style={{ margin: 0 }}>Stakes</h3>
        <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>
          Click &quot;Use for GA&quot; on any active stake to prefill the Good Accounting panel above.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12 }}>
          <StakeTable title="Ethereum" rows={eth.stakes} onPick={onPickStake} isLoading={eth.isLoading} />
          <StakeTable title="PulseChain" rows={pls.stakes} onPick={onPickStake} isLoading={pls.isLoading} />
        </div>
      </div>
    </div>
  );
}

function StakeTable({
  title,
  rows,
  onPick,
  isLoading,
}: {
  title: string;
  rows: HexStakeRow[];
  onPick: (r: HexStakeRow) => void;
  isLoading: boolean;
}) {
  const [showEnded, setShowEnded] = useState(false);

  const actionable = rows.filter((r) => r.unlockedDay === 0);
  const ended = rows.filter((r) => r.unlockedDay > 0);

  const sortedActionable = [...actionable].sort((a, b) => {
    const rank = (s: HexStakeRow) => (s.status === "MATURE" ? 0 : 1);
    const ra = rank(a);
    const rb = rank(b);
    if (ra !== rb) return ra - rb;
    if (a.maturityDay !== b.maturityDay) return a.maturityDay - b.maturityDay;
    if (a.stakeShares !== b.stakeShares) return a.stakeShares > b.stakeShares ? -1 : 1;
    return a.stakeIndex - b.stakeIndex;
  });

  const visibleRows = showEnded ? [...sortedActionable, ...ended] : sortedActionable;

  return (
    <div style={{ border: "1px solid #f0f0f0", borderRadius: 12, padding: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <b>{title}</b>
        <label style={{ fontSize: 12, opacity: 0.85, display: "flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
          <input type="checkbox" checked={showEnded} onChange={(e) => setShowEnded(e.target.checked)} />
          Show ended ({ended.length})
        </label>
      </div>

      {isLoading ? (
        <div style={{ marginTop: 10, fontSize: 13, opacity: 0.7 }}>Loading stakes…</div>
      ) : visibleRows.length === 0 ? (
        <div style={{ marginTop: 10, fontSize: 13, opacity: 0.85 }}>No stakes found.</div>
      ) : (
        <>
          <div style={{ marginTop: 6, fontSize: 12, opacity: 0.7 }}>
            {visibleRows.length} / {rows.length} · MATURE first
          </div>
          <table style={{ width: "100%", marginTop: 8, fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th>Idx</th>
                <th>Status</th>
                <th>Maturity Day</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((r) => {
                const isEnded = r.unlockedDay > 0;
                const canGA = !isEnded;

                return (
                  <tr
                    key={`${r.chainId}:${r.stakeIndex}:${r.stakeId.toString()}`}
                    style={isEnded ? { opacity: 0.45 } : undefined}
                  >
                    <td>{r.stakeIndex}</td>
                    <td>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 600,
                          background:
                            r.status === "MATURE" ? "#fff3cd" :
                            r.status === "ACTIVE" ? "#d1fae5" : "#f3f4f6",
                          color:
                            r.status === "MATURE" ? "#92400e" :
                            r.status === "ACTIVE" ? "#065f46" : "#6b7280",
                        }}
                      >
                        {r.status}{isEnded ? " (ENDED)" : ""}
                      </span>
                    </td>
                    <td>{r.maturityDay}</td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        onClick={() => onPick(r)}
                        disabled={!canGA}
                        title={canGA ? "Prefill Good Accounting" : "Ended stake — GA not applicable"}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 8,
                          border: "1px solid #ddd",
                          cursor: canGA ? "pointer" : "not-allowed",
                          opacity: canGA ? 1 : 0.4,
                          fontSize: 12,
                        }}
                      >
                        Use for GA
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
