import { useCallback, useState } from "react"
import { NFT_ADDRESS, CHAIN_ID, SELECTORS, RPC_URL } from "@/lib/contracts"

type MintState = {
  status: "idle" | "connecting" | "pending" | "success" | "error"
  txHash: string | null
  error: string | null
}

async function readMintPrice(): Promise<bigint> {
  const response = await fetch(RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_call",
      params: [{ to: NFT_ADDRESS, data: SELECTORS.mintPrice }, "latest"],
    }),
  })
  const payload = await response.json() as { result?: string; error?: { message?: string } }
  if (payload.error || !payload.result) throw new Error(payload.error?.message || "Could not read mint price")
  return BigInt(payload.result)
}

export function useMintNFT() {
  const [state, setState] = useState<MintState>({
    status: "idle",
    txHash: null,
    error: null,
  })

  const mint = useCallback(async () => {
    if (!NFT_ADDRESS) {
      setState({ status: "error", txHash: null, error: "NFT contract address is not configured. Redeploy and set VITE_NFT_ADDRESS." })
      return
    }

    const ethereum = (window as unknown as { ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      isMetaMask?: boolean
    } }).ethereum

    if (!ethereum) {
      setState({ status: "error", txHash: null, error: "No wallet found. Install MetaMask or another Web3 wallet." })
      return
    }

    try {
      setState({ status: "connecting", txHash: null, error: null })

      // Request accounts
      const accounts = await ethereum.request({ method: "eth_requestAccounts" }) as string[]
      if (!accounts?.[0]) throw new Error("No account connected")

      // Switch / add Base Sepolia if needed
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
        })
      } catch (switchError: unknown) {
        const code = (switchError as { code?: number })?.code
        if (code === 4902) {
          await ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: `0x${CHAIN_ID.toString(16)}`,
              chainName: "Base Sepolia",
              nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
              rpcUrls: [RPC_URL],
              blockExplorerUrls: ["https://sepolia.basescan.org"],
            }],
          })
        } else {
          throw switchError
        }
      }

      const price = await readMintPrice()

      setState({ status: "pending", txHash: null, error: null })

      const txHash = await ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: accounts[0],
          to: NFT_ADDRESS,
          data: SELECTORS.mint,
          value: `0x${price.toString(16)}`,
        }],
      }) as string

      setState({ status: "success", txHash, error: null })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Mint failed"
      setState({ status: "error", txHash: null, error: message })
    }
  }, [])

  const reset = useCallback(() => {
    setState({ status: "idle", txHash: null, error: null })
  }, [])

  return { ...state, mint, reset }
}
