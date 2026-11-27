import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import ThemeToggle from "@/components/theme-toggle"

type AuthLayoutProps = {
  children: ReactNode
  alternateHref: "/login" | "/signup"
  alternateLabel: string
  alternateAction: string
}

function BrandMark() {
  return (
    <span className="grid size-9 place-items-center rounded-xl border border-red-400/20 bg-red-400/10 text-red-400">
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none">
        <path d="m4 8 4 3 4-6 4 6 4-3-2 11H6L4 8Z" fill="currentColor" />
        <path d="M7 16h10" stroke="#11120f" strokeWidth="1.4" />
      </svg>
    </span>
  )
}

export function AuthLayout({ children, alternateHref, alternateLabel, alternateAction }: AuthLayoutProps) {
  return (
    <main className="auth-page relative isolate flex min-h-svh flex-col overflow-hidden bg-[#0b0c0a] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="auth-glow absolute -right-48 -top-56 size-[44rem] rounded-full" />
        <div className="auth-glow auth-glow-secondary absolute -bottom-64 -left-56 size-[38rem] rounded-full" />
        <div className="absolute inset-0 opacity-[0.11] [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      </div>

      <header className="mx-auto flex h-[76px] w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="/" className="flex items-center gap-3" aria-label="The Monarch Guild home">
          <BrandMark />
          <span className="text-sm font-semibold tracking-[0.14em]">MONARCH<span className="text-red-400">.</span></span>
        </a>
        <div className="flex items-center gap-2">
          <ThemeToggle iconOnly className="rounded-full" />
          <a href={alternateHref} className={buttonVariants({ variant: "ghost", size: "sm", className: "rounded-full px-4" })}>
            {alternateLabel} <span className="text-zinc-500">{alternateAction}</span>
          </a>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_.82fr] lg:gap-20 lg:py-16">
        <section className="relative hidden min-h-[570px] flex-col justify-between overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#11130f]/75 p-9 lg:flex xl:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_40%,rgba(239,68,68,.11),transparent_42%)]" />
          <div className="relative">
            <Badge variant="red" className="gap-2"><span className="size-1.5 rounded-full bg-red-500" /> A WORLD OF COLLECTIBLE STORIES</Badge>
            <h1 className="mt-7 max-w-lg text-5xl font-medium leading-[1.03] tracking-[-.06em] xl:text-6xl">Find your place in the <span className="text-red-400">guild.</span></h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-zinc-400">A home for distinctive digital artifacts, transparent ownership, and collectors who value the story behind the art.</p>
          </div>

          <div className="auth-orbit-art relative mx-auto my-7 grid size-64 place-items-center xl:size-72" aria-hidden="true">
            <span className="absolute inset-0 rounded-full border border-red-300/15" />
            <span className="absolute inset-6 rounded-full border border-red-300/10 [transform:rotateX(68deg)_rotate(-24deg)]" />
            <span className="absolute inset-1 rounded-full border border-dashed border-white/10 [transform:rotate(35deg)]" />
            <span className="absolute left-3 top-14 size-3 rounded-full bg-red-400 shadow-[0_0_24px_8px_rgba(239,68,68,.35)]" />
            <span className="absolute bottom-9 right-7 size-2 rounded-full bg-fuchsia-200 shadow-[0_0_18px_6px_rgba(232,178,255,.25)]" />
            <span className="relative grid size-32 place-items-center rounded-[36px] border border-red-300/20 bg-gradient-to-br from-red-300/20 via-[#253223] to-[#11130f] shadow-[0_20px_90px_rgba(173,214,99,.14)] xl:size-36">
              <svg viewBox="0 0 80 80" className="size-20 text-red-300" fill="none">
                <path d="m13 31 14 11L40 18l13 24 14-11-7 35H20l-7-35Z" fill="currentColor" fillOpacity=".85" />
                <path d="m27 42 13-24 13 24M25 55h30" stroke="#172016" strokeWidth="2" />
                <circle cx="40" cy="17" r="4" fill="#f4ffd8" />
              </svg>
            </span>
          </div>

          <div className="relative flex items-center justify-between border-t border-white/10 pt-5 text-xs text-zinc-500">
            <span>Built on Base</span>
            <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-red-500" /> Sepolia testnet</span>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[440px]">
          <div className="mb-7 lg:hidden">
            <Badge variant="red">THE MONARCH GUILD</Badge>
          </div>
          {children}
          <p className="mt-7 text-center text-xs leading-5 text-zinc-600">Secure email authentication powered by Firebase.</p>
        </section>
      </div>

      <footer className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 pb-6 text-[11px] text-zinc-600 sm:px-8">
        <span>© 2026 The Monarch Guild</span>
        <a href="https://sepolia.basescan.org/" target="_blank" rel="noreferrer" className="transition hover:text-zinc-300">Onchain on Base ↗</a>
      </footer>
    </main>
  )
}
