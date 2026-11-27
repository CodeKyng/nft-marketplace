import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MarketIcon, MarketLayout, PageHeading } from "./MarketplaceUI"
import { MerchCard } from "./MerchUI"
import { MERCH_HERO_IMAGE, merchItems } from "./merchData"

export function MerchShop() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All merch")

  const items = useMemo(
    () =>
      merchItems.filter(
        (item) =>
          (category === "All merch" || item.category === category) &&
          `${item.name} ${item.description}`.toLowerCase().includes(query.toLowerCase())
      ),
    [category, query]
  )

  return (
    <MarketLayout active="merch">
      <main className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12">
        {/* Hero with real product lineup */}
        <div className="relative mb-8 overflow-hidden rounded-3xl border border-red-300/10 bg-[#11120f]">
          <img
            src={MERCH_HERO_IMAGE}
            alt="Monarch Guild merch collection"
            className="h-[220px] w-full object-cover object-center sm:h-[280px] lg:h-[320px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c0a] via-[#0b0c0a]/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 sm:p-9">
            <Badge variant="red" className="mb-3">
              MONARCH GUILD GOODS
            </Badge>
            <h1 className="text-3xl font-medium tracking-[-.05em] sm:text-4xl">Wear the story.</h1>
            <p className="mt-2 max-w-lg text-sm leading-6 text-zinc-300">
              Physical goods inspired by the Guild’s digital collection. Apparel, accessories, and
              art for your space.
            </p>
          </div>
        </div>

        <PageHeading
          eyebrow="PHYSICAL GOODS"
          title="Guild merch"
          description="Shop official apparel and accessories. Front and back designs available on every piece."
        />

        <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">
          <label className="relative">
            <MarketIcon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search merch"
              className="pl-10"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {["All merch", "Apparel", "Accessories"].map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full border px-3 py-2 text-xs transition ${
                  category === item
                    ? "border-red-400/30 bg-red-400/10 text-red-300"
                    : "border-white/10 text-zinc-400 hover:bg-white/[.04]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4 mt-7 flex items-center justify-between">
          <p className="text-sm text-zinc-400">{items.length} merch items</p>
          <Badge variant="outline">Ships as physical goods</Badge>
        </div>

        {items.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
              <MerchCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="py-14 text-center text-sm text-zinc-500">No merch matched your search.</p>
        )}
      </main>
    </MarketLayout>
  )
}

export default MerchShop
