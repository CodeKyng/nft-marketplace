import { useEffect, useState } from "react"
import { METADATA_BASE, MAX_SUPPLY, NFT_ADDRESS, RPC_URL, SELECTORS } from "@/lib/contracts"
import { resolveAssetURI } from "./useContractNFTs"

export type GuildNFT = {
  tokenId: number
  name: string
  description: string
  image: string | null
  attributes: Array<{ trait_type?: string; value?: string | number }>
  minted: boolean
  owner: string | null
}

type CatalogState = {
  items: GuildNFT[]
  loading: boolean
  error: string | null
  mintedCount: number
}

let requestId = 0

async function rpc(method: string, params: unknown[], signal: AbortSignal) {
  const response = await fetch(RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: ++requestId, method, params }),
    signal,
  })
  if (!response.ok) throw new Error(`RPC HTTP ${response.status}`)
  const payload = (await response.json()) as { result?: string; error?: { message?: string } }
  if (payload.error) throw new Error(payload.error.message || "RPC error")
  return payload.result
}

function word(value: number) {
  return value.toString(16).padStart(64, "0")
}

async function loadMetadata(tokenId: number, signal: AbortSignal) {
  const uri = `${METADATA_BASE}${tokenId}.json`
  const url = resolveAssetURI(uri, window.location.href)
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`Metadata ${tokenId} HTTP ${response.status}`)
  return (await response.json()) as Record<string, unknown>
}

async function isMinted(tokenId: number, signal: AbortSignal): Promise<{ minted: boolean; owner: string | null }> {
  if (!NFT_ADDRESS) return { minted: false, owner: null }

  // exists(uint256)
  try {
    const result = await rpc(
      "eth_call",
      [{ to: NFT_ADDRESS, data: `${SELECTORS.exists}${word(tokenId)}` }, "latest"],
      signal
    )
    if (result && BigInt(result) !== 0n) {
      const ownerResult = await rpc(
        "eth_call",
        [{ to: NFT_ADDRESS, data: `${SELECTORS.ownerOf}${word(tokenId)}` }, "latest"],
        signal
      ).catch(() => null)
      const owner = ownerResult ? `0x${ownerResult.slice(-40)}` : null
      return { minted: true, owner }
    }
  } catch {
    // fallback: try ownerOf (reverts if not minted)
    try {
      const ownerResult = await rpc(
        "eth_call",
        [{ to: NFT_ADDRESS, data: `${SELECTORS.ownerOf}${word(tokenId)}` }, "latest"],
        signal
      )
      if (ownerResult) return { minted: true, owner: `0x${ownerResult.slice(-40)}` }
    } catch {
      return { minted: false, owner: null }
    }
  }
  return { minted: false, owner: null }
}

export function useGuildCatalog() {
  const [state, setState] = useState<CatalogState>({
    items: [],
    loading: true,
    error: null,
    mintedCount: 0,
  })

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        const ids = Array.from({ length: MAX_SUPPLY }, (_, i) => i + 1)

        const items = await Promise.all(
          ids.map(async (tokenId) => {
            const [meta, status] = await Promise.all([
              loadMetadata(tokenId, controller.signal).catch(() => ({})),
              isMinted(tokenId, controller.signal),
            ])

            const rawImage =
              typeof meta.image === "string"
                ? meta.image
                : typeof meta.image_url === "string"
                  ? meta.image_url
                  : null

            return {
              tokenId,
              name: typeof meta.name === "string" ? meta.name : `Monarch #${tokenId}`,
              description:
                typeof meta.description === "string"
                  ? meta.description
                  : "Official Monarch Guild NFT",
              image: rawImage
                ? resolveAssetURI(rawImage, `${METADATA_BASE}${tokenId}.json`)
                : null,
              attributes: Array.isArray(meta.attributes)
                ? (meta.attributes as GuildNFT["attributes"])
                : [],
              minted: status.minted,
              owner: status.owner,
            } satisfies GuildNFT
          })
        )

        if (!controller.signal.aborted) {
          setState({
            items,
            loading: false,
            error: null,
            mintedCount: items.filter((i) => i.minted).length,
          })
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setState({
            items: [],
            loading: false,
            error: error instanceof Error ? error.message : "Could not load catalog",
            mintedCount: 0,
          })
        }
      }
    }

    void load()
    return () => controller.abort()
  }, [])

  return state
}
