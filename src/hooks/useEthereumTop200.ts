"use client";

import { useEffect, useState } from "react";

export type EthToken = {
  chain: "ethereum";
  id: string;
  address: `0x${string}`;
  symbol: string;
  name: string;
  logo?: string;
  source: "coingecko" | "manual";
};

export function useEthereumTop200() {
  const [data, setData] = useState<null | { updatedAt: string; tokens: EthToken[] }>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/tokens/ethereum-top200");
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error || "Failed to load top 200");
        if (alive) setData(json);
      } catch (e: any) {
        if (alive) setError(e?.message || "Error");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { data, error };
}
