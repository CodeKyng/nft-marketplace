import type { HTMLAttributes, ImgHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export function Avatar({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("relative inline-flex size-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/[.06]", className)} {...props} />
}

export function AvatarImage({ className, alt = "", ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  return <img className={cn("aspect-square size-full object-cover", className)} alt={alt} {...props} />
}

export function AvatarFallback({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("grid size-full place-items-center bg-red-400/10 text-sm font-semibold text-red-300", className)} {...props} />
}
