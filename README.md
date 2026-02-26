# HEX Dashboard

A Next.js dApp for viewing HEX token balances, stakes, and running Good Accounting — on both Ethereum and PulseChain.

Supports **MetaMask** and **Rabby Wallet** via RainbowKit.

---

## Features

- 🔗 Connect MetaMask or Rabby Wallet
- 💰 View HEX + native token balances on Ethereum & PulseChain
- 📊 Real-time prices via DexScreener (highest liquidity pair)
- 🏦 HEX stake viewer — MATURE / ACTIVE / ENDED with smart sorting
- ⚙️ Good Accounting — call `stakeGoodAccounting()` directly from the UI
- 📋 Portfolio tab — Ethereum Top 200 tokens + PulseChain curated list
- ⭐ Track/untrack tokens (saved to localStorage)

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local` and fill in your values:

```bash
# .env.local

# Optional — CoinGecko API key (free demo key available at coingecko.com)
COINGECKO_API_KEY=your_key_here

# Required — WalletConnect Project ID
# Get a free one at https://cloud.walletconnect.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── tokens/ethereum-top200/route.ts   # CoinGecko top 200 ETH tokens
│   │   └── prices/
│   │       ├── dexscreener/route.ts           # Generic DexScreener price endpoint
│   │       └── hex/route.ts                   # HEX price on ETH + PLS
│   ├── layout.tsx                             # Root layout + Providers
│   ├── page.tsx                               # Main page with tab navigation
│   ├── providers.tsx                          # wagmi + RainbowKit + react-query
│   └── globals.css
├── components/
│   ├── Dashboard.tsx                          # HEX balances + stakes + GA
│   ├── GoodAccountingPanel.tsx               # stakeGoodAccounting() UI
│   ├── PortfolioDashboard.tsx                # Tab switcher for token tables
│   ├── EthereumTop200Table.tsx               # ETH top 200 with prices + tracking
│   └── PulseCuratedTable.tsx                 # PulseChain curated tokens
├── hooks/
│   ├── useHexSummary.ts                       # HEX balance + all stakes for a wallet
│   ├── useHexPrices.ts                        # HEX price (polls every 30s)
│   ├── useDexPrices.ts                        # Generic DexScreener price hook
│   ├── useEthereumTop200.ts                   # CoinGecko top 200 hook
│   ├── useTrackedTokens.ts                    # Track/untrack tokens in localStorage
│   └── useEnsureChain.ts                      # Auto-switch wallet chain
└── lib/
    ├── wagmiConfig.ts                          # wagmi + RainbowKit config (ETH + PLS)
    ├── hexAbi.ts                               # HEX contract ABI
    └── tokenRegistry.ts                        # Token definitions
```

---

## Notes

- **WalletConnect Project ID** is required. Get a free one at [cloud.walletconnect.com](https://cloud.walletconnect.com).
- **CoinGecko key** is optional but recommended to avoid rate limiting.
- PulseChain RPC used: `https://rpc.pulsechain.com` (public, no key needed).
- Prices auto-refresh every 30 seconds.
