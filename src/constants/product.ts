import {
  CatalogOption_Group_Status,
  GMProductFulfillmentChannel,
  GMProductOption_OptionType,
  GMProductVariantStatus,
  ProductStatus,
} from "@/services/connect-rpc/types"

export const OptionsCatalogGroupStatus = Object.freeze<
  Record<CatalogOption_Group_Status, string>
>({
  [CatalogOption_Group_Status.CATALOG_OPTION_GROUP_STATUS_UNKNOWN]: "Unknown",
  [CatalogOption_Group_Status.CATALOG_OPTION_GROUP_STATUS_ACTIVE]: "Active",
  [CatalogOption_Group_Status.CATALOG_OPTION_GROUP_STATUS_INACTIVE]: "Inactive",
  [CatalogOption_Group_Status.CATALOG_OPTION_GROUP_STATUS_DELETED]: "Deleted",
})

export const OptionsCatalogGroupType = Object.freeze({
  [GMProductOption_OptionType.UNKNOWN]: "Unknown",
  [GMProductOption_OptionType.COLOR]: "",
  [GMProductOption_OptionType.SIZE]: "",
  [GMProductOption_OptionType.MATERIAL]: "Material",
})

export const GMProductFulfillmentChannelLabel = Object.freeze({
  [GMProductFulfillmentChannel.GM_PRODUCT_FULFILLMENT_CHANNEL_UNSPECIFIED]:
    "Unknown",
  [GMProductFulfillmentChannel.GM_PRODUCT_FULFILLMENT_CHANNEL_FBM]: "FBM",
  [GMProductFulfillmentChannel.GM_PRODUCT_FULFILLMENT_CHANNEL_FBA]: "FBA",
  [GMProductFulfillmentChannel.GM_PRODUCT_FULFILLMENT_CHANNEL_ALL]: "All",
})

export const ProductStatusLabel = Object.freeze({
  [ProductStatus.UNKNOWN]: "Unknown",
  [ProductStatus.ACTIVE]: "Active",
  [ProductStatus.DRAFT]: "Draft",
  [ProductStatus.DELETED]: "Deleted",
  [ProductStatus.INACTIVE]: "Inactive",
})

export const ProductVariantStatusLabel = Object.freeze({
  [GMProductVariantStatus.GM_PRODUCT_VARIANT_STATUS_UNKNOWN]: "Unknown",
  [GMProductVariantStatus.GM_PRODUCT_VARIANT_STATUS_ACTIVE]: "Active",
  [GMProductVariantStatus.GM_PRODUCT_VARIANT_STATUS_INACTIVE]: "Inactive",
  [GMProductVariantStatus.GM_PRODUCT_VARIANT_STATUS_DELETED]: "Deleted",
})

export const ProductStatusOptions = [
  {
    label: "Active",
    value: ProductStatus.ACTIVE.toString(),
  },
  {
    label: "Draft",
    value: ProductStatus.DRAFT.toString(),
  },
  {
    label: "Inactive",
    value: ProductStatus.INACTIVE.toString(),
  },
]

export const ProductStockStatus = Object.freeze({
  ALL: "all",
  IN_STOCK: "in_stock",
  OUT_OF_STOCK: "out_of_stock",
  LOW_STOCK: "low_stock",
})

export const ProductStockOptions: {
  label: string
  value: (typeof ProductStockStatus)[keyof typeof ProductStockStatus]
}[] = [
  {
    label: "All stock",
    value: ProductStockStatus.ALL,
  },
  {
    label: "In stock",
    value: ProductStockStatus.IN_STOCK,
  },
  {
    label: "Out of stock",
    value: ProductStockStatus.OUT_OF_STOCK,
  },
  {
    label: "Low stock",
    value: ProductStockStatus.LOW_STOCK,
  },
]

export const ProductVariantStatusOptions = [
  {
    label: "Active",
    value: GMProductVariantStatus.GM_PRODUCT_VARIANT_STATUS_ACTIVE.toString(),
  },
  {
    label: "Inactive",
    value: GMProductVariantStatus.GM_PRODUCT_VARIANT_STATUS_INACTIVE.toString(),
  },
]
