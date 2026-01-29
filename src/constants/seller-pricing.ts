import {
  PricingSource,
  PricingTier,
  ProductStatus,
} from "@/schemas/schemas/seller-pricing"

// Status Labels
export const ProductStatusLabel: Record<ProductStatus, string> = {
  [ProductStatus.ACTIVE]: "Active",
  [ProductStatus.INACTIVE]: "Inactive",
}

// Pricing Source Labels
export const PricingSourceLabel: Record<PricingSource, string> = {
  [PricingSource.INHERITED]: "Inherited",
  [PricingSource.OVERRIDE]: "Override",
}

// Pricing Tier Labels
export const PricingTierLabel: Record<PricingTier, string> = {
  [PricingTier.BRONZE]: "Bronze",
  [PricingTier.SILVER]: "Silver",
  [PricingTier.GOLD]: "Gold",
  [PricingTier.PLATINUM]: "Platinum",
}

// Pricing Tier Discount Percentages
export const PricingTierDiscount: Record<PricingTier, number> = {
  [PricingTier.BRONZE]: 0,
  [PricingTier.SILVER]: 5,
  [PricingTier.GOLD]: 10,
  [PricingTier.PLATINUM]: 15,
}

// Status Color Mapping
export const ProductStatusColor: Record<ProductStatus, string> = {
  [ProductStatus.ACTIVE]: "bg-green-100 text-green-800",
  [ProductStatus.INACTIVE]: "bg-gray-100 text-gray-800",
}

// Pricing Source Color Mapping
export const PricingSourceColor: Record<PricingSource, string> = {
  [PricingSource.INHERITED]: "bg-blue-100 text-blue-800",
  [PricingSource.OVERRIDE]: "bg-amber-100 text-amber-800",
}

// Pricing Source Tooltips
export const PricingSourceTooltip: Record<PricingSource, string> = {
  [PricingSource.INHERITED]:
    "Uses the product-level RSP. Automatically updates when the product RSP changes.",
  [PricingSource.OVERRIDE]:
    "Uses a custom price for this variant. Product-level RSP updates do not apply.",
}

// Last Updated Options
export const LastUpdatedOptions = [
  { value: "today", label: "Today" },
  { value: "last7days", label: "Last 7 days" },
  { value: "last30days", label: "Last 30 days" },
  { value: "last90days", label: "Last 90 days" },
]

// Product Type Options (mock data - should come from API)
export const ProductTypeOptions = [
  { value: "t-shirt", label: "T-Shirt" },
  { value: "hoodie", label: "Hoodie" },
  { value: "mug", label: "Mug" },
  { value: "poster", label: "Poster" },
  { value: "phone-case", label: "Phone Case" },
  { value: "tote-bag", label: "Tote Bag" },
]
