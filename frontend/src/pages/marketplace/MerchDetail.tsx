import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MarketIcon, MarketLayout } from "./MarketplaceUI"
import { MerchArtwork } from "./MerchUI"
import { merchItems } from "./merchData"
import { addToCart } from "./marketplaceData"

export function MerchDetail({ itemId }: { itemId: string }) {
  const item = merchItems.find((entry) => entry.id === itemId)
  const [size, setSize] = useState(item?.sizes[0] ?? "One size")
  const [notice, setNotice] = useState("")
  if (!item) return <MarketLayout active="merch"><main className="mx-auto max-w-5xl px-5 py-16 text-center"><Badge variant="outline">404 · NOT FOUND</Badge><h1 className="mt-4 text-3xl font-medium">We couldn’t find that merch item.</h1><a href="/merch" className={buttonVariants({ className: "mt-6" })}>Back to merch</a></main></MarketLayout>
  return <MarketLayout active="merch"><main className="mx-auto max-w-6xl px-5 py-9 sm:px-8 sm:py-12"><a href="/merch" className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"><MarketIcon name="back"/>Back to merch</a><div className="mt-7 grid gap-8 lg:grid-cols-[1.05fr_.95fr]"><Card className="overflow-hidden border-white/10 bg-[#11120f] p-2"><MerchArtwork item={item} className="aspect-square rounded-xl"/></Card><section className="py-2 lg:py-5"><div className="flex items-center gap-2"><Badge variant="red">{item.category}</Badge><Badge variant="outline">{item.stockLabel}</Badge></div><h1 className="mt-5 text-3xl font-medium tracking-[-.06em] sm:text-4xl">{item.name}</h1><p className="mt-3 text-3xl font-medium text-red-300">${item.price.toFixed(2)} <span className="text-base text-zinc-500">USD</span></p><p className="mt-6 max-w-lg text-sm leading-7 text-zinc-400">{item.description}</p><div className="mt-7"><label htmlFor="merch-size" className="mb-2 block text-sm font-medium">{item.sizes.length === 1 && item.sizes[0] === "One size" ? "Size" : "Choose a size"}</label><select id="merch-size" value={size} onChange={(event) => setSize(event.target.value)} className="h-11 w-full rounded-xl border border-white/10 bg-[#11120f] px-3.5 text-sm text-white outline-none focus:border-red-400/50">{item.sizes.map((option) => <option key={option} value={option}>{option}</option>)}</select></div><Button className="mt-5 w-full rounded-xl" onClick={() => { addToCart(item.id, size); setNotice(`${item.name} (${size}) added to your cart.`) }}>Add to cart <MarketIcon name="cart"/></Button>{notice && <p role="status" className="mt-3 text-center text-xs text-red-300">{notice}</p>}<div className="mt-7 grid grid-cols-2 gap-3"><Card className="border-white/[.08] bg-white/[.025] p-4"><p className="text-[10px] tracking-wider text-zinc-600">PRODUCT TYPE</p><p className="mt-2 text-sm">Physical goods</p></Card><Card className="border-white/[.08] bg-white/[.025] p-4"><p className="text-[10px] tracking-wider text-zinc-600">FULFILLMENT</p><p className="mt-2 text-sm">{item.stockLabel}</p></Card></div><p className="mt-5 text-xs leading-5 text-zinc-600">Store preview · Shipping details and payment are not enabled yet.</p></section></div></main></MarketLayout>
}
export default MerchDetail
