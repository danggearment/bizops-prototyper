import {
  ShippingBox_Status,
  ShippingParcel_ShippingService,
  ShippingParcel_Status,
  ShippingParcel_Strategy,
  ShippingPlan_Status,
} from "@gearment/nextapi/api/ffm/v1/cross_dock_pb"
import { Unit } from "@gearment/nextapi/common/type/v1/measure_pb"

import { CallLogsTab } from "@/schemas/schemas/call-logs"
import { CreditStatementAddressType } from "@/services/connect-rpc/types"
import {
  StaffCheckoutRequest_Status,
  StaffCheckoutRequest_Type,
} from "@gearment/nextapi/api/payment/v1/data_staff_checkout_request_pb"
import {
  OrderAdmin_OrderDraftImportSessionOrderStatus,
  OrderAdmin_OrderDraftImportSessionStatus,
  OrderAdmin_OrderDraftImportStatus,
  OrderAdmin_OrderPaymentStatus,
} from "@gearment/nextapi/api/pod/v1/admin_api_type_pb"
import { Order_FulfillmentVendor } from "@gearment/nextapi/api/pod/v1/order_pb"

export const ShippingBoxStatusLabel: Record<ShippingBox_Status, string> = {
  [ShippingBox_Status.UNSPECIFIED]: "Unspecified",
  [ShippingBox_Status.NEW]: "New",
  [ShippingBox_Status.CANCELED]: "Canceled",
  [ShippingBox_Status.READY_FOR_SHIPPING]: "Ready for shipping",
  [ShippingBox_Status.SHIPPED]: "Shipped",
  [ShippingBox_Status.BOX_RECEIVED]: "Box received",
  [ShippingBox_Status.PARTIALLY_RECEIVED]: "Partially received",
  [ShippingBox_Status.RECEIVED]: "Received",
  [ShippingBox_Status.EXCEPTION]: "Exception",
  [ShippingBox_Status.WAITING_FOR_PACKING]: "Waiting for packing",
}

export const ShippingPlanStatusLabel: Record<ShippingPlan_Status, string> = {
  [ShippingPlan_Status.UNSPECIFIED]: "Unspecified",
  [ShippingPlan_Status.NEW]: "New",
  [ShippingPlan_Status.UNDER_REVIEW]: "Under review",
  [ShippingPlan_Status.AWAITING_PACKING]: "Awaiting packing",
  [ShippingPlan_Status.READY_FOR_SHIPPING]: "Ready for shipping",
  [ShippingPlan_Status.SHIPPED]: "Shipped",
  [ShippingPlan_Status.RECEIVED]: "Received",
  [ShippingPlan_Status.CANCELED]: "Canceled",
  [ShippingPlan_Status.EXCEPTION]: "Exception",
  [ShippingPlan_Status.COMPLETED]: "Completed",
  [ShippingPlan_Status.PROCESSING]: "Processing",
}

export const ShippingParcelStatusLabel: Record<ShippingParcel_Status, string> =
  {
    [ShippingParcel_Status.UNSPECIFIED]: "Unspecified",
    [ShippingParcel_Status.NEW]: "New",
    [ShippingParcel_Status.UNDER_REVIEW]: "Under review",
    [ShippingParcel_Status.AWAITING_LABEL]: "Awaiting label",
    [ShippingParcel_Status.LABEL_READY]: "Label ready",
    [ShippingParcel_Status.AWAITING_PACKING]: "Awaiting packing",
    [ShippingParcel_Status.READY_FOR_SHIPPING]: "Ready for shipping",
    [ShippingParcel_Status.SHIPPED]: "Shipped",
    [ShippingParcel_Status.RECEIVED]: "Received",
    [ShippingParcel_Status.CANCELED]: "Canceled",
    [ShippingParcel_Status.EXCEPTION]: "Exception",
    [ShippingParcel_Status.COMPLETED]: "Completed",
  }

export const ShippingParcelShippingServiceLabel: Record<
  ShippingParcel_ShippingService,
  string
> = {
  [ShippingParcel_ShippingService.UNSPECIFIED]: "Unspecified",
  [ShippingParcel_ShippingService.DOMESTIC_GROUND]: "Domestic ground",
  [ShippingParcel_ShippingService.DOMESTIC_STANDARD]: "Domestic standard",
}

export const ShippingParcelStrategyLabel: Record<
  ShippingParcel_Strategy,
  string
> = {
  [ShippingParcel_Strategy.UNSPECIFIED]: "Unspecified",
  [ShippingParcel_Strategy.CROSS_DOCK]: "Cross dock",
  [ShippingParcel_Strategy.STOCK]: "Stock",
}

export const UnitLabel: Record<Unit, string> = {
  [Unit.UNSPECIFIED]: "Unspecified",
  [Unit.KILOGRAM]: "Kilogram",
  [Unit.POUND]: "Pound",
  [Unit.OUNCE]: "Ounce",
  [Unit.GRAM]: "Gram",
  [Unit.MILLIGRAM]: "Milligram",
  [Unit.CENTIMETER]: "Centimeter",
  [Unit.METER]: "Meter",
  [Unit.INCH]: "Inch",
}

