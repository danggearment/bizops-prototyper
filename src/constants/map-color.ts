import {
  ActivitySource,
  CatalogOption_Group_Status,
  CreditStatementAddressType,
  CreditStatementPaymentRequestStatus,
  CreditStatementPaymentStatus,
  CreditStatementStatus,
  CreditStatus,
  DepositRequestStatus,
  GMAttributeStatus,
  GMAttributeValueStatus,
  GMPrintLocationStatus,
  GMProductFulfillmentChannel,
  GMProductPrintTypeStatus,
  GMProductVariantStatus,
  GMTeamPriceCustomStatus,
  Migration_Job_Status,
  OrderDraftStatus,
  ProductStatus,
  StaffStatus,
  StockLabel,
  TeamMemberStatus,
  TeamStatus,
  TeamTransactionType,
  TransactionExportSessionStatus,
} from "@/services/connect-rpc/types"
import {
  ShippingBox_Status,
  ShippingParcel_ShippingService,
  ShippingParcel_Status,
  ShippingPlan_Status,
} from "@gearment/nextapi/api/ffm/v1/cross_dock_pb"
import { StaffCheckoutRequest_Status } from "@gearment/nextapi/api/payment/v1/data_staff_checkout_request_pb"
import {
  OrderAdmin_OrderDraftImportSessionOrderStatus,
  OrderAdmin_OrderDraftImportStatus,
} from "@gearment/nextapi/api/pod/v1/admin_api_type_pb"
import {
  AllOrder_Status,
  OMSOrderSyncTrackingStatus,
  Order_FulfillmentPriority,
  Order_FulfillmentStatus,
  Order_OrderRefundStatus,
  Order_OrderStatus,
} from "@gearment/nextapi/api/pod/v1/order_pb.ts"
import { RushProductGroupStatus } from "@gearment/nextapi/api/pod/v1/product_admin_pb"
import { StoreStatus } from "@gearment/nextapi/api/store/v1/data_store_pb.ts"

type ColorValue =
  | "success"
  | "error"
  | "warn"
  | "default"
  | "primary"
  | "info"
  | "warning"

export const ColorsVariantStock: Record<StockLabel, ColorValue> = {
  [StockLabel.UNKNOWN]: "default",
  [StockLabel.IN_STOCK]: "info",
  [StockLabel.OUT_OF_STOCK]: "error",
  [StockLabel.OUT_OF_STOCK_5D]: "warn",
  [StockLabel.ALL]: "default",
  [StockLabel.DISCONTINUED]: "error",
}

export const StoreColors: Record<StoreStatus, ColorValue> = {
  [StoreStatus.ALL]: "default",
  [StoreStatus.ACTIVE]: "success",
  [StoreStatus.INACTIVE]: "error",
  [StoreStatus.UNKNOWN]: "warn",
}

export const BillingColors: Record<DepositRequestStatus, ColorValue> = {
  [DepositRequestStatus.APPROVED]: "success",
  [DepositRequestStatus.REJECTED]: "error",
  [DepositRequestStatus.REQUESTED]: "default",
  [DepositRequestStatus.CANCELLED]: "error",
  [DepositRequestStatus.PENDING]: "default",
  [DepositRequestStatus.FAILED]: "error",
  [DepositRequestStatus.UNKNOWN]: "warning",
}

export const StaffStatusColors: Record<StaffStatus, ColorValue> = {
  [StaffStatus.UNSPECIFIED]: "warn",
  [StaffStatus.ACTIVE]: "success",
  [StaffStatus.INVITED]: "default",
  [StaffStatus.INACTIVE]: "error",
}

export const AllTransactionExportStatusColors: Record<
  TransactionExportSessionStatus,
  ColorValue
> = {
  [TransactionExportSessionStatus.UNSPECIFIED]: "default",
  [TransactionExportSessionStatus.IN_PROGRESS]: "warn",
  [TransactionExportSessionStatus.PENDING]: "warn",
  [TransactionExportSessionStatus.COMPLETED]: "success",
  [TransactionExportSessionStatus.FAILED]: "error",
}

export const AllOrderRefundStatusColors: Record<
  Order_OrderRefundStatus,
  ColorValue
