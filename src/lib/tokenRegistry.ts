export type ChainKey = "ethereum" | "pulsechain";

export type TokenDef = {
  chain: ChainKey;
  address: `0x${string}`;
  symbol: string;
  name: string;
  logo?: string;
  source?: "coingecko" | "manual";
};

export const HEX_ADDRESS = "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39" as const;

export const PULSE_CURATED: TokenDef[] = [
  {
    chain: "pulsechain",
    address: "0xA1077a294dDE1B09bB078844df40758a5D0f9a27",
    symbol: "WPLS",
    name: "Wrapped Pulse",
    source: "manual",
  },
  { chain: "pulsechain", address: HEX_ADDRESS, symbol: "HEX", name: "HEX", source: "manual" },
  {
    chain: "pulsechain",
    address: "0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d",
    symbol: "INC",
    name: "Incentive",
    source: "manual",
  },
  {
    chain: "pulsechain",
    address: "0x95B303987A60C71504D99Aa1b13B4DA07b0790ab",
    symbol: "PLSX",
    name: "PulseX",
    source: "manual",
  },
];
