import { merchItems } from "./merchData"

export const storeItems = merchItems
export function findStoreItem(id: string) { return storeItems.find((item) => item.id === id) }

const CART_KEY = "monarch-market-cart"
export function getCart(): string[] {
  try { return JSON.parse(localStorage.getItem(CART_KEY) ?? "[]") as string[] } catch { return [] }
}
export function saveCart(ids: string[]) {
  localStorage.setItem(CART_KEY, JSON.stringify([...new Set(ids)]))
  window.dispatchEvent(new Event("monarch-cart-change"))
}
export function addToCart(id: string, variant?: string) { saveCart([...getCart(), variant ? `${id}::${variant}` : id]) }
export function removeFromCart(id: string) { saveCart(getCart().filter((item) => item !== id)) }
