import {
  Migration_DataType,
  Migration_Job_Status,
} from "@/services/connect-rpc/types"

export const MigrationDataTypeLabel = Object.freeze({
  [Migration_DataType.UNSPECIFIED]: "Unknown",
  [Migration_DataType.USER_ACCOUNT]: "User account",
  [Migration_DataType.USER_STORE]: "User store",
  [Migration_DataType.USER_PAYMENT]: "User payment",
  [Migration_DataType.USER_ORDER]: "User order",
  [Migration_DataType.USER_STUDIO]: "User studio",
  [Migration_DataType.USER_WALLET]: "User wallet",
  [Migration_DataType.USER_PRODUCT]: "User product",
  [Migration_DataType.USER_TIER]: "User tier",
  [Migration_DataType.TRANSACTION]: "Transaction",
  [Migration_DataType.SELLER_PRINTING_OPTIONS]: "Seller Printing Options",
  [Migration_DataType.SELLER_WEBHOOK]: "Seller Webhook",
  [Migration_DataType.PLATFORM_CATALOG]: "Platform Catalog",
  [Migration_DataType.PLATFORM_POLICY]: "Platform Policy",
  [Migration_DataType.GIFT_MESSAGE]: "Gift Message",
  [Migration_DataType.INVOICE_INFORMATION]: "Invoice Information",
  [Migration_DataType.RETURN_ADDRESS]: "Return Address",
  [Migration_DataType.SELLER_CONFIG]: "Seller Config",
  [Migration_DataType.COMPLETE_MIGRATION]: "Complete Migration",
  [Migration_DataType.DEPOSIT_REQUEST]: "Deposit Request",
  [Migration_DataType.ORDER_DRAFT]: "Order Draft",
  [Migration_DataType.ORDER_REFUND]: "Order Refund",
  [Migration_DataType.ORDER_PAYMENT]: "Order Payment",
})

export const MigrationDataTypeOptions = [
  {
    label: MigrationDataTypeLabel[Migration_DataType.USER_ACCOUNT],
    value: Migration_DataType.USER_ACCOUNT.toString(),
  },
  {
    label: MigrationDataTypeLabel[Migration_DataType.USER_ORDER],
    value: Migration_DataType.USER_ORDER.toString(),
  },
  {
    label: MigrationDataTypeLabel[Migration_DataType.USER_PAYMENT],
    value: Migration_DataType.USER_PAYMENT.toString(),
  },
  {
    label: MigrationDataTypeLabel[Migration_DataType.USER_STORE],
    value: Migration_DataType.USER_STORE.toString(),
  },
  {
    label: MigrationDataTypeLabel[Migration_DataType.USER_STUDIO],
    value: Migration_DataType.USER_STUDIO.toString(),
  },
  {
    label: MigrationDataTypeLabel[Migration_DataType.USER_TIER],
    value: Migration_DataType.USER_TIER.toString(),
  },
  {
    label: MigrationDataTypeLabel[Migration_DataType.USER_WALLET],
    value: Migration_DataType.USER_WALLET.toString(),
  },
  {
    label: MigrationDataTypeLabel[Migration_DataType.USER_PRODUCT],
    value: Migration_DataType.USER_PRODUCT.toString(),
  },
  {
    label: MigrationDataTypeLabel[Migration_DataType.TRANSACTION],
    value: Migration_DataType.TRANSACTION.toString(),
  },
  {
    label: MigrationDataTypeLabel[Migration_DataType.SELLER_PRINTING_OPTIONS],
    value: Migration_DataType.SELLER_PRINTING_OPTIONS.toString(),
  },
  {
    label: MigrationDataTypeLabel[Migration_DataType.SELLER_WEBHOOK],
    value: Migration_DataType.SELLER_WEBHOOK.toString(),
  },
  {
    label: MigrationDataTypeLabel[Migration_DataType.GIFT_MESSAGE],
    value: Migration_DataType.GIFT_MESSAGE.toString(),
  },
  {
    label: MigrationDataTypeLabel[Migration_DataType.INVOICE_INFORMATION],
    value: Migration_DataType.INVOICE_INFORMATION.toString(),
  },
  {
    label: MigrationDataTypeLabel[Migration_DataType.RETURN_ADDRESS],
    value: Migration_DataType.RETURN_ADDRESS.toString(),
  },
  {
    label: MigrationDataTypeLabel[Migration_DataType.SELLER_CONFIG],
    value: Migration_DataType.SELLER_CONFIG.toString(),
  },
  {
    label: MigrationDataTypeLabel[Migration_DataType.COMPLETE_MIGRATION],
    value: Migration_DataType.COMPLETE_MIGRATION.toString(),
  },
  {
    label: MigrationDataTypeLabel[Migration_DataType.DEPOSIT_REQUEST],
    value: Migration_DataType.DEPOSIT_REQUEST.toString(),
  },
  {
    label: MigrationDataTypeLabel[Migration_DataType.ORDER_DRAFT],
    value: Migration_DataType.ORDER_DRAFT.toString(),
  },
  {
    label: MigrationDataTypeLabel[Migration_DataType.ORDER_REFUND],
    value: Migration_DataType.ORDER_REFUND.toString(),
  },
  {
    label: MigrationDataTypeLabel[Migration_DataType.ORDER_PAYMENT],
    value: Migration_DataType.ORDER_PAYMENT.toString(),
  },
]

export const MigrationStatusLabel = Object.freeze({
  [Migration_Job_Status.UNSPECIFIED]: "Unknown",
  [Migration_Job_Status.PENDING]: "Pending",
  [Migration_Job_Status.PROCESSING]: "Processing",
  [Migration_Job_Status.COMPLETED]: "Completed",
  [Migration_Job_Status.FAILED]: "Failed",
  [Migration_Job_Status.READY_FOR_PROCESSING]: "Ready for processing",
})

export const MigrationStatusOptions = [
  {
    label: MigrationStatusLabel[Migration_Job_Status.PENDING],
    value: Migration_Job_Status.PENDING.toString(),
  },
  {
    label: MigrationStatusLabel[Migration_Job_Status.PROCESSING],
    value: Migration_Job_Status.PROCESSING.toString(),
  },
  {
    label: MigrationStatusLabel[Migration_Job_Status.COMPLETED],
    value: Migration_Job_Status.COMPLETED.toString(),
  },
  {
    label: MigrationStatusLabel[Migration_Job_Status.FAILED],
    value: Migration_Job_Status.FAILED.toString(),
  },
  {
    label: MigrationStatusLabel[Migration_Job_Status.UNSPECIFIED],
    value: Migration_Job_Status.UNSPECIFIED.toString(),
  },
  {
    label: MigrationStatusLabel[Migration_Job_Status.READY_FOR_PROCESSING],
    value: Migration_Job_Status.READY_FOR_PROCESSING.toString(),
  },
]
