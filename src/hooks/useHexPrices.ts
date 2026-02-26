"use client";
import { useEffect, useState } from "react";

export function useHexPrices() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const res = await fetch("/api/prices/hex");
      const json = await res.json();
      if (alive) setData(json);
    };
    load();
    const t = setInterval(load, 30_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  return data as null | {
    updatedAt: string;
    ethereum: null | { priceUsd: number; liquidityUsd: number; dex?: string };
    pulsechain: null | { priceUsd: number; liquidityUsd: number; dex?: string };
  };
}
