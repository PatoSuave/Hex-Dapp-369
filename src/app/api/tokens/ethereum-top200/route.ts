import { NextResponse } from "next/server";
import { HEX_ADDRESS } from "@/lib/tokenRegistry";

type CoinMarketsRow = { id: string; symbol: string; name: string; image?: string };
type CoinListRow = { id: string; platforms?: Record<string, string> };

let CACHE: { ts: number; data: any } | null = null;
const TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const CG_BASE = "https://api.coingecko.com/api/v3";

function cgHeaders() {
  const key = process.env.COINGECKO_API_KEY;
  return key ? { "x-cg-demo-api-key": key } : {};
}

export async function GET() {
  if (CACHE && Date.now() - CACHE.ts < TTL_MS) return NextResponse.json(CACHE.data);

  const marketsUrl =
    `${CG_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=200&page=1&sparkline=false`;
  const marketsRes = await fetch(marketsUrl, { headers: cgHeaders(), next: { revalidate: 3600 } });
  if (!marketsRes.ok) {
    return NextResponse.json({ error: "CoinGecko /coins/markets failed" }, { status: 502 });
  }
  const markets: CoinMarketsRow[] = await marketsRes.json();

  const listUrl = `${CG_BASE}/coins/list?include_platform=true`;
  const listRes = await fetch(listUrl, { headers: cgHeaders(), next: { revalidate: 86400 } });
  if (!listRes.ok) {
    return NextResponse.json({ error: "CoinGecko /coins/list failed" }, { status: 502 });
  }
  const list: CoinListRow[] = await listRes.json();

  const byId = new Map(list.map((c) => [c.id, c]));

  const tokens = markets
    .map((m) => {
      const row = byId.get(m.id);
      const addr = row?.platforms?.ethereum;
      if (!addr) return null;
      return {
        chain: "ethereum" as const,
        id: m.id,
        address: addr as `0x${string}`,
        symbol: (m.symbol || "").toUpperCase(),
        name: m.name,
        logo: m.image,
        source: "coingecko" as const,
      };
    })
    .filter(Boolean) as any[];

  // Force include HEX
  const hasHex = tokens.some((t) => (t.address as string).toLowerCase() === HEX_ADDRESS.toLowerCase());
  if (!hasHex) {
    tokens.unshift({
      chain: "ethereum" as const,
      id: "hex",
      address: HEX_ADDRESS,
      symbol: "HEX",
      name: "HEX",
      logo: undefined,
      source: "manual" as const,
    });
  }

  const data = { updatedAt: new Date().toISOString(), tokens };
  CACHE = { ts: Date.now(), data };
  return NextResponse.json(data);
}
