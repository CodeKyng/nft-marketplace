import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MarketIcon, MarketLayout, PageHeading } from "./MarketplaceUI"
import { MerchCard } from "./MerchUI"
import { merchItems } from "./merchData"

export function MerchShop() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All merch")
  const items = useMemo(() => merchItems.filter((item) => (category === "All merch" || item.category === category) && `${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase())), [category, query])
  return <MarketLayout active="merch"><main className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12"><div className="mb-8 flex flex-wrap items-end justify-between gap-5 rounded-3xl border border-red-300/10 bg-[radial-gradient(ellipse_at_78%_20%,rgba(239,68,68,.13),transparent_45%)] bg-[#11120f] p-6 sm:p-9"><div><Badge variant="red" className="mb-3">MONARCH GUILD GOODS</Badge><h1 className="text-3xl font-medium tracking-[-.05em] sm:text-4xl">Wear the story.</h1><p className="mt-2 max-w-lg text-sm leading-6 text-zinc-500">Physical goods inspired by the Guild’s digital collection. Apparel, accessories, and art for your space.</p></div><a href="/merch/guild-hoodie" className="inline-flex items-center gap-2 text-sm text-red-300 hover:text-red-200">Featured merch <MarketIcon name="arrow"/></a></div>
    <PageHeading eyebrow="PHYSICAL GOODS" title="Guild merch" description="Shop official apparel, accessories, and collectible prints."/><div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]"><label className="relative"><MarketIcon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"/><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search merch" className="pl-10"/></label><div className="flex gap-2">{["All merch", "Apparel", "Accessories", "Art prints"].map((item) => <button key={item} onClick={() => setCategory(item)} className={`rounded-full border px-3 py-2 text-xs transition ${category === item ? "border-red-400/30 bg-red-400/10 text-red-300" : "border-white/10 text-zinc-400 hover:bg-white/[.04]"}`}>{item}</button>)}</div></div><div className="mb-4 mt-7 flex items-center justify-between"><p className="text-sm text-zinc-400">{items.length} merch items</p><Badge variant="outline">Ships as physical goods</Badge></div>{items.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map((item) => <MerchCard key={item.id} item={item}/>)}</div> : <p className="py-14 text-center text-sm text-zinc-500">No merch matched your search.</p>}</main></MarketLayout>
}
export default MerchShop
