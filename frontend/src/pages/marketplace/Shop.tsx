import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MarketIcon, MarketLayout, PageHeading } from "./MarketplaceUI"
import NFTGallery from "./NFTGallery"
import MintButton from "./MintButton"
import { addToCart } from "./marketplaceData"
import { useContractNFTs } from "./useContractNFTs"

const filters = ["All NFTs", "Listed", "Not listed"]

export function Shop() {
  const { items: contractNFTs, loading, error, totalSupply } = useContractNFTs()
  const [filter, setFilter] = useState("All NFTs")
  const [query, setQuery] = useState("")
  const [sort, setSort] = useState("newest")
  const [notice, setNotice] = useState("")

  const items = useMemo(() => contractNFTs.filter((item) => {
    const matchesFilter = filter === "All NFTs" || (filter === "Listed" ? item.listing?.active === true : item.listing?.active === false)
    return matchesFilter && `${item.name} ${item.description} ${item.tokenId}`.toLowerCase().includes(query.toLowerCase())
  }).sort((a, b) => sort === "oldest"
    ? Number(a.tokenId) - Number(b.tokenId)
    : sort === "listed-price"
      ? a.listing?.priceWei === b.listing?.priceWei
        ? 0
        : a.listing?.priceWei === undefined
          ? 1
          : b.listing?.priceWei === undefined
            ? -1
            : a.listing.priceWei < b.listing.priceWei ? -1 : 1
      : Number(b.tokenId) - Number(a.tokenId)), [contractNFTs, filter, query, sort])

  function handleAdd(item: (typeof contractNFTs)[number]) {
    addToCart(`nft:${item.tokenId}`)
    setNotice(`${item.name} added to your cart.`)
  }

  const remaining = Math.max(0, 30 - totalSupply)

  return (
    <MarketLayout active="shop">
      <main className="mx-auto max-w-7xl px-5 py-9 sm:px-8 sm:py-12">
        <PageHeading
          eyebrow="BASE SEPOLIA · ERC-721"
          title="The Guild collection"
          description="Mint directly from the contract. Metadata is set automatically via baseURI (token 0 → 1.json, etc.)."
          action={
            <div className="flex flex-col items-end gap-2">
              <MintButton />
              <p className="text-xs text-zinc-500">{remaining} / 30 remaining</p>
            </div>
          }
        />

        <div className="mt-7 grid gap-3 md:grid-cols-[1fr_190px]">
          <label className="relative">
            <MarketIcon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search NFT name or token ID"
              className="pl-10"
            />
          </label>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort NFTs"
            className="h-11 rounded-xl border border-white/10 bg-[#11120f] px-3 text-sm text-zinc-200 outline-none focus:border-red-400/50"
          >
            <option value="newest">Newest token first</option>
            <option value="oldest">Oldest token first</option>
            <option value="listed-price">Listed price: low to high</option>
          </select>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {filters.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={filter === item ? "secondary" : "outline"}
              className="rounded-full"
              onClick={() => setFilter(item)}
            >
              {item}
            </Button>
          ))}
        </div>

        {notice && (
          <p role="status" className="mt-4 rounded-xl border border-red-400/15 bg-red-400/[.04] px-4 py-3 text-xs text-red-300">
            {notice}
          </p>
        )}

        <div className="mb-4 mt-8 flex items-center justify-between">
          <p className="text-sm text-zinc-400">
            {loading ? "Loading contract NFTs…" : `${items.length} shown · ${totalSupply} minted`}
          </p>
          <Badge variant="outline">Onchain data</Badge>
        </div>

        {error ? (
          <Card className="border-amber-300/15 bg-amber-200/[.03]">
            <CardContent className="py-8 text-center">
              <p className="text-sm text-amber-100">Could not load NFTs from the contract.</p>
              <p className="mt-2 text-xs text-zinc-500">{error}</p>
              <p className="mt-3 text-xs text-zinc-500">
                Make sure you redeployed the updated NFT.sol and set VITE_NFT_ADDRESS in your .env
              </p>
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="grid animate-pulse gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((slot) => (
              <div key={slot} className="aspect-[.8] rounded-2xl border border-white/[.06] bg-white/[.025]" />
            ))}
          </div>
        ) : (
          <NFTGallery items={items} onAdd={handleAdd} />
        )}
      </main>
    </MarketLayout>
  )
}

export default Shop
