import { AllPlatform, AllPlatformLabel } from "@/constants/platform"

import {
  AllOrderStatus,
  AllOrderStatusLabel,
} from "@/constants/all-orders-status.ts"
import {
  Order_CreatedMethodFilter,
  Order_FilterOption,
  Order_FulfillmentPriority,
  Order_OrderLocationOption,
  RefundRequestType,
} from "@/services/connect-rpc/types"
import { RushProductGroupStatus } from "@gearment/nextapi/api/pod/v1/product_admin_pb"

export const AllRefundRequestTypeLabel = Object.freeze({
  [RefundRequestType.UNKNOWN]: "",
  [RefundRequestType.FULL]: "Full refund",
  [RefundRequestType.FULL_BASE_PRICE]: "Full base price",
  [RefundRequestType.LABEL_FEE]: "Label fee",
  [RefundRequestType.SURCHARGE_FEE]: "Surcharge fee",
  [RefundRequestType.GIFT_MESSAGE_FEE]: "Gift message fee",
  [RefundRequestType.FULL_SHIPPING_FEE]: "Full shipping fee",
  [RefundRequestType.TAX_FEE]: "Tax fee",
  [RefundRequestType.CUSTOM]: "Custom refund",
})

export const AllCreationMethodsLabelAllOrder = Object.freeze({
  [Order_CreatedMethodFilter.UNKNOWN]: "",
  [Order_CreatedMethodFilter.PULL]: "Pull",
  [Order_CreatedMethodFilter.MANUAL]: "Manual",
  [Order_CreatedMethodFilter.API]: "Api",
  [Order_CreatedMethodFilter.IMPORT]: "Import",
  [Order_CreatedMethodFilter.LABEL]: "Platform label",
  [Order_CreatedMethodFilter.WEBHOOK]: "Webhook",
})

export const AllCreationMethodsAllOrder = Object.freeze(
  Order_CreatedMethodFilter,
)

export const AllOrderLocationAllOrder = Object.freeze(Order_OrderLocationOption)

export const AllOptionsFilterLabelAllOrder = Object.freeze({
  [Order_FilterOption.HAS_GIFT_MESSAGE]: "Yes",
  [Order_FilterOption.HAS_NO_GIFT_MESSAGE]: "No",
  [Order_FilterOption.HAS_IOSS_NUMBER]: "Yes",
  [Order_FilterOption.HAS_NO_IOSS_NUMBER]: "No",
})

export const AllOptionsFilterAllOrder = Object.freeze(Order_FilterOption)

export const PlatformOptionsAllOrder = [
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
  {
    text: AllPlatformLabel[AllPlatform.ORDERDESK],
    value: AllPlatform.ORDERDESK,
  },
]

export const CreationMethodOptionsAllOrder = [
  {
    text: AllCreationMethodsLabelAllOrder[AllCreationMethodsAllOrder.MANUAL],
    value: AllCreationMethodsAllOrder.MANUAL,
  },

  {
    text: AllCreationMethodsLabelAllOrder[AllCreationMethodsAllOrder.IMPORT],
    value: AllCreationMethodsAllOrder.IMPORT,
  },

  {
    text: AllCreationMethodsLabelAllOrder[AllCreationMethodsAllOrder.PULL],
    value: AllCreationMethodsAllOrder.PULL,
  },
  {
    text: AllCreationMethodsLabelAllOrder[AllCreationMethodsAllOrder.LABEL],
    value: AllCreationMethodsAllOrder.LABEL,
  },
  {
    text: AllCreationMethodsLabelAllOrder[AllCreationMethodsAllOrder.API],
    value: AllCreationMethodsAllOrder.API,
  },
  {
    text: AllCreationMethodsLabelAllOrder[AllCreationMethodsAllOrder.WEBHOOK],
    value: AllCreationMethodsAllOrder.WEBHOOK,
  },
]

export const GiftMessageOptionsAllOrder = [
  {
    text: AllOptionsFilterLabelAllOrder[
      AllOptionsFilterAllOrder.HAS_GIFT_MESSAGE
    ],
    value: AllOptionsFilterAllOrder.HAS_GIFT_MESSAGE,
  },
  {
    text: AllOptionsFilterLabelAllOrder[
      AllOptionsFilterAllOrder.HAS_NO_GIFT_MESSAGE
    ],
    value: AllOptionsFilterAllOrder.HAS_NO_GIFT_MESSAGE,
  },
]

