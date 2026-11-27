import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useAuth } from "@/auth/AuthProvider"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ThemeToggle from "@/components/theme-toggle"
import { getAuthErrorMessage, signOutAccount } from "@/lib/firebase"
import { cn } from "@/lib/utils"
import { getCart } from "./marketplaceData"

export function MarketIcon({ name, className }: { name: "crown" | "arrow" | "cart" | "search" | "sparkle" | "grid" | "user" | "back" | "shirt" | "settings"; className?: string }) {
  const common = { className: cn("size-4", className), viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const }
  switch (name) {
    case "crown": return <svg {...common}><path d="m3 8 5 3 4-7 4 7 5-3-2 11H5L3 8Z"/><path d="M7 16h10"/></svg>
    case "arrow": return <svg {...common}><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
    case "cart": return <svg {...common}><path d="M3 4h2l2.2 10.3a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.5L22 8H6"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>
    case "search": return <svg {...common}><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></svg>
    case "sparkle": return <svg {...common}><path d="m12 3 2 6 6 3-6 2-2 7-2-7-6-2 6-3 2-6Z"/></svg>
    case "grid": return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
    case "user": return <svg {...common}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
    case "back": return <svg {...common}><path d="m15 18-6-6 6-6M9 12h12"/></svg>
    case "shirt": return <svg {...common}><path d="m16 4 5 3-3 5-3-2v10H9V10l-3 2-3-5 5-3c.8 2 2.2 3 4 3s3.2-1 4-3Z"/></svg>
    case "settings": return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.6.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.6-.9l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.9l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.6-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.6.9l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.8Z" transform="translate(-1 -1) scale(1.08)"/></svg>
  }
}

