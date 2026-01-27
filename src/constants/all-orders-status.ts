import {
  AllOrder_Status,
  OMSOrderSyncTrackingStatus,
  Order_FulfillmentPriority,
  Order_FulfillmentStatus,
  Order_OrderRefundStatus,
  Order_OrderStatus,
  OrderDraft_Status,
} from "@/services/connect-rpc/types"

const AllOrderStatusTemp = {
  ...Order_OrderStatus,
}

export type AllOrderStatus = Order_OrderStatus

export const AllOrderStatus: Record<
  Exclude<keyof typeof AllOrderStatusTemp, number>,
  AllOrderStatus
> = {
  ...Order_OrderStatus,
}

export const AllOrderStatusLabel = Object.freeze({
  [Order_OrderStatus.UNKNOWN]: "Unknown",
  [Order_OrderStatus.AWAITING_PAYMENT]: "Awaiting payment",
  [Order_OrderStatus.PAYMENT_FAILED]: "Payment failed",
  [Order_OrderStatus.AWAITING_FULFILLMENT]: "Awaiting production",
  [Order_OrderStatus.IN_PRODUCTION]: "In-production",
  [Order_OrderStatus.PACKED]: "Packed",
  [Order_OrderStatus.SHIPPED]: "Shipped",
  [Order_OrderStatus.CANCELLED]: "Cancelled",
  [Order_OrderStatus.ON_HOLD]: "On hold",
  [Order_OrderStatus.ALL]: "All",
})

const AllOrderDraftStatusTemp = {
  ...OrderDraft_Status,
}
export type AllOrderDraftStatus = OrderDraft_Status

export const AllOrderDraftStatus: Record<
  Exclude<keyof typeof AllOrderDraftStatusTemp, number>,
  AllOrderDraftStatus
> = {
  ...OrderDraft_Status,
}

export const AllOrderDraftStatusLabel = Object.freeze({
  [OrderDraft_Status.ALL]: "All",
  [OrderDraft_Status.UNKNOWN]: "Unknown",
  [OrderDraft_Status.DRAFT]: "Draft",
  [OrderDraft_Status.AWAITING_CHECKOUT]: "Awaiting checkout",
  [OrderDraft_Status.CHECKED_OUT]: "Checked out",
  [OrderDraft_Status.DELETED]: "Deleted",
  [OrderDraft_Status.ARCHIVED]: "Archived",
})

export type AllOrderStatusKeys = keyof typeof AllOrderStatus
export type AllOrderStatusValues = (typeof AllOrderStatus)[AllOrderStatusKeys]

export type AllOrderRefundStatus = Order_OrderRefundStatus

const AllOrderRefundStatusTemp = {
  ...Order_OrderRefundStatus,
}

export const AllOrderRefundStatus: Record<
  Exclude<keyof typeof AllOrderRefundStatusTemp, number>,
  AllOrderRefundStatus
> = {
  ...Order_OrderRefundStatus,
}

export const AllOrderRefundStatusLabel = Object.freeze({
  [Order_OrderRefundStatus.UNKNOWN]: "--",
  [Order_OrderRefundStatus.ALL]: "All",
  [Order_OrderRefundStatus.NOT_REQUESTED]: "Not requested",
  [Order_OrderRefundStatus.REQUESTED]: "Requested",
  [Order_OrderRefundStatus.PROCESSING]: "Processing",
  [Order_OrderRefundStatus.REFUNDED]: "Refunded",
  [Order_OrderRefundStatus.PARTIALLY_REFUNDED]: "Partially refunded",
  [Order_OrderRefundStatus.REJECTED]: "Rejected",
  [Order_OrderRefundStatus.FAILED]: "Failed",
})

export type AllOrderRefundStatusKeys = keyof typeof AllOrderRefundStatus
export type AllOrderRefundStatusValues =
  (typeof AllOrderRefundStatus)[AllOrderRefundStatusKeys]

const AllOrderPriorityTemp = {
  ...Order_FulfillmentPriority,
}

export type AllOrderPriority = Order_FulfillmentPriority

export const AllOrderPriority: Record<
  Exclude<keyof typeof AllOrderPriorityTemp, number>,
  AllOrderPriority
> = {
  ...Order_FulfillmentPriority,
}

export const AllOrderPriorityLabel = Object.freeze({
  [Order_FulfillmentPriority.UNKNOWN]: "Unknown",
  [Order_FulfillmentPriority.NORMAL]: "Normal",
  [Order_FulfillmentPriority.RUSH]: "Rush",
})