> = {
  [Order_OrderRefundStatus.UNKNOWN]: "default",
  [Order_OrderRefundStatus.ALL]: "info",
  [Order_OrderRefundStatus.NOT_REQUESTED]: "warn",
  [Order_OrderRefundStatus.REQUESTED]: "info",
  [Order_OrderRefundStatus.PROCESSING]: "warn",
  [Order_OrderRefundStatus.REFUNDED]: "success",
  [Order_OrderRefundStatus.PARTIALLY_REFUNDED]: "success",
  [Order_OrderRefundStatus.REJECTED]: "error",
  [Order_OrderRefundStatus.FAILED]: "error",
}

// ====
export const BillingColorsMapping = {
  success: [DepositRequestStatus.APPROVED],
  error: [DepositRequestStatus.REJECTED, DepositRequestStatus.CANCELLED],
  default: [DepositRequestStatus.REQUESTED],
  warning: [DepositRequestStatus.UNKNOWN],
  info: [DepositRequestStatus.PENDING],
}

export const AllOrderRefundStatusColorsMapping = {
  success: [
    Order_OrderRefundStatus.REFUNDED,
    Order_OrderRefundStatus.PARTIALLY_REFUNDED,
  ],
  error: [Order_OrderRefundStatus.REJECTED, Order_OrderRefundStatus.FAILED],
  warning: [Order_OrderRefundStatus.PROCESSING],
  info: [Order_OrderRefundStatus.REQUESTED],
  default: [Order_OrderRefundStatus.UNKNOWN, Order_OrderRefundStatus.ALL],
}

export const AllOrderStatusColorsMapping = {
  success: [Order_OrderStatus.SHIPPED],
  error: [Order_OrderStatus.CANCELLED],
  warning: [Order_OrderStatus.AWAITING_FULFILLMENT, Order_OrderStatus.ON_HOLD],
  info: [
    Order_OrderStatus.AWAITING_PAYMENT,
    Order_OrderStatus.IN_PRODUCTION,
    Order_OrderStatus.PACKED,
  ],
  default: [Order_OrderStatus.UNKNOWN, Order_OrderStatus.ALL],
}

export const AllFulfillmentOrderStatusColorsMapping = {
  success: [
    Order_FulfillmentStatus.FULFILLED,
    Order_FulfillmentStatus.COMPLETED,
    Order_FulfillmentStatus.PICKED,
    Order_FulfillmentStatus.PRINTED,
  ],
  error: [
    Order_FulfillmentStatus.CANCELLED,
    Order_FulfillmentStatus.ERROR,
    Order_FulfillmentStatus.OUT_OF_STOCK,
  ],
  warning: [
    Order_FulfillmentStatus.PRODUCTION_HOLD,
    Order_FulfillmentStatus.ON_HOLD,
    Order_FulfillmentStatus.PARTIALLY_PICKED,
    Order_FulfillmentStatus.PARTIALLY_PRINTED,
  ],
  info: [
    Order_FulfillmentStatus.PENDING,
    Order_FulfillmentStatus.PICKING,
    Order_FulfillmentStatus.IN_PRODUCTION,
  ],
  default: [Order_FulfillmentStatus.UNSPECIFIED],
}

export const StaffStatusColorsMapping = {
  success: [StaffStatus.ACTIVE],
  error: [StaffStatus.INACTIVE],
  warning: [StaffStatus.UNSPECIFIED],
  info: [],
  default: [StaffStatus.INVITED],
}

export const AllTransactionExportStatusColorsMapping = {
  success: [TransactionExportSessionStatus.COMPLETED],
  error: [TransactionExportSessionStatus.FAILED],
  warning: [
    TransactionExportSessionStatus.IN_PROGRESS,
    TransactionExportSessionStatus.PENDING,
  ],
  info: [],
  default: [TransactionExportSessionStatus.UNSPECIFIED],
}

export const GMTeamStatusColorsMapping = {
  success: [TeamStatus.ACTIVE],
  error: [TeamStatus.INACTIVE, TeamStatus.BLOCKED],
  warning: [],
  info: [],
  default: [TeamStatus.UNKNOWN],
}

export const TeamTransactionTypeColorMapping = {
  success: [TeamTransactionType.TRANSFER, TeamTransactionType.ADJUST],
  error: [],
  warning: [TeamTransactionType.REFUND],
  info: [TeamTransactionType.DEPOSIT],
  default: [TeamTransactionType.UNSPECIFIED, TeamTransactionType.PAYMENT],
}

export const AllGMTeamMemberStatusColorsMapping = {
  success: [TeamMemberStatus.ACTIVE],
  error: [TeamMemberStatus.INACTIVE],
  warning: [TeamMemberStatus.UNKNOWN],
  info: [],
  default: [],
}