export const IOSSOptionsAllOrder = [
  {
    text: AllOptionsFilterLabelAllOrder[
      AllOptionsFilterAllOrder.HAS_IOSS_NUMBER
    ],
    value: AllOptionsFilterAllOrder.HAS_IOSS_NUMBER,
  },
  {
    text: AllOptionsFilterLabelAllOrder[
      AllOptionsFilterAllOrder.HAS_NO_IOSS_NUMBER
    ],
    value: AllOptionsFilterAllOrder.HAS_NO_IOSS_NUMBER,
  },
]

export const OrderLocationOptionsAllOrder = [
  {
    text: "DOMESTIC",
    value: AllOrderLocationAllOrder.ORDER_LOCATION_DOMESTIC,
  },
  {
    text: "INTERNATIONAL",
    value: AllOrderLocationAllOrder.ORDER_LOCATION_INTERNATIONAL,
  },
]

export const OrderPriority = Object.freeze({
  [Order_FulfillmentPriority.UNKNOWN]: "",
  [Order_FulfillmentPriority.NORMAL]: "Normal",
  [Order_FulfillmentPriority.RUSH]: "Rush",
})

export const RushProductGroupStatusLabel = Object.freeze({
  [RushProductGroupStatus.ALL]: "All",
  [RushProductGroupStatus.ACTIVE]: "Active",
  [RushProductGroupStatus.INACTIVE]: "Inactive",
})

export const DEFAULT_EMPTY_VALUE = "--"

export enum ProductPriceTierType {
  FBA = "FBA",
  FBM = "FBM",
}

export const UncompletedOrderOptionValue = "UNCOMPLETED_ORDERS"

export const UnCompleteOrderStatuses = [
  AllOrderStatus.AWAITING_FULFILLMENT.toString(),
  AllOrderStatus.IN_PRODUCTION.toString(),
  AllOrderStatus.ON_HOLD.toString(),
  AllOrderStatus.PACKED.toString(),
]

export const ProcessingStatusComboboxOptionsAllOrder: {
  label: string
  value: string
}[] = [
  { label: "Uncompleted orders", value: UncompletedOrderOptionValue },
  {
    label: AllOrderStatusLabel[AllOrderStatus.AWAITING_PAYMENT],
    value: AllOrderStatus.AWAITING_PAYMENT.toString(),
  },
  {
    label: AllOrderStatusLabel[AllOrderStatus.PAYMENT_FAILED],
    value: AllOrderStatus.PAYMENT_FAILED.toString(),
  },
  {
    label: AllOrderStatusLabel[AllOrderStatus.AWAITING_FULFILLMENT],
    value: AllOrderStatus.AWAITING_FULFILLMENT.toString(),
  },
  {
    label: AllOrderStatusLabel[AllOrderStatus.IN_PRODUCTION],
    value: AllOrderStatus.IN_PRODUCTION.toString(),
  },
  {
    label: AllOrderStatusLabel[AllOrderStatus.PACKED],
    value: AllOrderStatus.PACKED.toString(),
  },
  {
    label: AllOrderStatusLabel[AllOrderStatus.SHIPPED],
    value: AllOrderStatus.SHIPPED.toString(),
  },
  {
    label: AllOrderStatusLabel[AllOrderStatus.CANCELLED],
    value: AllOrderStatus.CANCELLED.toString(),
  },
  {
    label: AllOrderStatusLabel[AllOrderStatus.ON_HOLD],
    value: AllOrderStatus.ON_HOLD.toString(),
  },
]

export enum MarkFulfilledOptionsAllOrderEnum {
  MARK_FULFILLED = "true",
  UNMARK_FULFILLED = "false",
}

export const MarkFulfilledOptionsAllOrder: {
  label: string
  value: MarkFulfilledOptionsAllOrderEnum
}[] = [
  {
    label: "Mark Fulfilled",
    value: MarkFulfilledOptionsAllOrderEnum.MARK_FULFILLED,
  },
  {
    label: "Unmark Fulfilled",
    value: MarkFulfilledOptionsAllOrderEnum.UNMARK_FULFILLED,
  },
]
