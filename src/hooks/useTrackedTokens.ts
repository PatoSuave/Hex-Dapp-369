"use client";

import { useEffect, useMemo, useState } from "react";
import type { TokenDef, ChainKey } from "@/lib/tokenRegistry";

type Tracked = { chain: ChainKey; address: string; symbol: string; name: string };

const KEY = "trackedTokens:v1";

export function useTrackedTokens() {
  const [items, setItems] = useState<Tracked[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  const save = (next: Tracked[]) => {
    setItems(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const isTracked = useMemo(() => {
    const set = new Set(items.map((i) => `${i.chain}:${i.address.toLowerCase()}`));
    return (chain: ChainKey, address: string) => set.has(`${chain}:${address.toLowerCase()}`);
  }, [items]);

  const toggle = (t: TokenDef) => {
    const k = `${t.chain}:${t.address.toLowerCase()}`;
    const exists = items.some((i) => `${i.chain}:${i.address.toLowerCase()}` === k);
    if (exists) save(items.filter((i) => `${i.chain}:${i.address.toLowerCase()}` !== k));
    else save([{ chain: t.chain, address: t.address, symbol: t.symbol, name: t.name }, ...items]);
  };

  return { tracked: items, isTracked, toggle };
}
