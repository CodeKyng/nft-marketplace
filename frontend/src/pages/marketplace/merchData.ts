export type MerchItem = {
  id: string
  type: "merch"
  name: string
  category: string
  price: number
  currency: "USD"
  color: string
  accent: string
  design: "hoodie" | "tee" | "cap" | "print"
  description: string
  sizes: string[]
  stockLabel: string
}

export const merchItems: MerchItem[] = [
  { id: "guild-hoodie", type: "merch", name: "Guild heavyweight hoodie", category: "Apparel", price: 78, currency: "USD", color: "#211b1b", accent: "#dc2626", design: "hoodie", description: "A heavyweight fleece hoodie finished with the Monarch Guild mark. Built for cooler nights and long studio sessions.", sizes: ["S", "M", "L", "XL", "2XL"], stockLabel: "Made to order" },
  { id: "monarch-tee", type: "merch", name: "Monarch crest tee", category: "Apparel", price: 38, currency: "USD", color: "#e7e2dc", accent: "#b91c1c", design: "tee", description: "Soft cotton, relaxed fit, and a small embroidered crest. An everyday piece from the Guild.", sizes: ["S", "M", "L", "XL", "2XL"], stockLabel: "In stock" },
  { id: "guild-cap", type: "merch", name: "Guild six-panel cap", category: "Accessories", price: 32, currency: "USD", color: "#571b22", accent: "#fca5a5", design: "cap", description: "A low-profile six-panel cap with an adjustable strap and the Guild insignia stitched up front.", sizes: ["One size"], stockLabel: "In stock" },
  { id: "first-crown-print", type: "merch", name: "The First Crown art print", category: "Art prints", price: 54, currency: "USD", color: "#e8ded0", accent: "#8f252d", design: "print", description: "A museum-grade archival print of The First Crown, ready to bring a little Guild mythology to your wall.", sizes: ["A3", "A2"], stockLabel: "Made to order" },
]
