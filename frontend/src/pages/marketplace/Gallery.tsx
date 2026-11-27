import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MarketLayout, PageHeading } from "./MarketplaceUI"
import NFTGallery from "./NFTGallery"
import { addToCart } from "./marketplaceData"
import { useContractNFTs } from "./useContractNFTs"

export function Gallery() {
  const { items, loading, error, totalSupply } = useContractNFTs()
  const [notice, setNotice] = useState("")
  return <MarketLayout active="gallery"><main className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12"><PageHeading eyebrow="ONCHAIN COLLECTION" title="NFT gallery" description="Artwork and metadata read from the deployed Monarch Guild ERC-721 contract."/>{notice && <p role="status" className="mt-4 rounded-xl border border-red-400/15 bg-red-400/[.04] px-4 py-3 text-xs text-red-300">{notice}</p>}<div className="mb-4 mt-7 flex items-center justify-between"><p className="text-sm text-zinc-400">{loading ? "Loading contract NFTs…" : `${totalSupply} minted`}</p></div>{error ? <Card className="border-amber-300/15 bg-amber-200/[.03]"><CardContent className="py-8 text-center"><p className="text-sm text-amber-100">Could not load NFTs from the contract.</p><p className="mt-2 text-xs text-zinc-500">{error}</p></CardContent></Card> : loading ? <p className="py-10 text-center text-sm text-zinc-500">Reading Base Sepolia contract data…</p> : <NFTGallery items={items} onAdd={(item) => { addToCart(`nft:${item.tokenId}`); setNotice(`${item.name} added to your cart.`) }}/>}</main></MarketLayout>
}
export default Gallery
