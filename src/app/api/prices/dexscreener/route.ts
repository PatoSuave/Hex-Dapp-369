import { NextResponse } from "next/server";

type Body = {
  chain: "ethereum" | "pulsechain";
  tokenAddresses: string[];
};

type DexPair = {
  chainId: string;
  dexId?: string;
  pairAddress?: string;
  priceUsd?: string;
  liquidity?: { usd?: number };
  baseToken?: { address: string };
};

const TTL_MS = 30_000;
const CACHE = new Map<string, { ts: number; data: any }>();

function pickHighestLiquidity(pairs: DexPair[], chain: "ethereum" | "pulsechain", token: string) {
  const t = token.toLowerCase();
  const filtered = pairs
    .filter((p) => (p.chainId || "").toLowerCase() === chain)
    .filter((p) => (p.baseToken?.address || "").toLowerCase() === t)
    .filter((p) => p.priceUsd && Number(p.priceUsd) > 0)
    .map((p) => ({
      priceUsd: Number(p.priceUsd),
      liquidityUsd: p.liquidity?.usd ?? 0,
      dexId: p.dexId,
      pairAddress: p.pairAddress,
    }));

  filtered.sort((a, b) => b.liquidityUsd - a.liquidityUsd);
  return filtered[0] || null;
}

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  const chain = body.chain;

  const addrs = Array.from(new Set(body.tokenAddresses.map((x) => x.toLowerCase()))).slice(0, 50);

  const out: Record<string, any> = {};

  await Promise.all(
    addrs.map(async (addr) => {
      const key = `${chain}:${addr}`;
      const cached = CACHE.get(key);
      if (cached && Date.now() - cached.ts < TTL_MS) {
        out[addr] = cached.data;
        return;
      }

      const url = `https://api.dexscreener.com/latest/dex/tokens/${addr}`;
      const res = await fetch(url, { next: { revalidate: 10 } });
      if (!res.ok) {
        out[addr] = null;
        return;
      }
      const json = await res.json();
      const pairs: DexPair[] = Array.isArray(json?.pairs) ? json.pairs : [];
      const best = pickHighestLiquidity(pairs, chain, addr);

      CACHE.set(key, { ts: Date.now(), data: best });
      out[addr] = best;
    })
  );

  return NextResponse.json({ chain, updatedAt: new Date().toISOString(), prices: out });
}
