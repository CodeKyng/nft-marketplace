import { useEffect, useState } from "react"
import { reload } from "firebase/auth"
import { useAuth } from "@/auth/AuthProvider"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getAuthErrorMessage, resendVerification, signOutAccount } from "@/lib/firebase"
import { cn } from "@/lib/utils"

type ArtworkKind = "monarch" | "orbit" | "sun" | "bloom"
type Collectible = { name: string; artist: string; price: string; kind: ArtworkKind; tag: string; number: string }

const collectibles: Collectible[] = [
  { name: "The First Crown", artist: "Monarch Guild", price: "0.42 ETH", kind: "monarch", tag: "FEATURED", number: "001" },
  { name: "Orbit of Kin", artist: "Aster Vale", price: "0.28 ETH", kind: "orbit", tag: "COSMIC", number: "024" },
  { name: "Heir of Dawn", artist: "Monarch Guild", price: "0.36 ETH", kind: "sun", tag: "1 OF 1", number: "008" },
  { name: "Soft Geometry", artist: "Mira Sol", price: "0.19 ETH", kind: "bloom", tag: "NEW", number: "013" },
]

function Icon({ name, className }: { name: "grid" | "compass" | "heart" | "plus" | "search" | "arrow" | "wallet" | "menu" | "close" | "external" | "crown"; className?: string }) {
  const props = { className: cn("size-4", className), viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const }
  switch (name) {
    case "grid": return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
    case "compass": return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.3 4.7-4.7 2.3 2.3-4.7 4.7-2.3Z"/></svg>
    case "heart": return <svg {...props}><path d="M20.8 8.8c0 4.3-8.8 10-8.8 10s-8.8-5.7-8.8-10A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z"/></svg>
    case "plus": return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>
    case "search": return <svg {...props}><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></svg>
    case "arrow": return <svg {...props}><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
    case "wallet": return <svg {...props}><rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 9h18m-5 5h.01M7 5V3h11"/></svg>
    case "menu": return <svg {...props}><path d="M4 6h16M4 12h16M4 18h16"/></svg>
    case "close": return <svg {...props}><path d="m6 6 12 12M18 6 6 18"/></svg>
    case "external": return <svg {...props}><path d="M14 4h6v6m0-6-9 9"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/></svg>
    case "crown": return <svg {...props}><path d="m3 8 5 3 4-7 4 7 5-3-2 11H5L3 8Z"/><path d="M7 16h10"/></svg>
  }
}

function Artwork({ kind }: { kind: ArtworkKind }) {
  const colors = {
    monarch: ["#d9ff78", "#477f68", "#111a18"], orbit: ["#ffc5ff", "#665be7", "#16152d"],
    sun: ["#ffe39a", "#cf665c", "#291a1c"], bloom: ["#f9b6d9", "#6850aa", "#1e1830"],
  }[kind]
  return <div className={cn("relative isolate grid aspect-[.92] place-items-center overflow-hidden", `art-${kind}`)} style={{ background: `radial-gradient(circle at 50% 42%, ${colors[1]}, ${colors[2]} 70%)` }}>
    <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:28px_28px]" />
    <span className="absolute size-[72%] rounded-full border border-white/20" />
    <span className="absolute size-[58%] rounded-full border border-dashed border-white/20" />
    {kind === "monarch" && <svg viewBox="0 0 160 160" className="relative w-[58%] drop-shadow-[0_8px_30px_rgba(0,0,0,.4)]"><path d="m25 91-12-53 37 29 30-51 30 51 37-29-12 53-13 38H38L25 91Z" fill={colors[0]}/><path d="M48 112h64l-8 23H56l-8-23Z" fill="#20271d"/><circle cx="80" cy="52" r="9" fill="#f6ffcf"/></svg>}
    {kind === "orbit" && <svg viewBox="0 0 160 160" className="relative w-[62%] drop-shadow-[0_8px_30px_rgba(0,0,0,.4)]" fill="none" stroke={colors[0]} strokeWidth="7"><ellipse cx="80" cy="80" rx="27" ry="69" transform="rotate(38 80 80)"/><ellipse cx="80" cy="80" rx="27" ry="69" transform="rotate(-38 80 80)"/><ellipse cx="80" cy="80" rx="69" ry="27"/><circle cx="80" cy="80" r="16" fill={colors[0]} stroke="none"/></svg>}
    {kind === "sun" && <svg viewBox="0 0 160 160" className="relative w-[62%] drop-shadow-[0_8px_30px_rgba(0,0,0,.4)]"><circle cx="80" cy="67" r="38" fill={colors[0]}/><circle cx="80" cy="67" r="25" fill={colors[2]}/><path d="M35 145c4-30 19-47 45-47s41 17 45 47" fill={colors[0]}/><path d="m57 104 23 27 23-27" fill="none" stroke="white" strokeOpacity=".7" strokeWidth="5"/></svg>}
    {kind === "bloom" && <svg viewBox="0 0 160 160" className="relative w-[58%] drop-shadow-[0_8px_30px_rgba(0,0,0,.4)]" fill={colors[0]}><ellipse cx="80" cy="49" rx="20" ry="37"/><ellipse cx="80" cy="111" rx="20" ry="37"/><ellipse cx="49" cy="80" rx="37" ry="20"/><ellipse cx="111" cy="80" rx="37" ry="20"/><circle cx="80" cy="80" r="14" fill="#fff1c4"/></svg>}
    <span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[.2em] text-white/55">MG / {kind.toUpperCase()}</span>
  </div>
}