export const OrderDraftStatusColorsMapping = {
  success: [],
  error: [OrderDraftStatus.ARCHIVED],
  warning: [OrderDraftStatus.AWAITING_CHECKOUT],
  info: [],
  default: [
    OrderDraftStatus.DRAFT,
    OrderDraftStatus.UNKNOWN,
    OrderDraftStatus.ALL,
  ],
}

export const RushProductGroupStatusColorsMapping = {
  success: [RushProductGroupStatus.ACTIVE],
  error: [RushProductGroupStatus.INACTIVE],
  warning: [],
  info: [],
  default: [],
}

export const mappingColor = <T>(
  data: {
    success: T[]
    error: T[]
    warning: T[]
    default: T[]
    info: T[]
  },
  v?: T,
): "success" | "error" | "warning" | "default" | "info" => {
  if (v === undefined) return "default"
  const color = {
    success: data.success,
    error: data.error,
    warning: data.warning,
    info: data.info,
    default: data.default,
  }

  return (
    (Object.entries(color).find(([_, value]) => value.includes(v))?.[0] as
      | "success"
      | "error"
      | "warning"
      | "default"
      | "info") ?? "default"
  )
}

export const AllOrderPriorityColorsMapping = {
  success: [],
  error: [Order_FulfillmentPriority.RUSH],
  default: [Order_FulfillmentPriority.UNKNOWN],
  warning: [],
  info: [Order_FulfillmentPriority.NORMAL],
}

export const LogDetailTypeColors = {
  [ActivitySource.SYSTEM]: "info",
  [ActivitySource.USER]: "success",
} as Record<ActivitySource, ColorValue>

export const CreditStatusColorsMapping = {
  success: [CreditStatus.ACTIVE],
  error: [CreditStatus.SUSPEND],
  warning: [CreditStatus.SCHEDULED],
  info: [],
  default: [CreditStatus.UNSPECIFIED],
}

export const CreditStatementPaymentStatusColorsMapping = {
  success: [CreditStatementPaymentStatus.PAID],
  error: [],
  warning: [CreditStatementPaymentStatus.AWAITING_PAYMENT],
  info: [CreditStatementPaymentStatus.PARTIAL_PAID],
  default: [CreditStatementPaymentStatus.UNSPECIFIED],
}

export const CreditStatementStatusColorsMapping = {
  success: [CreditStatementStatus.COMPLETED],
  error: [CreditStatementStatus.CANCELLED, CreditStatementStatus.OVERDUE],
  warning: [],
  info: [CreditStatementStatus.ISSUED],
  default: [CreditStatementStatus.UNSPECIFIED],
}

export const ShippingBoxStatusColorsMapping = {
  success: [
    ShippingBox_Status.SHIPPED,
    ShippingBox_Status.BOX_RECEIVED,
    ShippingBox_Status.PARTIALLY_RECEIVED,
    ShippingBox_Status.RECEIVED,
  ],
  error: [ShippingBox_Status.CANCELED],
  warning: [ShippingBox_Status.EXCEPTION],
  info: [ShippingBox_Status.READY_FOR_SHIPPING],
  default: [ShippingBox_Status.NEW],
}

export const ShippingParcelStatusColorsMapping = {
  success: [ShippingParcel_Status.SHIPPED, ShippingParcel_Status.RECEIVED],
  error: [ShippingParcel_Status.CANCELED],
  warning: [
    ShippingParcel_Status.EXCEPTION,
    ShippingParcel_Status.AWAITING_LABEL,
    ShippingParcel_Status.AWAITING_PACKING,
    ShippingParcel_Status.UNDER_REVIEW,
  ],
  info: [
    ShippingParcel_Status.READY_FOR_SHIPPING,
    ShippingParcel_Status.LABEL_READY,
  ],
  default: [ShippingParcel_Status.NEW],
}

export const ShippingPlanStatusColorsMapping = {
  success: [
    ShippingPlan_Status.SHIPPED,
    ShippingPlan_Status.RECEIVED,
    ShippingPlan_Status.RECEIVED,
  ],
  error: [ShippingPlan_Status.CANCELED],
  warning: [
    ShippingPlan_Status.EXCEPTION,
    ShippingPlan_Status.UNDER_REVIEW,
    ShippingPlan_Status.AWAITING_PACKING,
  ],
  info: [
    ShippingPlan_Status.READY_FOR_SHIPPING,
    ShippingPlan_Status.PROCESSING,
  ],
  default: [ShippingPlan_Status.NEW],
}

