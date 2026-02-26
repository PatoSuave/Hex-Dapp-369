"use client";

import { useCallback } from "react";
import { useChainId, useSwitchChain } from "wagmi";

export function useEnsureChain() {
  const currentChainId = useChainId();
  const { switchChainAsync, isPending } = useSwitchChain();

  const ensureChain = useCallback(
    async (targetChainId: number) => {
      if (currentChainId === targetChainId) return true;
      if (!switchChainAsync) throw new Error("Wallet does not support programmatic chain switching.");
      await switchChainAsync({ chainId: targetChainId });
      return true;
    },
    [currentChainId, switchChainAsync]
  );

  return { currentChainId, ensureChain, isSwitching: isPending };
}
