import { useEffect, useState, type MouseEvent } from "react"
import LoginPage from "@/pages/auth/LoginPage"
import SignupPage from "@/pages/auth/SignupPage"
import PublicPage from "@/pages/publicPage/PublicPage"

function routeFromPath(pathname: string) {
  if (pathname === "/login" || pathname === "/signup") {
    return pathname
  }

  return "/"
}

export function App() {
  const [route, setRoute] = useState(() => routeFromPath(window.location.pathname))

  useEffect(() => {
    const handlePopState = () => setRoute(routeFromPath(window.location.pathname))
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

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

  return (
    <div className="min-h-svh" onClick={handleNavigation}>
      {route === "/login" ? <LoginPage /> : route === "/signup" ? <SignupPage /> : <PublicPage />}
    </div>
  )
}

export default App
