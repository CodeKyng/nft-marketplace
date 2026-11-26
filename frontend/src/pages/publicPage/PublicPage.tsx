import { useAuth } from "@/auth/AuthProvider"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const nftAddress = import.meta.env.VITE_NFT_ADDRESS as string | undefined
const marketplaceAddress = import.meta.env.VITE_MARKETPLACE_ADDRESS as string | undefined
const explorerUrl = "https://sepolia.basescan.org/address/"

type IconName = "arrow" | "arrow-up" | "sparkle" | "diamond" | "layers" | "globe" | "shield" | "plus"

function Icon({ name, className }: { name: IconName; className?: string }) {
  const common = {
    className,
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  }

  switch (name) {
    case "arrow":
      return <svg {...common}><path d="M5 12h14M13 5l7 7-7 7" /></svg>
    case "arrow-up":
      return <svg {...common}><path d="M7 17 17 7M7 7h10v10" /></svg>
    case "sparkle":
      return <svg {...common}><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" /><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" /></svg>
    case "diamond":
      return <svg {...common}><path d="M6 3h12l4 6-10 12L2 9l4-6Z" /><path d="M2 9h20M9 3l-2 6 5 12 5-12-2-6" /></svg>
    case "layers":
      return <svg {...common}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 16l9 5 9-5" /></svg>
    case "globe":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></svg>
    case "shield":
      return <svg {...common}><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></svg>
    case "plus":
      return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>
  }
}

function BrandMark() {
  return (
    <span className="grid size-9 place-items-center rounded-xl border border-lime-200/20 bg-lime-200/10 text-lime-200">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none">
        <path d="m4 8 4 3 4-6 4 6 4-3-2 11H6L4 8Z" fill="currentColor" />
        <path d="M7 16h10" stroke="#11120f" strokeWidth="1.4" />
      </svg>
    </span>
  )
}

