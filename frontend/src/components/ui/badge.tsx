import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "outline" | "red"
}

const variants = {
  default: "border-transparent bg-white/10 text-zinc-200",
  outline: "border-white/15 bg-transparent text-zinc-300",
  red: "border-primary/20 bg-primary/10 text-primary",
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide",
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
