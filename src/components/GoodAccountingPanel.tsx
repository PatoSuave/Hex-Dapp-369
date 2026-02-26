"use client";

import { useEffect, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { HEX_ADDRESS, hexAbi } from "@/lib/hexAbi";
import { useEnsureChain } from "@/hooks/useEnsureChain";
import type { HexStakeRow } from "@/hooks/useHexSummary";

export function GoodAccountingPanel({ selected }: { selected?: HexStakeRow }) {
  const { address } = useAccount();
  const { ensureChain, isSwitching } = useEnsureChain();

  const [chainId, setChainId] = useState<1 | 369>(selected?.chainId ?? 1);
  const [stakerAddr, setStakerAddr] = useState<string>(address || "");
  const [stakeIndex, setStakeIndex] = useState<string>(selected ? String(selected.stakeIndex) : "0");
  const [stakeId, setStakeId] = useState<string>(selected ? selected.stakeId.toString() : "0");

  useEffect(() => {
    if (!selected) return;
    setChainId(selected.chainId);
    if (address) setStakerAddr(address);
    setStakeIndex(String(selected.stakeIndex));
    setStakeId(selected.stakeId.toString());
  }, [selected, address]);

  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  return (
    <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 16 }}>
      <h3 style={{ margin: 0 }}>Good Accounting</h3>
      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.85 }}>
        Function: <code>stakeGoodAccounting(stakerAddr, stakeIndex, stakeIdParam)</code>
      </div>

      <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
        <label style={{ display: "grid", gap: 4 }}>
          Chain
          <select
            value={chainId}
            disabled={!!selected}
            onChange={(e) => setChainId(Number(e.target.value) as 1 | 369)}
            style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
          >
            <option value={1}>Ethereum</option>
            <option value={369}>PulseChain</option>
          </select>
        </label>

        <label style={{ display: "grid", gap: 4 }}>
          Staker Address
          <input
            value={stakerAddr}
            onChange={(e) => setStakerAddr(e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
          />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <label style={{ display: "grid", gap: 4 }}>
            Stake Index
            <input
              value={stakeIndex}
              onChange={(e) => setStakeIndex(e.target.value)}
              style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
            />
          </label>
          <label style={{ display: "grid", gap: 4 }}>
            Stake ID (uint40)
            <input
              value={stakeId}
              onChange={(e) => setStakeId(e.target.value)}
              style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ddd" }}
            />
          </label>
        </div>

        <button
          disabled={isPending || isSwitching}
          onClick={async () => {
            await ensureChain(chainId);
            writeContract({
              chainId,
              address: HEX_ADDRESS,
              abi: hexAbi,
              functionName: "stakeGoodAccounting",
              args: [stakerAddr as `0x${string}`, BigInt(stakeIndex), BigInt(stakeId)],
            });
          }}
          style={{
            padding: 10,
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: isPending || isSwitching ? "not-allowed" : "pointer",
            background: isPending || isSwitching ? "#f5f5f5" : "#111",
            color: isPending || isSwitching ? "#666" : "white",
            fontWeight: 600,
          }}
        >
          {isSwitching ? "Switching network…" : isPending ? "Submitting…" : "Run Good Accounting"}
        </button>

        {isSuccess && (
          <div style={{ color: "green", fontSize: 12 }}>✓ Transaction submitted!</div>
        )}
        {error ? <div style={{ color: "crimson", fontSize: 12 }}>{error.message}</div> : null}
      </div>
    </div>
  );
}