export const ImportOrderDetailStatusColorsMapping = {
  success: [OrderAdmin_OrderDraftImportStatus.SUCCESS],
  error: [OrderAdmin_OrderDraftImportStatus.FAILED],
  warning: [],
  info: [],
  default: [OrderAdmin_OrderDraftImportStatus.UNSPECIFIED],
}

export const MigrationStatusColorsMapping = {
  success: [Migration_Job_Status.COMPLETED],
  error: [Migration_Job_Status.FAILED],
  default: [Migration_Job_Status.UNSPECIFIED],
  warning: [Migration_Job_Status.PENDING, Migration_Job_Status.PROCESSING],
  info: [Migration_Job_Status.READY_FOR_PROCESSING],
}

export const ShippingParcelShippingServiceColorsMapping = {
  success: [],
  error: [],
  warning: [ShippingParcel_ShippingService.DOMESTIC_GROUND],
  info: [ShippingParcel_ShippingService.DOMESTIC_STANDARD],
  default: [],
}

export const ImportOrderOrderStatusColorsMapping = {
  success: [OrderAdmin_OrderDraftImportSessionOrderStatus.SUCCESS],
  error: [OrderAdmin_OrderDraftImportSessionOrderStatus.FAILED],
  warning: [OrderAdmin_OrderDraftImportSessionOrderStatus.NO_ORDERS_CREATED],
  info: [
    OrderAdmin_OrderDraftImportSessionOrderStatus.PARTIAL_SUCCESS,
    OrderAdmin_OrderDraftImportSessionOrderStatus.PROCESSING,
  ],
  default: [OrderAdmin_OrderDraftImportSessionOrderStatus.UNSPECIFIED],
}

export const StaffCheckoutRequestStatusColorsMapping = {
  success: [
    StaffCheckoutRequest_Status.SUCCESS,
    StaffCheckoutRequest_Status.SUCCESS_PARTIALLY,
  ],
  error: [StaffCheckoutRequest_Status.FAILED],
  warning: [StaffCheckoutRequest_Status.EXPIRED],
  info: [
    StaffCheckoutRequest_Status.PENDING,
    StaffCheckoutRequest_Status.PROCESSING,
  ],
  default: [StaffCheckoutRequest_Status.UNSPECIFIED],
}

export const StatementPaymentRequestStatusColorsMapping = {
  success: [CreditStatementPaymentRequestStatus.APPROVED],
  error: [CreditStatementPaymentRequestStatus.REJECTED],
  warning: [CreditStatementPaymentRequestStatus.PROCESSING],
  info: [CreditStatementPaymentRequestStatus.REQUESTED],
  default: [CreditStatementPaymentRequestStatus.UNKNOWN],
}

export const AllOMSOrderSyncTrackingStatusColorsMapping = {
  success: [
    OMSOrderSyncTrackingStatus.OMS_ORDER_SYNC_TRACKING_STATUS_COMPLETED,
  ],
  error: [
    OMSOrderSyncTrackingStatus.OMS_ORDER_SYNC_TRACKING_STATUS_PUSH_FAILED,
    OMSOrderSyncTrackingStatus.OMS_ORDER_SYNC_TRACKING_STATUS_SYNC_FAILED,
  ],
  warning: [
    OMSOrderSyncTrackingStatus.OMS_ORDER_SYNC_TRACKING_STATUS_PUSHING,
    OMSOrderSyncTrackingStatus.OMS_ORDER_SYNC_TRACKING_STATUS_SYNCING,
  ],
  info: [],
  default: [
    OMSOrderSyncTrackingStatus.OMS_ORDER_SYNC_TRACKING_STATUS_UNSPECIFIED,
  ],
}

export const PricingRuleStatusColorsMapping = {
  success: [GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_ACTIVE],
  error: [GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_DELETED],
  default: [GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_UNSPECIFIED],
  warning: [
    GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_INACTIVE,
    GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_EXPIRED,
  ],
  info: [GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_PENDING],
}

export const StatementAddressTypeColorsMapping = {
  success: [CreditStatementAddressType.INVOICE],
  error: [],
  warning: [],
  info: [CreditStatementAddressType.LEGAL],
  default: [CreditStatementAddressType.UNKNOWN],
}