const AllFulfillmentOrderStatusTemp = {
  ...Order_FulfillmentStatus,
}

export const AllFulfillmentOrderStatusLabel = Object.freeze({
  [Order_FulfillmentStatus.UNSPECIFIED]: "Unspecified",
  [Order_FulfillmentStatus.PENDING]: "Pending",
  [Order_FulfillmentStatus.PICKING]: "Picking",
  [Order_FulfillmentStatus.IN_PRODUCTION]: "In production",
  [Order_FulfillmentStatus.PICKED]: "Picked",
  [Order_FulfillmentStatus.PARTIALLY_PICKED]: "Partially picked",
  [Order_FulfillmentStatus.PRINTED]: "Printed",
  [Order_FulfillmentStatus.PARTIALLY_PRINTED]: "Partially printed",
  [Order_FulfillmentStatus.PRODUCTION_HOLD]: "Production hold",
  [Order_FulfillmentStatus.OUT_OF_STOCK]: "Out of stock",
  [Order_FulfillmentStatus.ON_HOLD]: "On hold",
  [Order_FulfillmentStatus.ERROR]: "Error",
  [Order_FulfillmentStatus.CANCELLED]: "Cancelled",
  [Order_FulfillmentStatus.FULFILLED]: "Fulfilled",
  [Order_FulfillmentStatus.COMPLETED]: "Completed",
})

export type AllFulfillmentOrderStatus = Order_FulfillmentStatus

export const AllFulfillmentOrderStatus: Record<
  Exclude<keyof typeof AllFulfillmentOrderStatusTemp, number>,
  AllFulfillmentOrderStatus
> = {
  ...Order_FulfillmentStatus,
}

const AllOMSOrderSyncTrackingStatusTemp = {
  ...OMSOrderSyncTrackingStatus,
}

export type AllOMSOrderSyncTrackingStatus = OMSOrderSyncTrackingStatus

export const AllOMSOrderSyncTrackingStatus: Record<
  Exclude<keyof typeof AllOMSOrderSyncTrackingStatusTemp, number>,
  AllOMSOrderSyncTrackingStatus
> = {
  ...OMSOrderSyncTrackingStatus,
}

export const AllOMSOrderSyncTrackingStatusLabel = Object.freeze({
  [OMSOrderSyncTrackingStatus.OMS_ORDER_SYNC_TRACKING_STATUS_UNSPECIFIED]:
    "Pending sync",
  [OMSOrderSyncTrackingStatus.OMS_ORDER_SYNC_TRACKING_STATUS_PUSHING]:
    "Pending sync",
  [OMSOrderSyncTrackingStatus.OMS_ORDER_SYNC_TRACKING_STATUS_SYNCING]:
    "Syncing",
  [OMSOrderSyncTrackingStatus.OMS_ORDER_SYNC_TRACKING_STATUS_COMPLETED]:
    "Completed",
  [OMSOrderSyncTrackingStatus.OMS_ORDER_SYNC_TRACKING_STATUS_PUSH_FAILED]:
    "Push failed",
  [OMSOrderSyncTrackingStatus.OMS_ORDER_SYNC_TRACKING_STATUS_SYNC_FAILED]:
    "Sync failed",
})

export const AllSearchOrderStatusLabel = Object.freeze({
  [AllOrder_Status.UNSPECIFIED]: "Unknown",
  [AllOrder_Status.ALL]: "All",
  [AllOrder_Status.DRAFT]: "Draft",
  [AllOrder_Status.AWAITING_CHECKOUT]: "Awaiting checkout",
  [AllOrder_Status.AWAITING_PAYMENT]: "Awaiting payment",
  [AllOrder_Status.PAYMENT_FAILED]: "Payment failed",
  [AllOrder_Status.AWAITING_FULFILLMENT]: "Awaiting production",
  [AllOrder_Status.IN_PRODUCTION]: "In-production",
  [AllOrder_Status.PACKED]: "Packed",
  [AllOrder_Status.SHIPPED]: "Shipped",
  [AllOrder_Status.CANCELLED]: "Cancelled",
  [AllOrder_Status.ON_HOLD]: "On hold",
  [AllOrder_Status.CHECKED_OUT]: "Checked out",
  [AllOrder_Status.DELETED]: "Deleted",
  [AllOrder_Status.ARCHIVED]: "Archived",
  [AllOrder_Status.PAYMENT_PROCESSING]: "Payment processing",
  [AllOrder_Status.PAYMENT_SUCCESS]: "Payment success",
})
