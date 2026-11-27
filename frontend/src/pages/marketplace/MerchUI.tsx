import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MarketIcon } from "./MarketplaceUI"
import type { MerchItem } from "./merchData"

export function MerchArtwork({
  item,
  view = "front",
  className = "",
}: {
  item: MerchItem
  view?: "front" | "back"
  className?: string
}) {
  const src = view === "back" ? item.imageBack : item.imageFront

  return (
    <div
      data-artwork
      className={`relative isolate grid aspect-[.92] place-items-center overflow-hidden bg-[#0f100e] ${className}`}
    >
      <img
        src={src}
        alt={`${item.name} — ${view} view`}
        loading="lazy"
        className="absolute inset-0 size-full object-cover transition duration-500"
      />
      <span className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/50 px-2.5 py-1 font-mono text-[10px] tracking-[.18em] text-white/70 backdrop-blur">
        {view === "back" ? "BACK" : "FRONT"}
      </span>
    </div>
  )
}

export function MerchCard({ item }: { item: MerchItem }) {
  return (
    <Card className="group overflow-hidden border-white/[.08] bg-[#11120f] transition duration-300 hover:-translate-y-1 hover:border-red-300/20">
      <a href={`/merch/${item.id}`} className="relative block">
        <MerchArtwork item={item} view="front" />
        <Badge
          variant="outline"
          className="absolute left-3 top-3 border-white/20 bg-black/45 text-white/90 backdrop-blur"
        >
          {item.category}
        </Badge>
        <Badge variant="red" className="absolute right-3 top-3">
          {item.stockLabel}
        </Badge>
      </a>
      <div className="p-4">
        <a href={`/merch/${item.id}`} className="text-sm font-medium hover:text-red-300">
          {item.name}
        </a>
        <div className="mt-4 flex items-center justify-between border-t border-white/[.07] pt-3">
          <div>
            <p className="text-[10px] text-zinc-600">PRICE</p>
            <p className="mt-1 text-sm font-medium text-red-300">${item.price.toFixed(2)} USD</p>
          </div>
          <a
            href={`/merch/${item.id}`}
            className={buttonVariants({ variant: "outline", size: "sm", className: "rounded-full" })}
          >
            View merch <MarketIcon name="arrow" />
          </a>
        </div>
      </div>
    </Card>
  )
}
