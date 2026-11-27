/**
 * Contract addresses + ABI fragments for The Monarch Guild
 * Update addresses in .env after redeploying the new NFT.sol
 */

export const NFT_ADDRESS = (import.meta.env.VITE_NFT_ADDRESS as string | undefined)?.trim() || ""
export const MARKETPLACE_ADDRESS = (import.meta.env.VITE_MARKETPLACE_ADDRESS as string | undefined)?.trim() || ""
export const MONARCH_TOKEN_ADDRESS = (import.meta.env.VITE_MONARCH_TOKEN_ADDRESS as string | undefined)?.trim() || ""
export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 84532)
export const RPC_URL = (import.meta.env.VITE_BASE_SEPOLIA_RPC_URL as string | undefined)?.trim() || "https://sepolia.base.org"

// Minimal ABI for the updated NFT contract (public mint + reads)
export const NFT_ABI = [
  // mint() payable — no URI needed, baseURI is automatic
  {
    type: "function",
    name: "mint",
    stateMutability: "payable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "ownerMint",
    stateMutability: "nonpayable",
    inputs: [{ name: "to", type: "address" }],
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
    name: "maxSupply",
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

// Function selectors (for raw eth_call / eth_sendTransaction)
export const SELECTORS = {
  mint: "0x1249c58b",           // mint()
  mintPrice: "0x6817c76c",      // mintPrice()
  maxSupply: "0xd5abeb01",      // maxSupply()
  totalSupply: "0x18160ddd",    // totalSupply()
  tokenURI: "0xc87b56dd",       // tokenURI(uint256)
} as const
