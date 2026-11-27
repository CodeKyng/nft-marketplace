/**
 * Contract addresses + ABI for The Monarch Guild
 * Redeploy NFT.sol after pick-and-mint change, then update VITE_NFT_ADDRESS
 */

export const NFT_ADDRESS = (import.meta.env.VITE_NFT_ADDRESS as string | undefined)?.trim() || ""
export const MARKETPLACE_ADDRESS = (import.meta.env.VITE_MARKETPLACE_ADDRESS as string | undefined)?.trim() || ""
export const MONARCH_TOKEN_ADDRESS = (import.meta.env.VITE_MONARCH_TOKEN_ADDRESS as string | undefined)?.trim() || ""
export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 84532)
export const RPC_URL = (import.meta.env.VITE_BASE_SEPOLIA_RPC_URL as string | undefined)?.trim() || "https://sepolia.base.org"

/** IPFS folder with 1.json … 30.json */
export const METADATA_BASE =
  "ipfs://bafybeihlrs7qhfgdzqw66evvin6vd5du5pw7f2b42z5avufmkdvmhymeyu/"

export const MAX_SUPPLY = 30

export const NFT_ABI = [
  {
    type: "function",
    name: "mint",
    stateMutability: "payable",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [],
  },
  {
    type: "function",
    name: "ownerMint",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "mintPrice",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "totalSupply",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
  {
    type: "function",
    name: "exists",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "bool" }],
  },
  {
    type: "function",
    name: "tokenURI",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "string" }],
  },
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ type: "address" }],
  },
  {
    type: "event",
    name: "Minted",
    inputs: [
      { name: "to", type: "address", indexed: true },
      { name: "tokenId", type: "uint256", indexed: true },
    ],
  },
] as const

// selectors
export const SELECTORS = {
  mint: "0xa0712d68", // mint(uint256)
  mintPrice: "0x6817c76c",
  totalSupply: "0x18160ddd",
  exists: "0x4f558e79", // exists(uint256)
  ownerOf: "0x6352211e",
  tokenURI: "0xc87b56dd",
} as const
