import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"

export function ThemeToggle({ className, iconOnly = false }: { className?: string; iconOnly?: boolean }) {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  const nextTheme = isDark ? "light" : "dark"
  return <Button
    type="button"
    variant="ghost"
    size="sm"
    className={className}
    onClick={() => setTheme(nextTheme)}
    aria-label={`Switch to ${nextTheme} mode`}
    title={`Switch to ${nextTheme} mode`}
  >
    {isDark ? <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg> : <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 13A8.5 8.5 0 0 1 11 3.2 8.6 8.6 0 1 0 20.8 13Z"/></svg>}
    {!iconOnly && <span>{isDark ? "Light mode" : "Dark mode"}</span>}
  </Button>
}

export default ThemeToggle