export const OrderImportStatusLabel: Record<
  OrderAdmin_OrderDraftImportSessionStatus,
  string
> = {
  [OrderAdmin_OrderDraftImportSessionStatus.UNSPECIFIED]: "Unspecified",
  [OrderAdmin_OrderDraftImportSessionStatus.ALL]: "All",
  [OrderAdmin_OrderDraftImportSessionStatus.PENDING]: "Pending",
  [OrderAdmin_OrderDraftImportSessionStatus.PROCESSING]: "Processing",
  [OrderAdmin_OrderDraftImportSessionStatus.SUCCESS]: "Success",
  [OrderAdmin_OrderDraftImportSessionStatus.FAILED]: "Failed",
}

export const OrderImportDetailStatusLabel: Record<
  OrderAdmin_OrderDraftImportStatus,
  string
> = {
  [OrderAdmin_OrderDraftImportStatus.UNSPECIFIED]: "Unspecified",
  [OrderAdmin_OrderDraftImportStatus.ALL]: "All",
  [OrderAdmin_OrderDraftImportStatus.SUCCESS]: "Success",
  [OrderAdmin_OrderDraftImportStatus.FAILED]: "Failed",
}

export const OrderImportOrderStatusLabel: Record<
  OrderAdmin_OrderDraftImportSessionOrderStatus,
  string
> = {
  [OrderAdmin_OrderDraftImportSessionOrderStatus.UNSPECIFIED]: "Unspecified",
  [OrderAdmin_OrderDraftImportSessionOrderStatus.ALL]: "All",
  [OrderAdmin_OrderDraftImportSessionOrderStatus.FAILED]: "Import failed",
  [OrderAdmin_OrderDraftImportSessionOrderStatus.NO_ORDERS_CREATED]:
    "No orders created",
  [OrderAdmin_OrderDraftImportSessionOrderStatus.PARTIAL_SUCCESS]:
    "Partial success",
  [OrderAdmin_OrderDraftImportSessionOrderStatus.SUCCESS]: "Success",
  [OrderAdmin_OrderDraftImportSessionOrderStatus.PROCESSING]: "Processing",
}

export const StaffCheckoutRequestStatusLabel = {
  [StaffCheckoutRequest_Status.UNSPECIFIED]: "Unspecified",
  [StaffCheckoutRequest_Status.ALL]: "All",
  [StaffCheckoutRequest_Status.PENDING]: "Pending",
  [StaffCheckoutRequest_Status.SUCCESS]: "Success",
  [StaffCheckoutRequest_Status.SUCCESS_PARTIALLY]: "Success partially",
  [StaffCheckoutRequest_Status.FAILED]: "Failed",
  [StaffCheckoutRequest_Status.EXPIRED]: "Expired",
  [StaffCheckoutRequest_Status.PROCESSING]: "Processing",
}

export const StaffCheckoutRequestTypeLabel = {
  [StaffCheckoutRequest_Type.UNSPECIFIED]: "Unspecified",
  [StaffCheckoutRequest_Type.ALL]: "All",
  [StaffCheckoutRequest_Type.MANUAL]: "Manual",
  [StaffCheckoutRequest_Type.AUTO]: "Auto",
}

export const OrderFulfillmentVendorLabel = {
  [Order_FulfillmentVendor.UNKNOWN]: "Unknown",
  [Order_FulfillmentVendor.AMAZON]: "Amazon",
  [Order_FulfillmentVendor.GEARMENT]: "Gearment",
}

export const OrderAdminPaymentStatusLabel = {
  [OrderAdmin_OrderPaymentStatus.PAYMENT_STATUS_UNKNOWN]: "Unspecified",
  [OrderAdmin_OrderPaymentStatus.PAYMENT_STATUS_SUCCESS]: "Success",
  [OrderAdmin_OrderPaymentStatus.PAYMENT_STATUS_FAILED]: "Failed",
  [OrderAdmin_OrderPaymentStatus.PAYMENT_STATUS_EXPIRED]: "Expired",
  [OrderAdmin_OrderPaymentStatus.PAYMENT_STATUS_SUCCESS_PARTIALLY]:
    "Partially paid",
  [OrderAdmin_OrderPaymentStatus.PAYMENT_STATUS_PENDING]: "Pending",
}

export const CallLogsTabLabel = {
  [CallLogsTab.Values["vendor-api"]]: "Vendor API",
  [CallLogsTab.Values["webhook"]]: "Webhook",
  [CallLogsTab.Values["store-api"]]: "Store API",
  [CallLogsTab.Values["store-webhook"]]: "Store Webhook",
  [CallLogsTab.Values["finance-api"]]: "Finance API",
}

export const StatementAddressTypeLabel = Object.freeze({
  [CreditStatementAddressType.UNKNOWN]: "Unknown",
  [CreditStatementAddressType.INVOICE]: "Invoice",
  [CreditStatementAddressType.LEGAL]: "Legal",
})
