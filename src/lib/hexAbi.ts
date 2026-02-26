export const HEX_ADDRESS = "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39" as const;

export const hexAbi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "decimals",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    type: "function",
    name: "currentDay",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "stakeCount",
    stateMutability: "view",
    inputs: [{ name: "stakerAddr", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "stakeLists",
    stateMutability: "view",
    inputs: [
      { name: "", type: "address" },
      { name: "", type: "uint256" },
    ],
    outputs: [
      { name: "stakeId", type: "uint40" },
      { name: "stakedHearts", type: "uint72" },
      { name: "stakeShares", type: "uint72" },
      { name: "lockedDay", type: "uint16" },
      { name: "stakedDays", type: "uint16" },
      { name: "unlockedDay", type: "uint16" },
      { name: "isAutoStake", type: "bool" },
    ],
  },
  {
    type: "function",
    name: "stakeGoodAccounting",
    stateMutability: "nonpayable",
    inputs: [
      { name: "stakerAddr", type: "address" },
      { name: "stakeIndex", type: "uint256" },
      { name: "stakeIdParam", type: "uint40" },
    ],
    outputs: [],
  },
] as const;
