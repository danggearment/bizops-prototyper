import {
  GMAttributeStatus,
  GMAttributeValueStatus,
} from "@/services/connect-rpc/types"

export const AttributeGroupStatusLabel = {
  [GMAttributeStatus.GM_ATTRIBUTE_STATUS_ACTIVE]: "Active",
  [GMAttributeStatus.GM_ATTRIBUTE_STATUS_INACTIVE]: "Inactive",
  [GMAttributeStatus.GM_ATTRIBUTE_STATUS_DELETED]: "Deleted",
  [GMAttributeStatus.GM_ATTRIBUTE_STATUS_UNSPECIFIED]: "Unknown",
}

export const AttributeGroupStatusOptions = [
  {
    label: "Active",
    value: GMAttributeStatus.GM_ATTRIBUTE_STATUS_ACTIVE.toString(),
  },
  {
    label: "Inactive",
    value: GMAttributeStatus.GM_ATTRIBUTE_STATUS_INACTIVE.toString(),
  },
]

export const AttributeGroupValueStatusOptions = [
  {
    label: "Active",
    value: GMAttributeValueStatus.GM_ATTRIBUTE_VALUE_STATUS_ACTIVE.toString(),
  },
  {
    label: "Inactive",
    value: GMAttributeValueStatus.GM_ATTRIBUTE_VALUE_STATUS_INACTIVE.toString(),
  },
]

export const AttributeGroupValueStatusLabel = {
  [GMAttributeValueStatus.GM_ATTRIBUTE_VALUE_STATUS_ACTIVE]: "Active",
  [GMAttributeValueStatus.GM_ATTRIBUTE_VALUE_STATUS_INACTIVE]: "Inactive",
  [GMAttributeValueStatus.GM_ATTRIBUTE_VALUE_STATUS_DELETED]: "Deleted",
  [GMAttributeValueStatus.GM_ATTRIBUTE_VALUE_STATUS_UNSPECIFIED]: "Unknown",
}

export const AttributeLibraryStatusOptions = [
  {
    label: "Active",
    value: GMAttributeValueStatus.GM_ATTRIBUTE_VALUE_STATUS_ACTIVE.toString(),
  },
  {
    label: "Inactive",
    value: GMAttributeValueStatus.GM_ATTRIBUTE_VALUE_STATUS_INACTIVE.toString(),
  },
]
