import { MarketplacePlatform } from "@/services/connect-rpc/types"

const AllPlatformTemp = {
  ...MarketplacePlatform,
}

export type AllPlatform = MarketplacePlatform

export const AllPlatform: Record<
  Exclude<keyof typeof AllPlatformTemp, number>,
  AllPlatform
> = {
  ...MarketplacePlatform,
}

export const AllPlatformLabel = Object.freeze({
  [AllPlatform.UNSPECIFIED]: "Unknown",
  [AllPlatform.ALL]: "All",
  [AllPlatform.POSHMARK]: "Poshmark",
  [AllPlatform.GEARMENT]: "Gearment",
  [AllPlatform.AMAZON]: "Amazon",
  [AllPlatform.ETSY]: "Etsy",
  [AllPlatform.EBAY]: "Ebay",
  [AllPlatform.SHOPIFY]: "Shopify",
  [AllPlatform.SHOPBASE]: "Shopbase",
  [AllPlatform.WOOCOMMERCE]: "Woocomerce",
  [AllPlatform.ORDERDESK]: "Order Desk",
  [AllPlatform.TIKTOKSHOP]: "Tiktok",
})

export type AllPlatformKeys = keyof typeof AllPlatform
export type AllPlatformValues = (typeof AllPlatform)[AllPlatformKeys]

export const PlatformOptions = [
  {
    text: AllPlatformLabel[AllPlatform.GEARMENT],
    value: AllPlatform.GEARMENT,
  },
  {
    text: AllPlatformLabel[AllPlatform.AMAZON],
    value: AllPlatform.AMAZON,
  },
  {
    text: AllPlatformLabel[AllPlatform.ETSY],
    value: AllPlatform.ETSY,
  },
  {
    text: AllPlatformLabel[AllPlatform.EBAY],
    value: AllPlatform.EBAY,
  },
  {
    text: AllPlatformLabel[AllPlatform.SHOPIFY],
    value: AllPlatform.SHOPIFY,
  },
  {
    text: AllPlatformLabel[AllPlatform.SHOPBASE],
    value: AllPlatform.SHOPBASE,
  },
  {
    text: AllPlatformLabel[AllPlatform.WOOCOMMERCE],
    value: AllPlatform.WOOCOMMERCE,
  },

  {
    text: AllPlatformLabel[AllPlatform.TIKTOKSHOP],
    value: AllPlatform.TIKTOKSHOP,
  },
]
