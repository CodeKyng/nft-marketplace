import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MarketIcon, MarketLayout } from "./MarketplaceUI"
import MintButton from "./MintButton"
import { useGuildCatalog } from "./useGuildCatalog"

export function ProductDetail({ itemId }: { itemId: string }) {
  const { items, loading, error } = useGuildCatalog()
  const tokenId = Number(itemId)
  const item = items.find((entry) => entry.tokenId === tokenId)

  if (loading) {
    return (
      <MarketLayout active="shop">
        <main className="mx-auto max-w-6xl px-5 py-20 text-center text-sm text-zinc-500">
          Loading NFT #{itemId}…
        </main>
      </MarketLayout>
    )
  }

  if (!item || Number.isNaN(tokenId) || tokenId < 1 || tokenId > 30) {
    return (
      <MarketLayout active="shop">
        <main className="mx-auto max-w-5xl px-5 py-16 text-center">
          <Badge variant="outline">{error ? "CATALOG ERROR" : "NFT NOT FOUND"}</Badge>
          <h1 className="mt-4 text-3xl font-medium">
            {error ? "We couldn’t load this NFT." : "This token isn’t in the collection."}
          </h1>
          <p className="mt-3 text-sm text-zinc-500">{error || "IDs are 1–30."}</p>
          <a href="/shop" className={buttonVariants({ className: "mt-6" })}>
            Back to collection
          </a>
        </main>
      </MarketLayout>
    )
  }

  return (
    <MarketLayout active="shop">
      <main className="mx-auto max-w-6xl px-5 py-9 sm:px-8 sm:py-12">
        <a
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white"
        >
          <MarketIcon name="back" />
          Back to collection
        </a>

        <div className="mt-7 grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
          <Card className="overflow-hidden border-white/10 bg-[#11120f] p-2">
            {item.image ? (
              <img
                data-artwork
                src={item.image}
                alt={item.name}
                className={`aspect-square w-full rounded-xl object-cover ${item.minted ? "opacity-70" : ""}`}
              />
            ) : (
              <div className="grid aspect-square place-items-center rounded-xl bg-white/[.03] text-sm text-zinc-500">
                No image in metadata
              </div>
            )}
          </Card>

          <section className="py-2 lg:py-5">
            <div className="flex items-center gap-2">
              <Badge variant="red">1-OF-1</Badge>
              <Badge variant="outline">TOKEN #{item.tokenId}</Badge>
              <Badge variant={item.minted ? "outline" : "red"}>
                {item.minted ? "SOLD" : "AVAILABLE"}
              </Badge>
            </div>

            <h1 className="mt-5 text-4xl font-medium tracking-[-.06em] sm:text-5xl">{item.name}</h1>
            <p className="mt-7 max-w-lg whitespace-pre-line text-sm leading-7 text-zinc-400">
              {item.description}
            </p>

            <Card className="mt-8 border-white/10 bg-white/[.025] p-5">
              <p className="text-xs text-zinc-500">MINT PRICE</p>
              <p className="mt-2 text-2xl font-medium text-red-300">0.01 ETH</p>
              <p className="mt-1 text-xs text-zinc-600">Same price for every Guild NFT</p>

              {item.minted ? (
                <p className="mt-5 text-sm text-zinc-400">
                  This piece is already claimed
                  {item.owner ? (
                    <>
                      {" "}
                      by{" "}
                      <span className="font-mono text-xs text-zinc-500">
                        {item.owner.slice(0, 6)}…{item.owner.slice(-4)}
                      </span>
                    </>
                  ) : (
                    "."
                  )}
                </p>
              ) : (
                <MintButton tokenId={item.tokenId} className="mt-5" />
              )}
            </Card>

            {item.attributes.length > 0 && (
              <>
                <h2 className="mt-8 text-sm font-medium">Traits</h2>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {item.attributes.map((attribute, index) => (
                    <Card
                      key={`${attribute.trait_type ?? "trait"}-${index}`}
                      className="border-white/[.08] bg-white/[.025] p-4"
                    >
                      <p className="truncate text-[10px] tracking-wider text-zinc-600">
                        {attribute.trait_type ?? "ATTRIBUTE"}
                      </p>
                      <p className="mt-2 truncate text-sm">{attribute.value ?? "—"}</p>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </MarketLayout>
  )
}

export default ProductDetail
