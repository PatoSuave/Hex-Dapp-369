import { NextResponse } from "next/server";

const HEX = "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39".toLowerCase();

let CACHE: { ts: number; data: any } | null = null;
const TTL_MS = 30_000;

type DexPair = {
  chainId: string;
  dexId?: string;
  priceUsd?: string;
  liquidity?: { usd?: number };
  baseToken?: { address: string; symbol?: string };
  quoteToken?: { address: string; symbol?: string };
};

function bestByLiquidity(pairs: DexPair[], chainKey: "ethereum" | "pulsechain") {
  const filtered = pairs
    .filter((p) => (p.chainId || "").toLowerCase() === chainKey)
    .filter((p) => (p.baseToken?.address || "").toLowerCase() === HEX)
    .filter((p) => p.priceUsd && Number(p.priceUsd) > 0)
    .map((p) => ({
      ...p,
      liquidityUsd: p.liquidity?.usd ?? 0,
      priceUsdNum: Number(p.priceUsd),
    }));

  filtered.sort((a, b) => b.liquidityUsd - a.liquidityUsd);
  return filtered[0] || null;
}

export async function GET() {
  if (CACHE && Date.now() - CACHE.ts < TTL_MS) {
    return NextResponse.json(CACHE.data, { headers: { "Cache-Control": "public, max-age=20" } });
  }

  const url = `https://api.dexscreener.com/latest/dex/tokens/${HEX}`;
  const res = await fetch(url, { next: { revalidate: 20 } });
  if (!res.ok) {
    return NextResponse.json({ error: "DexScreener fetch failed" }, { status: 502 });
  }

  const json = await res.json();
  const pairs: DexPair[] = Array.isArray(json?.pairs) ? json.pairs : [];

  const ethBest = bestByLiquidity(pairs, "ethereum");
  const plsBest = bestByLiquidity(pairs, "pulsechain");

  const data = {
    token: HEX,
    updatedAt: new Date().toISOString(),
    ethereum: ethBest
      ? { priceUsd: Number(ethBest.priceUsd), liquidityUsd: ethBest.liquidityUsd, dex: ethBest.dexId }
      : null,
    pulsechain: plsBest
      ? { priceUsd: Number(plsBest.priceUsd), liquidityUsd: plsBest.liquidityUsd, dex: plsBest.dexId }
      : null,
  };

  CACHE = { ts: Date.now(), data };
  return NextResponse.json(data, { headers: { "Cache-Control": "public, max-age=20" } });
}