export const AllSearchOrderStatusColorsMapping = {
  success: [AllOrder_Status.SHIPPED],
  error: [AllOrder_Status.CANCELLED],
  warning: [AllOrder_Status.ON_HOLD, AllOrder_Status.AWAITING_FULFILLMENT],
  info: [
    AllOrder_Status.AWAITING_PAYMENT,
    AllOrder_Status.IN_PRODUCTION,
    AllOrder_Status.PACKED,
  ],
  default: [AllOrder_Status.UNSPECIFIED, AllOrder_Status.ALL],
}

export const OptionGroupStatusColorsMapping = {
  success: [CatalogOption_Group_Status.CATALOG_OPTION_GROUP_STATUS_ACTIVE],
  error: [
    CatalogOption_Group_Status.CATALOG_OPTION_GROUP_STATUS_INACTIVE,
    CatalogOption_Group_Status.CATALOG_OPTION_GROUP_STATUS_DELETED,
  ],
  warning: [],
  info: [],
  default: [CatalogOption_Group_Status.CATALOG_OPTION_GROUP_STATUS_UNKNOWN],
}

export const GMProductFulfillmentChannelColorsMapping = {
  success: [GMProductFulfillmentChannel.GM_PRODUCT_FULFILLMENT_CHANNEL_ALL],
  error: [],
  warning: [GMProductFulfillmentChannel.GM_PRODUCT_FULFILLMENT_CHANNEL_FBM],
  info: [GMProductFulfillmentChannel.GM_PRODUCT_FULFILLMENT_CHANNEL_FBA],
  default: [
    GMProductFulfillmentChannel.GM_PRODUCT_FULFILLMENT_CHANNEL_UNSPECIFIED,
  ],
}

export const ProductStatusColorsMapping = {
  success: [ProductStatus.ACTIVE],
  error: [ProductStatus.DELETED],
  warning: [ProductStatus.DRAFT, ProductStatus.INACTIVE],
  info: [],
  default: [ProductStatus.UNKNOWN],
}

export const ProductVariantStatusColorsMapping = {
  success: [GMProductVariantStatus.GM_PRODUCT_VARIANT_STATUS_ACTIVE],
  error: [GMProductVariantStatus.GM_PRODUCT_VARIANT_STATUS_DELETED],
  warning: [GMProductVariantStatus.GM_PRODUCT_VARIANT_STATUS_INACTIVE],
  info: [],
  default: [GMProductVariantStatus.GM_PRODUCT_VARIANT_STATUS_UNKNOWN],
}

export const AttributeGroupStatusColorsMapping = {
  success: [GMAttributeStatus.GM_ATTRIBUTE_STATUS_ACTIVE],
  error: [GMAttributeStatus.GM_ATTRIBUTE_STATUS_DELETED],
  warning: [GMAttributeStatus.GM_ATTRIBUTE_STATUS_INACTIVE],
  info: [],
  default: [GMAttributeStatus.GM_ATTRIBUTE_STATUS_UNSPECIFIED],
}

export const AttributeGroupValueStatusColorsMapping = {
  success: [GMAttributeValueStatus.GM_ATTRIBUTE_VALUE_STATUS_ACTIVE],
  error: [
    GMAttributeValueStatus.GM_ATTRIBUTE_VALUE_STATUS_DELETED,
    GMAttributeValueStatus.GM_ATTRIBUTE_VALUE_STATUS_INACTIVE,
  ],
  warning: [],
  info: [],
  default: [GMAttributeValueStatus.GM_ATTRIBUTE_VALUE_STATUS_UNSPECIFIED],
}

export const PrintLocationStatusColorsMapping = {
  success: [GMPrintLocationStatus.GM_PRINT_LOCATION_STATUS_ACTIVE],
  error: [GMPrintLocationStatus.GM_PRINT_LOCATION_STATUS_DELETED],
  warning: [GMPrintLocationStatus.GM_PRINT_LOCATION_STATUS_INACTIVE],
  info: [],
  default: [GMPrintLocationStatus.GM_PRINT_LOCATION_STATUS_UNKNOWN],
}

export const PrintTypeStatusColorsMapping = {
  success: [GMProductPrintTypeStatus.GM_PRODUCT_PRINT_TYPE_STATUS_ACTIVE],
  error: [GMProductPrintTypeStatus.GM_PRODUCT_PRINT_TYPE_STATUS_DELETED],
  warning: [GMProductPrintTypeStatus.GM_PRODUCT_PRINT_TYPE_STATUS_INACTIVE],
  info: [],
  default: [GMProductPrintTypeStatus.GM_PRODUCT_PRINT_TYPE_STATUS_UNSPECIFIED],
}
