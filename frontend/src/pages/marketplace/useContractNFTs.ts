import { useEffect, useState } from "react"

export type ContractNFT = {
  tokenId: string
  name: string
  description: string
  image: string | null
  tokenURI: string
  attributes: Array<{ trait_type?: string; value?: string | number }>
  listing: { seller: string; priceWei: bigint; active: boolean } | null
}

type CollectionState = { items: ContractNFT[]; loading: boolean; error: string | null; totalSupply: number }

const contractAddress = (import.meta.env.VITE_NFT_ADDRESS as string | undefined)?.trim()
const marketplaceAddress = (import.meta.env.VITE_MARKETPLACE_ADDRESS as string | undefined)?.trim()
const rpcUrl = (import.meta.env.VITE_BASE_SEPOLIA_RPC_URL as string | undefined)?.trim() || "https://sepolia.base.org"
const maxTokensToLoad = 80
let requestId = 0

async function rpc(method: string, params: unknown[], signal: AbortSignal) {
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: ++requestId, method, params }),
    signal,
  })
  if (!response.ok) throw new Error(`Base Sepolia RPC responded with HTTP ${response.status}.`)
  const payload = await response.json() as { result?: string; error?: { message?: string } }
  if (payload.error) throw new Error(payload.error.message || "The NFT contract request failed.")
  if (!payload.result) throw new Error("The NFT contract returned an empty response.")
  return payload.result
}

function word(value: bigint) { return value.toString(16).padStart(64, "0") }

function decodeAbiString(value: string) {
  const data = value.replace(/^0x/, "")
  const offset = Number(BigInt(`0x${data.slice(0, 64)}`)) * 2
  const length = Number(BigInt(`0x${data.slice(offset, offset + 64)}`))
  const bytes = data.slice(offset + 64, offset + 64 + length * 2)
  const encoded = new Uint8Array(bytes.match(/.{1,2}/g)?.map((part) => Number.parseInt(part, 16)) ?? [])
  return new TextDecoder().decode(encoded)
}

export function resolveAssetURI(uri: string, baseURI: string) {
  const value = uri.trim()
  if (value.startsWith("ipfs://")) return `https://ipfs.io/ipfs/${value.slice("ipfs://".length).replace(/^ipfs\//, "")}`
  if (value.startsWith("ar://")) return `https://arweave.net/${value.slice("ar://".length)}`
  if (value.startsWith("data:")) return value
  if (baseURI.startsWith("ipfs://")) {
    const path = baseURI.slice("ipfs://".length).replace(/^ipfs\//, "")
    const directory = path.slice(0, path.lastIndexOf("/") + 1)
    return `https://ipfs.io/ipfs/${directory}${value.replace(/^\.\//, "")}`
  }
  try { return new URL(value, baseURI).toString() } catch { return value }
}

async function readMetadata(uri: string, signal: AbortSignal) {
  if (uri.startsWith("data:application/json")) {
    const [header, content] = uri.split(",", 2)
    const binary = header.includes(";base64") ? atob(content) : null
    const text = binary ? new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0))) : decodeURIComponent(content)
    return JSON.parse(text) as Record<string, unknown>
  }
  const response = await fetch(resolveAssetURI(uri, window.location.href), { signal })
  if (!response.ok) throw new Error(`Metadata responded with HTTP ${response.status}.`)
  return await response.json() as Record<string, unknown>
}

function parseListing(response: string) {
  const data = response.replace(/^0x/, "")
  const seller = `0x${data.slice(24, 64)}`
  const priceWei = BigInt(`0x${data.slice(64, 128)}`)
  const active = BigInt(`0x${data.slice(128, 192)}`) !== 0n
  return { seller, priceWei, active }
}

async function readToken(tokenId: bigint, signal: AbortSignal): Promise<ContractNFT> {
  const tokenIdHex = word(tokenId)
  const tokenURIResult = await rpc("eth_call", [{ to: contractAddress, data: `0xc87b56dd${tokenIdHex}` }, "latest"], signal)
  const tokenURI = decodeAbiString(tokenURIResult)
  const metadata = await readMetadata(tokenURI, signal).catch(() => ({}))
  const rawImage = typeof metadata.image === "string" ? metadata.image : typeof metadata.image_url === "string" ? metadata.image_url : null
  let listing: ContractNFT["listing"] = null

  if (marketplaceAddress) {
    const listingResult = await rpc("eth_call", [{ to: marketplaceAddress, data: `0x88700d1c${contractAddress!.replace(/^0x/, "").padStart(64, "0")}${tokenIdHex}` }, "latest"], signal).catch(() => null)
    if (listingResult) listing = parseListing(listingResult)
  }

  return {
    tokenId: tokenId.toString(),
    name: typeof metadata.name === "string" ? metadata.name : `Guild NFT #${tokenId}`,
    description: typeof metadata.description === "string" ? metadata.description : "Onchain NFT from The Monarch Guild.",
    image: rawImage ? resolveAssetURI(rawImage, tokenURI) : null,
    tokenURI,
    attributes: Array.isArray(metadata.attributes) ? metadata.attributes as ContractNFT["attributes"] : [],
    listing,
  }
}

async function mapWithConcurrency<T, R>(values: T[], limit: number, mapper: (value: T) => Promise<R>) {
  const results = new Array<R>(values.length)
  let nextIndex = 0
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, async () => {
    while (nextIndex < values.length) {
      const index = nextIndex++
      results[index] = await mapper(values[index])
    }
  }))
  return results
}

export function formatEth(wei: bigint) {
  const whole = wei / 10n ** 18n
  const fraction = (wei % 10n ** 18n).toString().padStart(18, "0").slice(0, 5).replace(/0+$/, "")
  return fraction ? `${whole}.${fraction}` : whole.toString()
}

export function useContractNFTs() {
  const [state, setState] = useState<CollectionState>({ items: [], loading: Boolean(contractAddress), error: contractAddress ? null : "The NFT contract address is not configured.", totalSupply: 0 })

  useEffect(() => {
    if (!contractAddress) return
    const controller = new AbortController()
    async function load() {
      try {
        const supplyHex = await rpc("eth_call", [{ to: contractAddress, data: "0x18160ddd" }, "latest"], controller.signal)
        const supply = Number(BigInt(supplyHex))
        const firstId = BigInt(Math.max(0, supply - maxTokensToLoad))
        const tokenIds = Array.from({ length: Math.min(supply, maxTokensToLoad) }, (_, index) => firstId + BigInt(index)).reverse()
        const items = await mapWithConcurrency(tokenIds, 8, (tokenId) => readToken(tokenId, controller.signal))
        if (!controller.signal.aborted) setState({ items, loading: false, error: null, totalSupply: supply })
      } catch (error) {
        if (!controller.signal.aborted) setState({ items: [], loading: false, error: error instanceof Error ? error.message : "Could not load NFTs from Base Sepolia.", totalSupply: 0 })
      }
    }
    void load()
    return () => controller.abort()
  }, [])

  return state
}
