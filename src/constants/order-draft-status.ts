import {
  OrderDraft_ListingFilter_CreatedMethod,
  OrderDraft_ListingFilter_Option,
  OrderDraft_OrderDraftLocationOption,
  OrderDraft_Status,
} from "@/services/connect-rpc/types"

const OrderDraftStatusTemp = {
  ...OrderDraft_Status,
}

export type OrderDraftStatus = OrderDraft_Status

export const OrderDraftStatus: Record<
  Exclude<keyof typeof OrderDraftStatusTemp, number>,
  OrderDraftStatus
> = {
  ...OrderDraft_Status,
}

export const OrderDraftStatusLabel = Object.freeze({
  [OrderDraftStatus.ALL]: "All",
  [OrderDraftStatus.UNKNOWN]: "Unknown",
  [OrderDraftStatus.DRAFT]: "Draft",
  [OrderDraftStatus.AWAITING_CHECKOUT]: "Awaiting checkout",
  [OrderDraftStatus.CHECKED_OUT]: "Checkout",
  [OrderDraftStatus.DELETED]: "Delete",
  [OrderDraftStatus.ARCHIVED]: "Archived",
})

export type OrderDraftStatusKeys = keyof typeof OrderDraftStatus
export type OrderDraftStatusValues =
  (typeof OrderDraftStatus)[OrderDraftStatusKeys]

export const CreationMethodsOrderDraft = Object.freeze(
  OrderDraft_ListingFilter_CreatedMethod,
)

export const OptionsFilterOrderDraft = Object.freeze(
  OrderDraft_ListingFilter_Option,
)

export const OrderLocationOrderDraft = Object.freeze(
  OrderDraft_OrderDraftLocationOption,
)
