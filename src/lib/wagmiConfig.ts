import { createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { metaMask, injected } from "wagmi/connectors";
import { defineChain } from "viem";

export const pulsechain = defineChain({
  id: 369,
  name: "PulseChain",
  nativeCurrency: {
    decimals: 18,
    name: "Pulse",
    symbol: "PLS",
  },
  rpcUrls: {
    default: { http: ["https://rpc.pulsechain.com"] },
    public: { http: ["https://rpc.pulsechain.com"] },
  },
  blockExplorers: {
    default: { name: "PulseScan", url: "https://scan.pulsechain.com" },
  },
});

export const config = createConfig({
  chains: [mainnet, pulsechain],
  connectors: [
    metaMask(),        // MetaMask
    injected(),        // Rabby and any other injected wallet (EIP-1193)
  ],
  transports: {
    [mainnet.id]: http(),
    [pulsechain.id]: http("https://rpc.pulsechain.com"),
  },
  ssr: true,
});
