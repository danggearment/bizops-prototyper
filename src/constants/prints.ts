import {
  GMPrintLocationStatus,
  GMProductPrintTypeStatus,
} from "@/services/connect-rpc/types"

export const PrintLocationStatusOptions = [
  {
    label: "Active",
    value: GMPrintLocationStatus.GM_PRINT_LOCATION_STATUS_ACTIVE.toString(),
  },
  {
    label: "Inactive",
    value: GMPrintLocationStatus.GM_PRINT_LOCATION_STATUS_INACTIVE.toString(),
  },
]

export const PrintLocationStatusLabel = Object.freeze({
  [GMPrintLocationStatus.GM_PRINT_LOCATION_STATUS_ACTIVE]: "Active",
  [GMPrintLocationStatus.GM_PRINT_LOCATION_STATUS_INACTIVE]: "Inactive",
  [GMPrintLocationStatus.GM_PRINT_LOCATION_STATUS_DELETED]: "Deleted",
  [GMPrintLocationStatus.GM_PRINT_LOCATION_STATUS_UNKNOWN]: "Unknown",
})

export const PrintTypeStatusOptions = [
  {
    label: "Active",
    value:
      GMProductPrintTypeStatus.GM_PRODUCT_PRINT_TYPE_STATUS_ACTIVE.toString(),
  },
  {
    label: "Inactive",
    value:
      GMProductPrintTypeStatus.GM_PRODUCT_PRINT_TYPE_STATUS_INACTIVE.toString(),
  },
]

export const PrintTypeStatusLabel = Object.freeze({
  [GMProductPrintTypeStatus.GM_PRODUCT_PRINT_TYPE_STATUS_ACTIVE]: "Active",
  [GMProductPrintTypeStatus.GM_PRODUCT_PRINT_TYPE_STATUS_INACTIVE]: "Inactive",
  [GMProductPrintTypeStatus.GM_PRODUCT_PRINT_TYPE_STATUS_DELETED]: "Deleted",
  [GMProductPrintTypeStatus.GM_PRODUCT_PRINT_TYPE_STATUS_UNSPECIFIED]:
    "Unspecified",
})
