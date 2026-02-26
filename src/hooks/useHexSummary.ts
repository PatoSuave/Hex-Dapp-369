"use client";

import { useMemo } from "react";
import { formatUnits } from "viem";
import { useBalance, useReadContract, useReadContracts } from "wagmi";
import { HEX_ADDRESS, hexAbi } from "@/lib/hexAbi";

export type HexStakeRow = {
  chainId: 1 | 369;
  stakeIndex: number;
  stakeId: bigint;
  stakedHearts: bigint;
  stakeShares: bigint;
  lockedDay: number;
  stakedDays: number;
  unlockedDay: number;
  isAutoStake: boolean;
  maturityDay: number;
  status: "ACTIVE" | "MATURE" | "ENDED";
};

export function useHexSummary(address: `0x${string}`, chainId: 1 | 369) {
  const native = useBalance({ address, chainId });

  const decimals = useReadContract({
    chainId,
    address: HEX_ADDRESS,
    abi: hexAbi,
    functionName: "decimals",
  });

  const hexBal = useReadContract({
    chainId,
    address: HEX_ADDRESS,
    abi: hexAbi,
    functionName: "balanceOf",
    args: [address],
  });

  const currentDay = useReadContract({
    chainId,
    address: HEX_ADDRESS,
    abi: hexAbi,
    functionName: "currentDay",
  });

  const stakeCount = useReadContract({
    chainId,
    address: HEX_ADDRESS,
    abi: hexAbi,
    functionName: "stakeCount",
    args: [address],
  });

  const count = Number(stakeCount.data ?? 0n);

  const stakeCalls = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      chainId,
      address: HEX_ADDRESS,
      abi: hexAbi,
      functionName: "stakeLists" as const,
      args: [address, BigInt(i)] as const,
    }));
  }, [count, chainId, address]);

  const stakeLists = useReadContracts({ contracts: stakeCalls, allowFailure: true });

  const hexDecimals = Number(decimals.data ?? 8);
  const hexAmount = Number(formatUnits(hexBal.data ?? 0n, hexDecimals));
  const cd = Number(currentDay.data ?? 0n);

  const rows: HexStakeRow[] = useMemo(() => {
    const data = stakeLists.data ?? [];
    return data
      .map((r, i) => {
        const v = r?.result;
        if (!v) return null;
        const [stakeId, stakedHearts, stakeShares, lockedDayB, stakedDaysB, unlockedDayB, isAutoStake] = v;

        const lockedDay = Number(lockedDayB as unknown as bigint);
        const stakedDays = Number(stakedDaysB as unknown as bigint);
        const unlockedDay = Number(unlockedDayB as unknown as bigint);
        const maturityDay = lockedDay + stakedDays;

        let status: HexStakeRow["status"] = "ACTIVE";
        if (unlockedDay > 0) status = "ENDED";
        else if (cd >= maturityDay) status = "MATURE";

        return {
          chainId,
          stakeIndex: i,
          stakeId: stakeId as bigint,
          stakedHearts: stakedHearts as bigint,
          stakeShares: stakeShares as bigint,
          lockedDay,
          stakedDays,
          unlockedDay,
          isAutoStake: Boolean(isAutoStake),
          maturityDay,
          status,
        };
      })
      .filter(Boolean) as HexStakeRow[];
  }, [stakeLists.data, cd, chainId]);

  return {
    native,
    hexAmount,
    hexDecimals,
    currentDay: cd,
    stakeCount: count,
    stakes: rows,
    isLoading:
      native.isLoading ||
      decimals.isLoading ||
      hexBal.isLoading ||
      currentDay.isLoading ||
      stakeCount.isLoading ||
      stakeLists.isLoading,
    error:
      native.error ||
      decimals.error ||
      hexBal.error ||
      currentDay.error ||
      stakeCount.error ||
      stakeLists.error,
  };
}
