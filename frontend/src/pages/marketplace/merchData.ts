export type MerchItem = {
  id: string
  type: "merch"
  name: string
  category: string
  price: number
  currency: "USD"
  design: "hoodie" | "tee" | "cap" | "jacket"
  description: string
  sizes: string[]
  stockLabel: string
  imageFront: string
  imageBack: string
}

/** Hero banner for the merch shop */
export const MERCH_HERO_IMAGE =
  "https://res.cloudinary.com/crvleqfw/image/upload/v1795758315/Full_Merch_Overview.png"

export const merchItems: MerchItem[] = [
  {
    id: "guild-hoodie",
    type: "merch",
    name: "Guild heavyweight hoodie",
    category: "Apparel",
    price: 78,
    currency: "USD",
    design: "hoodie",
    description:
      "A heavyweight fleece hoodie finished with the Monarch Guild mark. Built for cooler nights and long studio sessions. Front and back art included.",
    sizes: ["S", "M", "L", "XL", "2XL"],
    stockLabel: "Made to order",
    imageFront: "https://res.cloudinary.com/crvleqfw/image/upload/v1795758313/Hoodie_Front.png",
    imageBack: "https://res.cloudinary.com/crvleqfw/image/upload/v1795758313/Hoodie_Back.png",
  },
  {
    id: "monarch-tee",
    type: "merch",
    name: "Monarch crest tee",
    category: "Apparel",
    price: 38,
    currency: "USD",
    design: "tee",
    description:
      "Soft cotton, relaxed fit, and the Guild crest. An everyday piece from The Monarch Guild. Front and back designs shown.",
    sizes: ["S", "M", "L", "XL", "2XL"],
    stockLabel: "In stock",
    imageFront: "https://res.cloudinary.com/crvleqfw/image/upload/v1795758313/TShirt_Front.png",
    imageBack: "https://res.cloudinary.com/crvleqfw/image/upload/v1795758313/TShirt_Back.png",
  },
  {
    id: "guild-cap",
    type: "merch",
    name: "Guild six-panel cap",
    category: "Accessories",
    price: 32,
    currency: "USD",
    design: "cap",
    description:
      "A low-profile six-panel cap with an adjustable strap and the Guild insignia. Front and back views included.",
    sizes: ["One size"],
    stockLabel: "In stock",
    imageFront: "https://res.cloudinary.com/crvleqfw/image/upload/v1795758313/Cap_Front.png",
    imageBack: "https://res.cloudinary.com/crvleqfw/image/upload/v1795758313/Cap_Back.png",
  },
  {
    id: "guild-jacket",
    type: "merch",
    name: "Monarch Guild jacket",
    category: "Apparel",
    price: 120,
    currency: "USD",
    design: "jacket",
    description:
      "A structured jacket carrying the full Guild identity. Premium weight, clean silhouette, front and back artwork.",
    sizes: ["S", "M", "L", "XL", "2XL"],
    stockLabel: "Made to order",
    imageFront: "https://res.cloudinary.com/crvleqfw/image/upload/v1795758313/Jacket_Front.png",
    imageBack: "https://res.cloudinary.com/crvleqfw/image/upload/v1795758313/Jacket_Back.png",
  },
]
