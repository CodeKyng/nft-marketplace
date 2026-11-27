import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MarketIcon, MarketLayout } from "./MarketplaceUI"
import { MerchArtwork } from "./MerchUI"
import { findStoreItem, getCart, removeFromCart } from "./marketplaceData"
import { formatEth, useContractNFTs, type ContractNFT } from "./useContractNFTs"
import type { MerchItem } from "./merchData"

type CartLine = { cartKey: string; kind: "nft"; item: ContractNFT } | { cartKey: string; kind: "merch"; item: MerchItem; variant: string | undefined }

export function Cart() {
  const [ids, setIds] = useState<string[]>(() => getCart())
  const [notice, setNotice] = useState("")
  const { items: contractNFTs, loading: nftsLoading } = useContractNFTs()
  useEffect(() => { const sync = () => setIds(getCart()); window.addEventListener("monarch-cart-change", sync); window.addEventListener("storage", sync); return () => { window.removeEventListener("monarch-cart-change", sync); window.removeEventListener("storage", sync) } }, [])
  const items = useMemo(() => ids.flatMap((cartKey): CartLine[] => {
    if (cartKey.startsWith("nft:")) {
      const item = contractNFTs.find((token) => token.tokenId === cartKey.slice(4))
      return item ? [{ cartKey, kind: "nft", item }] : []
    }
    const [id, variant] = cartKey.split("::")
    const item = findStoreItem(id)
    return item ? [{ cartKey, variant, kind: "merch", item }] : []
  }), [ids, contractNFTs])
  const ethTotal = items.reduce((sum, line) => sum + (line.kind === "nft" && line.item.listing?.active ? line.item.listing.priceWei : 0n), 0n)
  const usdTotal = items.reduce((sum, line) => sum + (line.kind === "merch" ? line.item.price : 0), 0)
  function remove(cartKey: string) { removeFromCart(cartKey); setNotice("Item removed from your cart.") }

  return <MarketLayout active="cart"><main className="mx-auto max-w-6xl px-5 py-9 sm:px-8 sm:py-12"><Badge variant="red" className="mb-3">YOUR CART</Badge><h1 className="text-3xl font-medium tracking-[-.05em] sm:text-4xl">Review your picks</h1><p className="mt-2 text-sm text-zinc-500">NFT listings and physical Guild goods are shown with their own currencies.</p>{notice && <p role="status" className="mt-4 text-xs text-red-300">{notice}</p>}{items.length === 0 ? <Card className="mt-8 border-white/10 bg-[#11120f]"><CardContent className="flex flex-col items-center py-16 text-center"><span className="grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/[.03] text-zinc-400"><MarketIcon name="cart" className="size-6"/></span><h2 className="mt-5 text-lg font-medium">Your cart is empty</h2><p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">Add a listed contract NFT or browse physical Guild merch.</p><div className="mt-6 flex gap-3"><a href="/shop" className={buttonVariants({ variant: "outline", className: "rounded-full" })}>Shop NFTs</a><a href="/merch" className={buttonVariants({ className: "rounded-full" })}>Shop merch</a></div></CardContent></Card> : <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_330px]"><div className="space-y-3">{items.map((line) => <Card key={line.cartKey} className="flex gap-4 border-white/10 bg-[#11120f] p-3 sm:gap-5 sm:p-4"><a href={line.kind === "nft" ? `/nft/${line.item.tokenId}` : `/merch/${line.item.id}`} className="w-28 shrink-0 overflow-hidden rounded-xl sm:w-36">{line.kind === "nft" ? line.item.image ? <img src={line.item.image} alt={line.item.name} className="aspect-square w-full object-cover"/> : <div className="grid aspect-square place-items-center bg-white/[.03] text-xs text-zinc-500">NFT #{line.item.tokenId}</div> : <MerchArtwork item={line.item} className="aspect-square"/>}</a><div className="flex min-w-0 flex-1 flex-col justify-between py-1"><div><div className="flex flex-wrap items-center gap-2"><Badge variant={line.kind === "nft" ? "outline" : "red"}>{line.kind === "nft" ? `NFT #${line.item.tokenId}` : line.item.category}</Badge><span className="text-[10px] text-zinc-600">{line.kind === "nft" ? line.item.listing?.active ? "Listed" : "No longer listed" : line.variant || line.item.sizes[0]}</span></div><a href={line.kind === "nft" ? `/nft/${line.item.tokenId}` : `/merch/${line.item.id}`} className="mt-3 block truncate text-base font-medium hover:text-red-300">{line.item.name}</a><p className="mt-1 text-xs text-zinc-500">{line.kind === "nft" ? "The Monarch Guild · Base Sepolia" : "Monarch Guild merchandise"}</p></div><div className="flex items-end justify-between gap-2"><span className="text-sm font-medium text-red-300">{line.kind === "nft" ? line.item.listing?.active ? `${formatEth(line.item.listing.priceWei)} ETH` : "Unavailable" : `$${line.item.price.toFixed(2)} USD`}</span><Button variant="ghost" size="sm" className="text-zinc-500 hover:text-rose-200" onClick={() => remove(line.cartKey)}>Remove</Button></div></div></Card>)}</div><Card className="h-fit border-white/10 bg-[#11120f]"><CardContent className="p-5"><h2 className="text-base font-medium">Order summary</h2><div className="mt-5 flex justify-between text-sm text-zinc-400"><span>Items ({items.length})</span><span>Digital + physical</span></div>{ethTotal > 0n && <div className="mt-4 flex justify-between text-sm text-zinc-400"><span>NFT subtotal</span><span>{formatEth(ethTotal)} ETH</span></div>}{usdTotal > 0 && <div className="mt-3 flex justify-between text-sm text-zinc-400"><span>Merch subtotal</span><span>${usdTotal.toFixed(2)} USD</span></div>}<div className="mt-4 border-t border-white/[.08] pt-4"><p className="text-sm">Totals by currency</p>{ethTotal > 0n && <p className="mt-2 text-right font-medium text-red-300">{formatEth(ethTotal)} ETH</p>}{usdTotal > 0 && <p className="mt-1 text-right font-medium text-red-300">${usdTotal.toFixed(2)} USD</p>}</div><Button className="mt-5 w-full rounded-xl" onClick={() => setNotice("Checkout is not enabled yet. Connect a wallet and configure merch fulfillment before purchase.")}>Continue to checkout <MarketIcon name="arrow"/></Button><p className="mt-3 text-center text-[11px] leading-5 text-zinc-600">{nftsLoading ? "Checking current NFT listings…" : "Preview only · no payment or shipment will be created"}</p></CardContent></Card></div>}</main></MarketLayout>
}
export default Cart
