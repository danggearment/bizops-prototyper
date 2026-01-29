import { z } from "zod"

// Pricing Source Enum
export enum PricingSource {
  INHERITED = "inherited",
  OVERRIDE = "override",
}

// Product Status Enum
export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

// Pricing Tier Enum
export enum PricingTier {
  BRONZE = "bronze",
  SILVER = "silver",
  GOLD = "gold",
  PLATINUM = "platinum",
}

// Search/Filter Schema for Seller Pricing Engine
export const SellerPricingSearchSchema = z.object({
  page: z.number().default(1),
  limit: z.number().default(50),
  search: z.string().optional(),
  productType: z.string().optional(),
  pricingSource: z.nativeEnum(PricingSource).optional(),
  tier: z.nativeEnum(PricingTier).optional(),
  lastUpdated: z.string().optional(),
  sortBy: z.array(z.string()).optional(),
  sortDirection: z.array(z.enum(["asc", "desc"])).optional(),
})

export type SellerPricingSearchType = z.infer<typeof SellerPricingSearchSchema>

// Product Type for the listing
export interface SellerProduct {
  productId: string
  productName: string
  productCode: string
  productImage: string
  productType: string
  rspMin: number
  rspMax: number
  totalVariants: number
  overrideCount: number
  status: ProductStatus
  lastUpdated: Date
  variants: SellerVariant[]
}

// Variant Type
export interface SellerVariant {
  variantId: string
  sku: string
  options: Record<string, string> // e.g., { Color: "Red", Size: "M" }
  rsp: number
  pricingSource: PricingSource
  tierDiscount: number // percentage
  customDiscount: number // percentage
  fixedAddons: number // fixed charges
  finalSellerPrice: number
  status: ProductStatus
}

// Summary Stats Type
export interface PricingSummaryStats {
  totalProducts: number
  totalVariants: number
  inheritedPricing: number
  pricingOverrides: number
}
