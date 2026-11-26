import { useEffect, useState, type MouseEvent } from "react"
import { useAuth } from "@/auth/AuthProvider"
import AccountPage from "@/pages/auth/AccountPage"
import LoginPage from "@/pages/auth/LoginPage"
import SignupPage from "@/pages/auth/SignupPage"
import PublicPage from "@/pages/publicPage/PublicPage"

function routeFromPath(pathname: string) {
  if (pathname === "/login" || pathname === "/signup" || pathname === "/account") {
    return pathname
  }

  return "/"
}

export function App() {
  const [route, setRoute] = useState(() => routeFromPath(window.location.pathname))
  const { user, loading } = useAuth()

  useEffect(() => {
    const handlePopState = () => setRoute(routeFromPath(window.location.pathname))
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  useEffect(() => {
    if (loading) return

    const redirectTo = user && (route === "/login" || route === "/signup")
      ? "/account"
      : !user && route === "/account"
        ? "/login"
        : null

    if (!redirectTo) return
    window.history.replaceState({}, "", redirectTo)
    setRoute(redirectTo)
  }, [loading, route, user])

  function handleNavigation(event: MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }

    const target = event.target
    if (!(target instanceof Element)) return

    const anchor = target.closest("a")
    if (!anchor || anchor.target === "_blank") return

    const destination = new URL(anchor.href, window.location.href)
    if (destination.origin !== window.location.origin) return

    const nextRoute = routeFromPath(destination.pathname)
    if (destination.pathname !== "/" && nextRoute === "/") return
    if (destination.hash && destination.pathname === window.location.pathname) return

    event.preventDefault()
    if (destination.pathname !== window.location.pathname) {
      window.history.pushState({}, "", `${destination.pathname}${destination.search}${destination.hash}`)
      setRoute(nextRoute)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else if (destination.hash) {
      document.querySelector(destination.hash)?.scrollIntoView({ behavior: "smooth" })
    }
  }

  const waitingForAuthRedirect = !loading && user !== null && (route === "/login" || route === "/signup")
  const accountRoute = route === "/account"

  return (
    <div className="min-h-svh" onClick={handleNavigation}>
      {accountRoute && (loading || !user) || waitingForAuthRedirect ? (
        <main className="grid min-h-svh place-items-center bg-[#0b0c0a] text-sm text-zinc-400" role="status">Loading your account...</main>
      ) : route === "/login" ? <LoginPage /> : route === "/signup" ? <SignupPage /> : accountRoute ? <AccountPage /> : <PublicPage />}
    </div>
  )
}

export default App