function Brand() { return <a href="/" className="flex items-center gap-3" aria-label="Monarch Guild home"><span className="grid size-9 place-items-center rounded-xl border border-lime-200/20 bg-lime-200/10 text-lime-200"><Icon name="crown" /></span><span className="text-sm font-semibold tracking-[.14em]">MONARCH<span className="text-lime-200">.</span></span></a> }

export function AccountPage() {
  const { user } = useAuth()
  const [busy, setBusy] = useState(false)
  const [emailVerified, setEmailVerified] = useState(user?.emailVerified ?? false)
  const [notice, setNotice] = useState("")
  const [filter, setFilter] = useState("All items")
  const [query, setQuery] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => setEmailVerified(user?.emailVerified ?? false), [user])

  async function handleSignOut() {
    setBusy(true); setNotice("")
    try { await signOutAccount() } catch (error) { setNotice(getAuthErrorMessage(error)) } finally { setBusy(false) }
  }
  async function handleResendVerification() {
    if (!user) return
    setBusy(true); setNotice("")
    try { await resendVerification(user); setNotice("Verification email sent. Check your inbox and spam folder.") } catch (error) { setNotice(getAuthErrorMessage(error)) } finally { setBusy(false) }
  }
  async function handleRefreshVerification() {
    if (!user) return
    setBusy(true); setNotice("")
    try { await reload(user); setEmailVerified(user.emailVerified); setNotice(user.emailVerified ? "Your email is verified." : "We have not received confirmation yet. Check your inbox, then try again.") } catch (error) { setNotice(getAuthErrorMessage(error)) } finally { setBusy(false) }
  }

  const visibleCollectibles = collectibles.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()) && (filter === "All items" || item.tag === filter.toUpperCase()))
  const displayName = user?.displayName?.trim() || user?.email?.split("@")[0] || "Collector"
  const initial = displayName.charAt(0).toUpperCase()

  return <main className="min-h-svh bg-[#0b0c0a] text-white">
    <header className="sticky top-0 z-30 border-b border-white/[.07] bg-[#0b0c0a]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8">
        <Brand />
        <div className="hidden w-full max-w-md md:block"><label className="relative block"><Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search artwork or artists" aria-label="Search artwork or artists" className="h-10 w-full rounded-full border border-white/10 bg-white/[.035] pl-10 pr-4 text-sm outline-none transition placeholder:text-zinc-600 focus:border-lime-200/40" /></label></div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="hidden gap-2 sm:inline-flex"><span className="size-1.5 rounded-full bg-lime-300"/>BASE SEPOLIA</Badge>
          <Button variant="outline" size="sm" className="hidden rounded-full sm:inline-flex" onClick={() => setNotice("Wallet connection will be available when marketplace transactions are enabled.")}><Icon name="wallet"/> Connect wallet</Button>
          <button type="button" aria-label="Toggle account menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} className="grid size-10 place-items-center rounded-full border border-lime-100/20 bg-lime-100/10 text-sm font-semibold text-lime-100">{initial}</button>
          {menuOpen && <div className="absolute right-5 top-[62px] z-40 w-64 rounded-2xl border border-white/10 bg-[#151611] p-3 shadow-2xl sm:right-8"><div className="border-b border-white/10 px-3 pb-3"><p className="text-sm font-medium">{displayName}</p><p className="mt-1 truncate text-xs text-zinc-500">{user?.email}</p></div><a href="/" className="mt-2 block rounded-xl px-3 py-2 text-sm text-zinc-300 hover:bg-white/5">Visit the guild</a><Button variant="ghost" className="w-full justify-start rounded-xl" onClick={handleSignOut} disabled={busy}>{busy ? "Signing out..." : "Sign out"}</Button></div>}
        </div>
      </div>
    </header>

    <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[228px_minmax(0,1fr)]">
      <aside className="hidden min-h-[calc(100svh-72px)] border-r border-white/[.07] px-5 py-8 lg:block">
        <p className="mb-3 px-3 text-[10px] font-medium tracking-[.2em] text-zinc-600">WORKSPACE</p>
        <nav className="space-y-1" aria-label="Dashboard navigation">
          <a href="#overview" className="flex items-center gap-3 rounded-xl bg-lime-200/[.09] px-3 py-2.5 text-sm text-lime-100"><Icon name="grid"/>Overview</a>
          <a href="#marketplace" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-white/[.04] hover:text-white"><Icon name="compass"/>Explore market</a>
          <button onClick={() => setNotice("Your saved items will appear here.")} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-white/[.04] hover:text-white"><Icon name="heart"/>Favorites</button>
        </nav>
        <div className="mt-10 rounded-2xl border border-white/[.08] bg-white/[.025] p-4"><span className="grid size-9 place-items-center rounded-xl bg-lime-200/10 text-lime-200"><Icon name="crown"/></span><p className="mt-4 text-sm font-medium">Your collection starts here</p><p className="mt-1 text-xs leading-5 text-zinc-500">Find a piece that belongs in your story.</p><a href="#marketplace" className={buttonVariants({ size: "sm", className: "mt-4 w-full rounded-xl" })}>Explore NFTs <Icon name="arrow"/></a></div>
        <div className="absolute bottom-7 flex items-center gap-2 text-[11px] text-zinc-600"><span className="size-1.5 rounded-full bg-lime-300"/>Network preview · Base Sepolia</div>
      </aside>

      <div className="min-w-0 px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
        <section id="overview" className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><div className="flex items-center gap-2 text-xs text-zinc-500"><a href="/" className="transition hover:text-white">Guild</a><span>/</span><span className="text-zinc-300">Dashboard</span></div><h1 className="mt-4 text-3xl font-medium tracking-[-.05em] sm:text-4xl">Welcome back, {displayName}<span className="text-lime-200">.</span></h1><p className="mt-2 text-sm text-zinc-500">Your place to discover and collect digital artifacts.</p></div><a href="#marketplace" className={buttonVariants({ className: "rounded-full" })}><Icon name="compass"/>Explore marketplace</a></div>

          {!emailVerified && <Card className="mt-7 border-amber-200/15 bg-amber-100/[.035]"><CardContent className="flex flex-wrap items-center justify-between gap-4 p-4 sm:px-5"><div className="flex items-start gap-3"><span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-amber-200/10 text-amber-200">!</span><div><p className="text-sm font-medium text-amber-100">Verify your email address</p><p className="mt-1 text-xs leading-5 text-amber-100/60">Confirm {user?.email} to keep your account secure.</p></div></div><div className="flex gap-2"><Button size="sm" variant="outline" className="rounded-full border-amber-100/20" onClick={handleResendVerification} disabled={busy}>Resend email</Button><Button size="sm" variant="ghost" className="rounded-full text-amber-100" onClick={handleRefreshVerification} disabled={busy}>I verified</Button></div></CardContent></Card>}

          {notice && <div role="status" className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-xs leading-5 text-zinc-300"><span>{notice}</span><button type="button" aria-label="Dismiss message" onClick={() => setNotice("")} className="text-zinc-500 hover:text-white"><Icon name="close"/></button></div>}

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {[["Owned NFTs", "0", "Your collection is ready to grow"], ["Active listings", "0", "Items listed for sale"], ["Total collected", "0 ETH", "Your marketplace activity"]].map(([label, value, detail]) => <Card key={label} className="border-white/[.08] bg-[#11120f]"><CardContent className="p-5"><p className="text-xs text-zinc-500">{label}</p><p className="mt-3 text-2xl font-medium tracking-tight">{value}</p><p className="mt-1 text-xs text-zinc-600">{detail}</p></CardContent></Card>)}
          </div>

          <section id="marketplace" className="mt-12 scroll-mt-24">
            <div className="flex flex-wrap items-end justify-between gap-4"><div><Badge variant="lime" className="mb-3">CURATED FOR THE GUILD</Badge><h2 className="text-2xl font-medium tracking-[-.04em] sm:text-3xl">Discover collectibles</h2><p className="mt-2 text-sm text-zinc-500">A first look at the stories being made on Base.</p></div><a href="/#collection" className={buttonVariants({ variant: "ghost", size: "sm", className: "rounded-full" })}>View collection <Icon name="external"/></a></div>
            <div className="mt-6 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter collectibles">{["All items", "Featured", "Cosmic", "1 of 1", "New"].map((item) => <Button key={item} size="sm" variant={filter === item ? "secondary" : "outline"} onClick={() => setFilter(item)} className="rounded-full">{item}</Button>)}</div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{visibleCollectibles.map((item) => <Card key={item.name} className="group overflow-hidden border-white/[.08] bg-[#11120f] transition duration-300 hover:-translate-y-1 hover:border-lime-100/20"><div className="relative"><Artwork kind={item.kind}/><Badge variant="outline" className="absolute left-3 top-3 border-white/20 bg-black/25 text-white/80 backdrop-blur">{item.tag}</Badge><button type="button" aria-label={`Add ${item.name} to favorites`} onClick={() => setNotice(`${item.name} saved to your favorites.`)} className="absolute right-3 top-3 grid size-9 place-items-center rounded-full border border-white/15 bg-black/30 text-white/70 backdrop-blur transition hover:text-rose-200"><Icon name="heart"/></button></div><CardContent className="p-4"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-sm font-medium">{item.name}</p><p className="mt-1 truncate text-xs text-zinc-500">by {item.artist}</p></div><span className="font-mono text-[10px] text-zinc-600">#{item.number}</span></div><div className="mt-4 flex items-center justify-between border-t border-white/[.07] pt-3"><div><p className="text-[10px] text-zinc-600">PREVIEW PRICE</p><p className="mt-1 text-sm font-medium text-lime-100">{item.price}</p></div><Button variant="outline" size="sm" className="rounded-full" onClick={() => setNotice("These featured listings are a visual preview. Onchain purchases are not enabled yet.")}>View <Icon name="arrow"/></Button></div></CardContent></Card>)}</div>
            {visibleCollectibles.length === 0 && <Card className="mt-5 border-white/10 bg-[#11120f]"><CardContent className="py-12 text-center"><Icon name="search" className="mx-auto size-5 text-zinc-500"/><p className="mt-3 text-sm text-zinc-300">No collectibles match that search.</p><button className="mt-2 text-xs text-lime-200 hover:text-lime-100" onClick={() => { setQuery(""); setFilter("All items") }}>Clear filters</button></CardContent></Card>}
          </section>

          <Card className="mt-10 overflow-hidden border-lime-100/10 bg-[#141710]"><CardContent className="flex flex-wrap items-center justify-between gap-5 p-5 sm:p-7"><div className="flex items-center gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-lime-100/15 bg-lime-100/[.07] text-lime-200"><Icon name="wallet"/></span><div><p className="text-sm font-medium">Connect a wallet when you’re ready</p><p className="mt-1 text-xs leading-5 text-zinc-500">Wallet features and live marketplace listings are coming soon.</p></div></div><Button variant="outline" className="rounded-full" onClick={() => setNotice("Wallet connection will be available when marketplace transactions are enabled.")}><Icon name="wallet"/> Connect wallet</Button></CardContent></Card>
          <footer className="mt-12 flex flex-wrap justify-between gap-3 border-t border-white/[.07] pt-5 text-xs text-zinc-600"><span>© 2026 The Monarch Guild</span><span className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-lime-300"/>Previewing Base Sepolia</span><button onClick={handleSignOut} disabled={busy} className="transition hover:text-zinc-300">{busy ? "Signing out…" : "Sign out"}</button></footer>
        </section>
      </div>
    </div>
  </main>
}

export default AccountPage