function Artwork({ kind }: { kind: "monarch" | "orbit" | "sun" }) {
  const palettes = {
    monarch: { a: "#d9ff78", b: "#70bca4", c: "#364d43", d: "#161b1a" },
    orbit: { a: "#f7b0ff", b: "#8b82ff", c: "#405fe4", d: "#141427" },
    sun: { a: "#ffe39a", b: "#ff9678", c: "#af5149", d: "#2a181b" },
  }[kind]

  return (
    <svg viewBox="0 0 500 580" className="absolute inset-0 size-full" role="img" aria-label={`${kind} collection concept artwork`}>
      <defs>
        <linearGradient id={`bg-${kind}`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={palettes.d} />
          <stop offset="1" stopColor={palettes.c} />
        </linearGradient>
        <linearGradient id={`metal-${kind}`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor={palettes.a} />
          <stop offset=".52" stopColor={palettes.b} />
          <stop offset="1" stopColor={palettes.a} />
        </linearGradient>
        <radialGradient id={`glow-${kind}`}>
          <stop stopColor={palettes.a} stopOpacity=".72" />
          <stop offset="1" stopColor={palettes.a} stopOpacity="0" />
        </radialGradient>
        <pattern id={`grid-${kind}`} width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0H0v28" fill="none" stroke="white" strokeOpacity=".08" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="500" height="580" fill={`url(#bg-${kind})`} />
      <rect width="500" height="580" fill={`url(#grid-${kind})`} />
      <circle cx="250" cy="248" r="205" fill={`url(#glow-${kind})`} opacity=".68" />
      <circle cx="250" cy="250" r="170" fill="none" stroke={palettes.a} strokeOpacity=".26" />
      <circle cx="250" cy="250" r="145" fill="none" stroke={palettes.a} strokeOpacity=".2" strokeDasharray="2 12" />
      {kind === "monarch" && (
        <g fill={`url(#metal-${kind})`} stroke="#f5ffcf" strokeOpacity=".48" strokeWidth="2">
          <path d="M154 291 106 151l93 77 51-141 51 141 93-77-48 140-37 115H191l-37-115Z" />
          <path d="M190 330h120l-18 67h-84l-18-67Z" fill="#182321" />
          <circle cx="250" cy="139" r="15" />
          <circle cx="131" cy="171" r="9" />
          <circle cx="369" cy="171" r="9" />
          <path d="m223 253 27-49 27 49-27 40-27-40Z" fill="#f2ffd1" />
        </g>
      )}
      {kind === "orbit" && (
        <g fill="none" stroke={`url(#metal-${kind})`} strokeWidth="10">
          <ellipse cx="250" cy="250" rx="66" ry="166" transform="rotate(35 250 250)" />
          <ellipse cx="250" cy="250" rx="66" ry="166" transform="rotate(-35 250 250)" />
          <ellipse cx="250" cy="250" rx="166" ry="66" />
          <circle cx="250" cy="250" r="50" fill={`url(#metal-${kind})`} stroke="none" />
          <circle cx="250" cy="250" r="18" fill="#f8f0ff" stroke="none" />
        </g>
      )}
      {kind === "sun" && (
        <g>
          <circle cx="250" cy="245" r="94" fill={`url(#metal-${kind})`} />
          <circle cx="250" cy="245" r="72" fill="#291a1c" />
          <path d="M151 383c11-59 43-92 99-92s88 33 99 92v37H151v-37Z" fill={`url(#metal-${kind})`} />
          <path d="m201 307 49 65 49-65M211 388l39-16 39 16" fill="none" stroke="#fff1c9" strokeOpacity=".72" strokeWidth="7" />
          <circle cx="250" cy="245" r="116" fill="none" stroke={palettes.a} strokeOpacity=".46" strokeWidth="2" strokeDasharray="3 10" />
        </g>
      )}
      <g fill={palettes.a}>
        <circle cx="82" cy="119" r="3" /><circle cx="410" cy="127" r="2" />
        <circle cx="100" cy="359" r="2" /><circle cx="396" cy="373" r="3" />
        <circle cx="130" cy="463" r="2" /><circle cx="365" cy="467" r="2" />
      </g>
      <path d="M0 483c112-45 165 25 256-6s149-42 244-4v107H0V483Z" fill="#080a0a" fillOpacity=".48" />
      <text x="30" y="535" fill="white" fillOpacity=".72" fontFamily="monospace" fontSize="12" letterSpacing="4">THE MONARCH GUILD · 001</text>
    </svg>
  )
}

const previews = [
  { kind: "monarch" as const, title: "The First Crown", id: "ARTWORK STUDY / 01", tag: "REGAL" },
  { kind: "orbit" as const, title: "Orbit of Kin", id: "ARTWORK STUDY / 02", tag: "COSMIC" },
  { kind: "sun" as const, title: "Heir of Dawn", id: "ARTWORK STUDY / 03", tag: "SOLAR" },
]

const features = [
  {
    icon: "diamond" as const,
    number: "01",
    title: "A collection with a point of view",
    copy: "Distinct digital characters and artifacts, made to feel like keepsakes from another world.",
    className: "md:col-span-2",
  },
  {
    icon: "layers" as const,
    number: "02",
    title: "Owned onchain",
    copy: "ERC-721 tokens put ownership and provenance on the Base network.",
    className: "",
  },
  {
    icon: "globe" as const,
    number: "03",
    title: "Trade peer to peer",
    copy: "A fixed-price marketplace contract supports listings, sales, and creator royalties.",
    className: "",
  },
  {
    icon: "shield" as const,
    number: "04",
    title: "Built for creators",
    copy: "The NFT contract includes ERC-2981 royalty support, configured at 10% by default.",
    className: "md:col-span-2",
  },
]

function ContractAddress({ label, address }: { label: string; address?: string }) {
  if (!address) {
    return <p className="text-sm text-amber-200">{label}: address not configured</p>
  }

  return (
    <a
      href={`${explorerUrl}${address}`}
      target="_blank"
      rel="noreferrer"
      className="group flex min-w-0 items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 p-4 transition hover:border-lime-200/30 hover:bg-white/[0.04]"
    >
      <span className="min-w-0">
        <span className="mb-1 block text-xs text-zinc-500">{label}</span>
        <span className="block truncate font-mono text-xs text-zinc-200 sm:text-sm">{address}</span>
      </span>
      <Icon name="arrow-up" className="shrink-0 text-zinc-500 transition group-hover:text-lime-200" />
    </a>
  )
}

function SpotlightFeature({ feature }: { feature: (typeof features)[number] }) {
  return (
    <Card
      className={cn(
        "spotlight-card group relative min-h-52 overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-lime-200/25",
        feature.className,
      )}
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect()
        event.currentTarget.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`)
        event.currentTarget.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`)
      }}
    >
      <CardContent className="relative flex h-full flex-col justify-between gap-8 p-6 sm:p-7">
        <div className="flex items-start justify-between">
          <span className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-lime-200">
            <Icon name={feature.icon} />
          </span>
          <span className="font-mono text-xs text-zinc-600">{feature.number}</span>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-medium tracking-tight text-white">{feature.title}</h3>
          <p className="max-w-lg text-sm leading-6 text-zinc-400">{feature.copy}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ArtworkCard({ item, index }: { item: (typeof previews)[number]; index: number }) {
  return (
    <Card className="group overflow-hidden border-white/10 bg-[#12130f] transition duration-300 hover:-translate-y-1 hover:border-white/20">
      <div className="relative aspect-[.86] overflow-hidden">
        <Artwork kind={item.kind} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <Badge variant="outline" className="absolute left-4 top-4 border-white/20 bg-black/20 text-white/80 backdrop-blur">
          {item.tag}
        </Badge>
        <span className="absolute bottom-4 right-4 font-mono text-[10px] tracking-widest text-white/55">{item.id}</span>
      </div>
      <CardContent className="flex items-center justify-between gap-3 p-4">
        <span className="min-w-0">
          <span className="block text-sm font-medium text-white">{item.title}</span>
          <span className="mt-1 block text-xs text-zinc-500">Concept artwork · {String(index + 1).padStart(2, "0")}</span>
        </span>
        <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/10 text-zinc-400 transition group-hover:border-lime-200/30 group-hover:text-lime-200">
          <Icon name="arrow-up" className="size-4" />
        </span>
      </CardContent>
    </Card>
  )
}

export function PublicPage() {
  const { user } = useAuth()
  return (
    <main className="min-h-svh overflow-hidden bg-[#0b0c0a] text-white">
      <header className="relative z-10 border-b border-white/[0.07]">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#top" className="flex items-center gap-3" aria-label="The Monarch Guild home">
            <BrandMark />
            <span className="text-sm font-semibold tracking-[0.14em]">MONARCH<span className="text-lime-200">.</span></span>
          </a>
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            <a href="#collection" className="text-sm text-zinc-400 transition hover:text-white">Collection</a>
            <a href="#story" className="text-sm text-zinc-400 transition hover:text-white">The guild</a>
            <a href="#contracts" className="text-sm text-zinc-400 transition hover:text-white">Contracts</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href={user ? "/account" : "/login"} className={buttonVariants({ variant: "ghost", size: "sm", className: "hidden max-w-36 truncate rounded-full px-3 sm:inline-flex" })}>{user?.displayName || (user ? "Account" : "Log in")}</a>
            <a href={user ? "/account" : "/signup"} className={buttonVariants({ size: "sm", className: "h-10 rounded-full px-4" })}>{user ? "My account" : "Join the guild"} <Icon name="arrow" className="size-3.5" /></a>
          </div>
        </div>
      </header>

      <section id="top" className="hero-field relative isolate">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="hero-glow absolute -right-24 top-8 size-[34rem] rounded-full" />
          <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:76px_76px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]" />
        </div>
        <div className="mx-auto grid min-h-[690px] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[.92fr_1.08fr] lg:gap-8 lg:py-20">
          <div className="relative z-[1] max-w-2xl">
            <Badge variant="lime" className="mb-7 gap-2 rounded-full px-3 py-1.5">
              <span className="relative flex size-1.5"><span className="absolute inline-flex size-full animate-ping rounded-full bg-lime-300 opacity-70" /><span className="relative inline-flex size-1.5 rounded-full bg-lime-300" /></span>
              LIVE ON BASE SEPOLIA
            </Badge>
            <h1 className="max-w-[720px] text-[clamp(3.4rem,7.5vw,6.5rem)] font-medium leading-[.91] tracking-[-.075em]">
              A guild of
              <span className="block text-lime-200">rare things.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-zinc-400 sm:text-lg sm:leading-8">
              The Monarch Guild is a home for digital artifacts with character. Collect, keep, and carry a little mythology with you.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#collection" className={buttonVariants({ size: "lg", className: "h-12 rounded-full px-6" })}>
                Discover the collection <Icon name="arrow" className="size-4" />
              </a>
              <a href="#story" className={buttonVariants({ variant: "ghost", size: "lg", className: "h-12 rounded-full px-5" })}>
                How it works
              </a>
            </div>
            <div className="mt-12 flex items-center gap-4 border-t border-white/10 pt-6">
              <span className="flex -space-x-2" aria-hidden="true">
                <span className="size-8 rounded-full border-2 border-[#0b0c0a] bg-gradient-to-br from-lime-200 to-emerald-700" />
                <span className="size-8 rounded-full border-2 border-[#0b0c0a] bg-gradient-to-br from-fuchsia-200 to-indigo-700" />
                <span className="size-8 rounded-full border-2 border-[#0b0c0a] bg-gradient-to-br from-amber-100 to-rose-700" />
              </span>
              <p className="text-xs leading-5 text-zinc-500">A new chapter in<br /><span className="text-zinc-300">digital collecting.</span></p>
              <div className="ml-auto flex items-center gap-2 text-xs text-zinc-500">
                <span className="size-1.5 rounded-full bg-lime-300" /> Testnet is open
              </div>
            </div>
          </div>

          <div className="hero-art relative mx-auto h-[470px] w-full max-w-[580px] sm:h-[570px]" aria-label="Collection artwork preview">
            <div className="absolute left-[5%] top-[15%] h-[70%] w-[52%] rotate-[-12deg] overflow-hidden rounded-[28px] border border-white/10 bg-[#201c2a] shadow-2xl shadow-black/60 opacity-65">
              <Artwork kind="orbit" />
            </div>
            <div className="absolute right-[4%] top-[11%] h-[70%] w-[52%] rotate-[12deg] overflow-hidden rounded-[28px] border border-white/10 bg-[#291b1b] shadow-2xl shadow-black/60 opacity-70">
              <Artwork kind="sun" />
            </div>
            <div className="hero-card absolute left-1/2 top-1/2 h-[82%] w-[59%] -translate-x-1/2 -translate-y-1/2 rotate-[-2deg] overflow-hidden rounded-[28px] border border-white/20 bg-[#19211d] shadow-[0_40px_120px_rgba(0,0,0,.65)]">
              <Artwork kind="monarch" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/5" />
              <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[10px] tracking-wide text-white/80 backdrop-blur-md">
                <span className="size-1.5 rounded-full bg-lime-200" /> COLLECTION PREVIEW
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <p className="text-[10px] tracking-[.22em] text-white/60">THE MONARCH GUILD</p>
                  <p className="mt-1 text-lg font-medium">A study in rarity</p>
                </div>
                <span className="grid size-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur"><Icon name="arrow-up" /></span>
              </div>
            </div>
            <div className="absolute bottom-[9%] left-[3%] flex items-center gap-3 rounded-2xl border border-white/10 bg-[#10110f]/90 p-3.5 shadow-xl backdrop-blur-xl">
              <span className="grid size-9 place-items-center rounded-xl bg-lime-200/10 text-lime-200"><Icon name="sparkle" /></span>
              <span><span className="block text-xs font-medium">Onchain collection</span><span className="mt-1 block text-[10px] text-zinc-500">Built on Base</span></span>
            </div>
            <div className="absolute right-[1%] top-[18%] size-16 rounded-full border border-lime-200/15 bg-lime-200/[0.04] blur-[1px]" />
            <span className="absolute right-[10%] bottom-[15%] text-[10px] font-mono tracking-[.22em] text-zinc-500">001 — 999</span>
          </div>
        </div>
      </section>

      <div className="border-y border-white/[0.07] bg-white/[0.02]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 py-5 text-[10px] font-medium tracking-[.22em] text-zinc-500 sm:justify-between sm:px-8">
          <span>IMAGINED WITH INTENTION</span><span className="hidden size-1 rounded-full bg-lime-200/50 sm:block" />
          <span>OWNED ONCHAIN</span><span className="hidden size-1 rounded-full bg-lime-200/50 sm:block" />
          <span>MADE FOR THE CURIOUS</span><span className="hidden size-1 rounded-full bg-lime-200/50 sm:block" />
          <span>THE MONARCH GUILD</span>
        </div>
      </div>

      <section id="collection" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Badge variant="outline" className="mb-4">THE COLLECTION</Badge>
            <h2 className="max-w-xl text-3xl font-medium tracking-[-.045em] sm:text-5xl">Artifacts from a world just beyond ours.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-zinc-500">A first look at the visual language of the guild. These pieces are concept artwork, not live token listings.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {previews.map((item, index) => <ArtworkCard key={item.kind} item={item} index={index} />)}
        </div>
      </section>

      <section id="story" className="relative border-y border-white/[0.07] bg-[#10110e]">
        <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-lime-200/20 to-transparent" />
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="mb-10 grid gap-5 md:grid-cols-[.8fr_1.2fr] md:items-end">
            <div>
              <Badge variant="lime" className="mb-4">COLLECT WITH MEANING</Badge>
              <h2 className="text-3xl font-medium tracking-[-.045em] sm:text-5xl">More than an image.<br /><span className="text-zinc-500">A piece of the story.</span></h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-zinc-400 md:justify-self-end">The Guild brings collectible art and transparent ownership together. Start with a wallet, mint or collect an artifact, and trade through a simple fixed-price marketplace.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {features.map((feature) => <SpotlightFeature key={feature.number} feature={feature} />)}
          </div>
        </div>
      </section>

      <section id="contracts" className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <Badge variant="outline" className="mb-4">LIVE DEPLOYMENT</Badge>
            <h2 className="max-w-lg text-3xl font-medium tracking-[-.045em] sm:text-5xl">The guild is live on Base.</h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-zinc-400">The contracts are deployed to Base Sepolia for testing. Explore each address on BaseScan and inspect the onchain activity.</p>
            <a href="https://sepolia.basescan.org/" target="_blank" rel="noreferrer" className={buttonVariants({ className: "mt-7 h-12 rounded-full px-6" })}>
              Open BaseScan <Icon name="arrow-up" className="size-4" />
            </a>
          </div>
          <Card className="overflow-hidden border-white/10 bg-[#11120f] p-2">
            <CardContent className="p-4 sm:p-6">
              <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-[#155eef]/15 text-blue-300"><Icon name="globe" /></span><span><span className="block text-sm font-medium">Base Sepolia</span><span className="mt-1 block text-xs text-zinc-500">Ethereum L2 · Testnet</span></span></div>
                <Badge variant="lime">CHAIN ID 84532</Badge>
              </div>
              <div className="grid gap-3">
                <ContractAddress label="NFT collection · ERC-721" address={nftAddress} />
                <ContractAddress label="Fixed-price marketplace" address={marketplaceAddress} />
              </div>
              <p className="mt-5 flex items-center gap-2 text-xs text-zinc-500"><span className="size-1.5 rounded-full bg-lime-300" /> Testnet only — use Base Sepolia ETH to interact.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8 sm:pb-32">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-lime-100/10 bg-[#141710] px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="cta-glow pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-2xl">
            <span className="mx-auto mb-5 grid size-12 place-items-center rounded-2xl border border-lime-100/15 bg-lime-100/[0.06] text-lime-200"><Icon name="sparkle" className="size-5" /></span>
            <p className="mb-3 text-xs font-medium tracking-[.22em] text-lime-200">YOUR STORY, YOUR ARTIFACT</p>
            <h2 className="text-3xl font-medium tracking-[-.045em] sm:text-5xl">Find your place in the guild.</h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-zinc-400">Explore the collection direction and follow the onchain launch as it takes shape.</p>
            <a href="#collection" className={buttonVariants({ variant: "secondary", className: "mt-7 h-12 rounded-full px-6" })}>Explore the collection <Icon name="arrow" className="size-4" /></a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-7 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <a href="#top" className="flex items-center gap-2.5 text-zinc-300"><BrandMark /><span className="font-medium tracking-[.14em]">THE MONARCH GUILD</span></a>
          <span>Digital artifacts for a world without borders.</span>
          <a href="#contracts" className="inline-flex items-center gap-1.5 transition hover:text-lime-200">Built on Base <Icon name="arrow-up" className="size-3" /></a>
        </div>
      </footer>
    </main>
  )
}

export default PublicPage