export function MarketLayout({ children, active }: { children: ReactNode; active: "home" | "shop" | "gallery" | "merch" | "cart" | "collection" }) {
  const { user } = useAuth()
  const [cartCount, setCartCount] = useState(() => getCart().length)
  const [signingOut, setSigningOut] = useState(false)
  const [settingsNotice, setSettingsNotice] = useState("")
  const displayName = user?.displayName?.trim() || user?.email?.split("@")[0] || "Guest collector"
  const initials = displayName.split(/[\s._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "G"
  async function handleSignOut() {
    setSigningOut(true)
    setSettingsNotice("")
    try { await signOutAccount() } catch (error) { setSettingsNotice(getAuthErrorMessage(error)) } finally { setSigningOut(false) }
  }
  useEffect(() => {
    const update = () => setCartCount(getCart().length)
    window.addEventListener("monarch-cart-change", update)
    window.addEventListener("storage", update)
    return () => { window.removeEventListener("monarch-cart-change", update); window.removeEventListener("storage", update) }
  }, [])

  const links = [
    { href: "/marketplace", label: "Marketplace home", icon: "crown" as const, active: active === "home" },
    { href: "/shop", label: "NFT shop", icon: "cart" as const, active: active === "shop" },
    { href: "/gallery", label: "NFT gallery", icon: "grid" as const, active: active === "gallery" },
    { href: "/merch", label: "Guild merch", icon: "shirt" as const, active: active === "merch" },
    { href: "/cart", label: "Cart", icon: "cart" as const, active: active === "cart", count: cartCount },
    { href: "/collection", label: "My collection", icon: "user" as const, active: active === "collection" },
  ]
  const brand = <a href="/marketplace" className="flex shrink-0 items-center gap-3"><span className="grid size-9 place-items-center rounded-xl border border-red-400/20 bg-red-400/10 text-red-400"><MarketIcon name="crown"/></span><span className="text-sm font-semibold tracking-[.14em]">MONARCH<span className="text-red-400">.</span></span></a>
  const userLink = <a href={user ? "/collection" : "/login"} className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/[.08] bg-white/[.035] p-3 transition hover:border-red-300/20 hover:bg-white/[.06]" aria-label={user ? `Collection for ${displayName}` : "Sign in"}>
    <Avatar className="size-10 border-red-300/20">{user?.photoURL ? <AvatarImage src={user.photoURL} alt={displayName}/> : <AvatarFallback>{initials}</AvatarFallback>}</Avatar>
    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-zinc-100">{displayName}</span><span className="mt-0.5 block truncate text-[11px] text-zinc-500">{user?.email ?? "Sign in to your account"}</span></span><MarketIcon name="arrow" className="size-3.5 shrink-0 text-zinc-500"/>
  </a>
  const compactUserLink = <a href={user ? "/collection" : "/login"} aria-label={user ? `Collection for ${displayName}` : "Sign in"} className="grid size-9 place-items-center overflow-hidden rounded-full border border-red-300/20 bg-red-300/10 text-sm font-semibold text-red-300">{user?.photoURL ? <img src={user.photoURL} alt="" className="size-full object-cover"/> : initials}</a>

  return <div className="min-h-svh bg-[#0b0c0a] text-white lg:flex">
      <aside className="sticky top-0 z-30 hidden h-svh w-[264px] shrink-0 flex-col overflow-y-auto overscroll-contain border-r border-white/[.07] bg-[#0d0e0b] px-4 py-6 lg:flex">
      <div className="px-2">{brand}</div>
      <div className="mt-10 px-3 text-[10px] font-semibold tracking-[.2em] text-zinc-600">MARKETPLACE</div>
      <nav className="mt-3 flex flex-col gap-1" aria-label="Marketplace pages">{links.map((link) => <a key={link.href} href={link.href} aria-current={link.active ? "page" : undefined} className={cn("flex h-11 items-center gap-3 rounded-xl px-3 text-sm transition", link.active ? "bg-red-400/[.09] font-medium text-red-300" : "text-zinc-400 hover:bg-white/[.04] hover:text-white")}><MarketIcon name={link.icon}/><span className="flex-1">{link.label}</span>{"count" in link && link.count! > 0 && <span className="grid min-w-5 place-items-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-950">{link.count}</span>}</a>)}</nav>
      <div className="mt-8 rounded-2xl border border-white/[.07] bg-white/[.025] p-4"><Badge variant="outline" className="gap-2"><span className="size-1.5 rounded-full bg-red-500"/>BASE SEPOLIA</Badge><p className="mt-3 text-xs leading-5 text-zinc-500">Marketplace preview. Wallet transactions are not enabled yet.</p></div>
      <ThemeToggle className="mt-5 w-full justify-start rounded-xl"/>
      <div className="mt-auto border-t border-white/[.07] pt-4"><p className="mb-3 px-2 text-[10px] font-semibold tracking-[.2em] text-zinc-600">ACCOUNT</p>{userLink}</div>
    </aside>
    <div className="min-w-0 flex-1">
      <header className="sticky top-0 z-20 border-b border-white/[.07] bg-[#0b0c0a]/90 backdrop-blur-xl"><div className="flex min-h-[68px] items-center justify-between gap-3 px-4 sm:px-8 lg:px-9"><div className="lg:hidden">{brand}</div><div className="hidden items-center gap-2 text-xs text-zinc-500 lg:flex"><span className="size-1.5 rounded-full bg-red-500"/>Preview marketplace <span className="text-zinc-700">/</span> Base Sepolia</div><div className="flex min-w-0 items-center gap-1 sm:gap-2"><ThemeToggle iconOnly className="rounded-full"/><details className="relative"><summary aria-label="Open settings" title="Settings" className={cn(buttonVariants({ variant: "ghost", size: "icon", className: "list-none rounded-full [&::-webkit-details-marker]:hidden" }), "cursor-pointer")}><MarketIcon name="settings"/></summary><div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-white/10 bg-[#11120f] p-3 shadow-2xl"><p className="px-3 pb-2 text-[10px] font-semibold tracking-[.18em] text-zinc-500">SETTINGS</p>{settingsNotice && <p role="alert" className="mb-2 rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{settingsNotice}</p>}<ThemeToggle className="w-full justify-start rounded-xl"/><div className="my-2 border-t border-white/[.08]"/>{user ? <><a href="/collection" className="block rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[.05]">My collection</a><a href="/marketplace" className="block rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[.05]">Marketplace home</a><button type="button" onClick={handleSignOut} disabled={signingOut} className="w-full rounded-xl px-3 py-2.5 text-left text-sm text-zinc-400 transition hover:bg-white/[.05] hover:text-white disabled:opacity-50">{signingOut ? "Signing out…" : "Sign out"}</button></> : <><a href="/login" className="block rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[.05]">Sign in</a><a href="/signup" className="block rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/[.05]">Create account</a></>}</div></details><a href="/cart" aria-label={`Shopping cart, ${cartCount} items`} className={buttonVariants({ variant: "ghost", size: "icon", className: "relative rounded-full" })}><MarketIcon name="cart"/>{cartCount > 0 && <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-red-500 text-[9px] font-bold text-zinc-950">{cartCount}</span>}</a><div className="hidden lg:block">{userLink}</div><div className="lg:hidden">{compactUserLink}</div></div></div></header>
      <div className="border-b border-white/[.06] px-4 py-2 lg:hidden"><nav className="flex gap-1 overflow-x-auto" aria-label="Marketplace pages">{links.map((link) => <a key={link.href} href={link.href} className={cn("flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs", link.active ? "bg-red-400/[.09] text-red-300" : "text-zinc-400 hover:bg-white/[.04]")}><MarketIcon name={link.icon}/>{link.label}</a>)}</nav></div>
      {children}
      <footer className="border-t border-white/[.07]"><div className="flex flex-wrap items-center justify-between gap-3 px-5 py-6 text-xs text-zinc-600 sm:px-8 lg:px-9"><a href="/marketplace" className="flex items-center gap-2 text-zinc-400"><MarketIcon name="crown" className="text-red-400"/>THE MONARCH GUILD</a><span>Preview marketplace · Base Sepolia</span><a href="/collection" className="transition hover:text-zinc-300">Your collection</a></div></footer>
    </div>
  </div>
}

export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="flex flex-wrap items-end justify-between gap-5"><div><Badge variant="red" className="mb-3">{eyebrow}</Badge><h1 className="text-3xl font-medium tracking-[-.05em] sm:text-4xl">{title}</h1><p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">{description}</p></div>{action}</div>
}
