import { useEffect, useState, type MouseEvent } from "react"
import { useAuth } from "@/auth/AuthProvider"
import LoginPage from "@/pages/auth/LoginPage"
import SignupPage from "@/pages/auth/SignupPage"
import PublicPage from "@/pages/publicPage/PublicPage"
import MarketplaceHome from "@/pages/marketplace/MarketplaceHome"
import Shop from "@/pages/marketplace/Shop"
import ProductDetail from "@/pages/marketplace/ProductDetail"
import Cart from "@/pages/marketplace/Cart"
import MyCollection from "@/pages/marketplace/MyCollection"
import Gallery from "@/pages/marketplace/Gallery"
import MerchShop from "@/pages/marketplace/MerchShop"
import MerchDetail from "@/pages/marketplace/MerchDetail"

function routeFromPath(pathname: string) {
  if (["/login", "/signup", "/marketplace", "/shop", "/gallery", "/merch", "/cart", "/collection"].includes(pathname)) {
    return pathname
  }
  if (/^\/nft\/[^/]+$/.test(pathname)) return pathname
  if (/^\/merch\/[^/]+$/.test(pathname)) return pathname

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

    const redirectTo = user && (route === "/login" || route === "/signup") ? "/marketplace" : null

    if (!redirectTo) return
    window.history.replaceState({}, "", redirectTo)
    window.dispatchEvent(new PopStateEvent("popstate"))
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
  const productRoute = route.startsWith("/nft/")
  const productId = productRoute ? decodeURIComponent(route.slice("/nft/".length)) : ""
  const merchRoute = route.startsWith("/merch/")
  const merchId = merchRoute ? decodeURIComponent(route.slice("/merch/".length)) : ""

  return (
    <div className="min-h-svh" onClick={handleNavigation}>
      {waitingForAuthRedirect || (loading && (route === "/login" || route === "/signup")) ? (
        <main className="grid min-h-svh place-items-center bg-[#0b0c0a] text-sm text-zinc-400" role="status">Loading your session...</main>
      ) : route === "/login" ? <LoginPage />
        : route === "/signup" ? <SignupPage />
          : route === "/marketplace" ? <MarketplaceHome />
              : route === "/shop" ? <Shop />
                : route === "/gallery" ? <Gallery />
                  : route === "/merch" ? <MerchShop />
                  : route === "/cart" ? <Cart />
                  : route === "/collection" ? <MyCollection />
                    : productRoute ? <ProductDetail itemId={productId} />
                      : merchRoute ? <MerchDetail itemId={merchId} />
                      : <PublicPage />}
    </div>
  )
}

export default App
