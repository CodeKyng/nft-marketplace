import type { InputHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export function Input({ className, type, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-white/10 bg-white/[0.035] px-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus-visible:border-lime-200/50 focus-visible:ring-2 focus-visible:ring-lime-200/10 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  )
}
