import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MarketIcon, MarketLayout, PageHeading } from "./MarketplaceUI"
import MintButton from "./MintButton"
import { useGuildCatalog, type GuildNFT } from "./useGuildCatalog"

const filters = ["All", "Available", "Sold"]

function NFTPickCard({ item }: { item: GuildNFT }) {
  return (
    <Card className="group overflow-hidden border-white/[.08] bg-[#11120f] transition duration-300 hover:-translate-y-1 hover:border-red-300/20">
      <a href={`/nft/${item.tokenId}`} className="relative block">
        <div className="relative grid aspect-[.92] place-items-center overflow-hidden bg-[#171717]">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              className={`absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-[1.03] ${
                item.minted ? "opacity-50 grayscale" : ""
              }`}
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-zinc-500">
              <MarketIcon name="sparkle" className="size-7" />
              <span className="text-xs">No image</span>
            </div>
          )}
          <Badge
            variant="outline"
            className="absolute left-3 top-3 border-white/20 bg-black/45 text-white/90 backdrop-blur"
          >
            #{item.tokenId}
          </Badge>
          <Badge variant={item.minted ? "outline" : "red"} className="absolute right-3 top-3">
            {item.minted ? "SOLD" : "AVAILABLE"}
          </Badge>
        </div>
      </a>
      <div className="p-4">
        <a href={`/nft/${item.tokenId}`} className="block truncate text-sm font-medium hover:text-red-300">
          {item.name}
        </a>
        {item.attributes.length > 0 && (
          <p className="mt-1 line-clamp-1 text-xs text-zinc-500">
            {item.attributes
              .slice(0, 3)
              .map((a) => a.value)
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
        <div className="mt-4 border-t border-white/[.07] pt-3">
          {item.minted ? (
            <p className="text-center text-xs text-zinc-500">Already minted</p>
          ) : (
            <MintButton tokenId={item.tokenId} className="w-full [&>button]:w-full" />
          )}
        </div>
      </div>
    </Card>
  )
}

export function Shop() {
  const { items, loading, error, mintedCount } = useGuildCatalog()
  const [filter, setFilter] = useState("All")
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesFilter =
        filter === "All" ||
        (filter === "Available" && !item.minted) ||
        (filter === "Sold" && item.minted)
      const q = query.toLowerCase()
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        String(item.tokenId).includes(q) ||
        item.attributes.some(
          (a) =>
            String(a.value ?? "")
              .toLowerCase()
              .includes(q) || String(a.trait_type ?? "").toLowerCase().includes(q)
        )
      return matchesFilter && matchesQuery
    })
  }, [items, filter, query])

  return (
    <MarketLayout active="shop">
      <main className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12">
        <PageHeading
          eyebrow="BASE SEPOLIA · 1-OF-1s"
          title="Pick your Guild NFT"
          description="All 30 unique pieces. Choose the exact one you want — same price for every NFT."
        />

        <div className="mt-7 grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="relative">
            <MarketIcon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, traits, or #ID"
              className="pl-10"
            />
          </label>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? "secondary" : "outline"}
                className="rounded-full"
                onClick={() => setFilter(f)}
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-4 mt-8 flex items-center justify-between">
          <p className="text-sm text-zinc-400">
            {loading
              ? "Loading catalog…"
              : `${filtered.length} shown · ${mintedCount}/30 minted · ${30 - mintedCount} left`}
          </p>
          <Badge variant="outline">0.01 ETH each</Badge>
        </div>

        {error ? (
          <Card className="border-amber-300/15 bg-amber-200/[.03]">
            <CardContent className="py-8 text-center">
              <p className="text-sm text-amber-100">Could not load the collection.</p>
              <p className="mt-2 text-xs text-zinc-500">{error}</p>
              <p className="mt-3 text-xs text-zinc-500">
                Metadata loads from IPFS. Mint status needs VITE_NFT_ADDRESS after you redeploy.
              </p>
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="grid animate-pulse gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((slot) => (
              <div key={slot} className="aspect-[.8] rounded-2xl border border-white/[.06] bg-white/[.025]" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <NFTPickCard key={item.tokenId} item={item} />
            ))}
          </div>
        )}
      </main>
    </MarketLayout>
  )
}

export default Shop
