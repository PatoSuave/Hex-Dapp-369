"use client";

import { useEffect, useState } from "react";

export type DexPrice = null | {
  priceUsd: number;
  liquidityUsd: number;
  dexId?: string;
  pairAddress?: string;
};

export function useDexPrices(chain: "ethereum" | "pulsechain", tokenAddresses: string[]) {
  const [prices, setPrices] = useState<Record<string, DexPrice>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const addrs = Array.from(new Set(tokenAddresses.map((a) => a.toLowerCase()))).filter(Boolean);
    if (addrs.length === 0) return;

    let alive = true;
    setLoading(true);

    (async () => {
      try {
        const res = await fetch("/api/prices/dexscreener", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chain, tokenAddresses: addrs }),
        });
        const json = await res.json();
        if (!alive) return;
        setPrices(json?.prices || {});
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [chain, tokenAddresses.join("|")]);

  return { prices, loading };
}
