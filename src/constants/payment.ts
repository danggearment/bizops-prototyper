import {
  CreditIntervalUnit,
  CreditStatementPaymentRequestStatus,
  CreditStatementPaymentStatus,
  CreditStatementStatus,
  CreditStatus,
  LinkedPaymentMethodStatus,
  OrderAdmin_OrderPaymentStatus,
  TeamTransactionType,
  TransactionExportSessionStatus,
} from "@/services/connect-rpc/types"
import { ExportType } from "@/services/modals/modal-export-orders"

export const AllOrderAdminPaymentStatus = Object.freeze(
  OrderAdmin_OrderPaymentStatus,
)

export const LinkedPaymentMethodStatusLabel = Object.freeze({
  [LinkedPaymentMethodStatus.UNSPECIFIED]: "All",
  [LinkedPaymentMethodStatus.INACTIVE]: "Deactivate",
  [LinkedPaymentMethodStatus.ACTIVE]: "Activate",
})

export const AllLinkedPaymentMethodStatus = Object.freeze(
  LinkedPaymentMethodStatus,
)

export type AllLinkedPaymentMethodKeys =
  keyof typeof AllLinkedPaymentMethodStatus
export type AllStoreStatusValue =
  (typeof AllLinkedPaymentMethodStatus)[AllLinkedPaymentMethodKeys]

export const TransactionTypeLabel = Object.freeze({
  [TeamTransactionType.ALL]: "All",
  [TeamTransactionType.DEPOSIT]: "Deposit",
  [TeamTransactionType.PAYMENT]: "Payment",
  [TeamTransactionType.REFUND]: "Refund",
  [TeamTransactionType.TRANSFER]: "Transfer",
  [TeamTransactionType.UNSPECIFIED]: "All",
  [TeamTransactionType.ADJUST]: "Adjust",
  [TeamTransactionType.SETTLEMENT]: "Settlement",
  [TeamTransactionType.CASHBACK]: "Cashback",
})

export const AllTransactionType = Object.freeze(TeamTransactionType)
export type AllTransactionType = TeamTransactionType

export type AllTransactionTypeKeys = keyof typeof AllTransactionType
export type AllTransactionTypeValue =
  (typeof AllTransactionType)[AllTransactionTypeKeys]

export const TransactionExportStatusLabel = Object.freeze({
  [TransactionExportSessionStatus.UNSPECIFIED]: "All",
  [TransactionExportSessionStatus.COMPLETED]: "Complete",
  [TransactionExportSessionStatus.FAILED]: "Failed",
  [TransactionExportSessionStatus.IN_PROGRESS]: "In progress",
  [TransactionExportSessionStatus.PENDING]: "Pending",
})

interface ToastMessage {
  title: string
  description: string
}

export const NoRecordExportMessages: Record<ExportType, ToastMessage> = {
  [ExportType.ALL_RECORDS]: {
    title: "No transactions",
    description:
      "No transactions found within the past 6 months to export. Please ensure records are available.",
  },
  [ExportType.FILTERED_RECORDS]: {
    title: "No transactions",
    description:
      "No transactions match the selected filter within the last 6 months. Please adjust your filter.",
  },
}

export const REFUND_FULL_TOOLTIP = `Full refund: allowed only for 'Cancelled' orders.`
export const REFUND_BASE_PRICE_TOOLTIP = `Refund base price is allowed for orders with 'Shipped' or 'Cancelled' status.`
export const REFUND_SHIPPING_FEE_TOOLTIP = `Refund shipping fee is allowed for orders with 'Shipped' or 'Cancelled' status.`
export const REFUND_CUSTOM_AMOUNT_TOOLTIP = `Custom refund is allowed for orders with 'Shipped' or 'Cancelled' status.`
export const ONLY_REFUND_STATUS_CANCELLED = `Refund full is only allowed for orders with 'Cancelled' status.`
export const REFUND_ALLOW_SHIPPED_CANCELLED = `Base price / Shipping fee / Custom refund: allowed for 'Shipped' or 'Cancelled' orders.`

export const G_CREDIT_TAB_KEY = {
  OVERVIEW: "overview",
  BILLING_CYCLE: "billing_cycle",
} as const

export type GCreditTabKey =
  (typeof G_CREDIT_TAB_KEY)[keyof typeof G_CREDIT_TAB_KEY]

export const G_CREDIT_TAB_VALUE: Record<GCreditTabKey, string> = {
  [G_CREDIT_TAB_KEY.OVERVIEW]: "Overview",
  [G_CREDIT_TAB_KEY.BILLING_CYCLE]: "Billing cycle",
}

export const G_CREDIT_TABS: Array<{ key: GCreditTabKey; value: string }> = [
  {
    key: G_CREDIT_TAB_KEY.OVERVIEW,
    value: G_CREDIT_TAB_VALUE[G_CREDIT_TAB_KEY.OVERVIEW],
  },
  {
    key: G_CREDIT_TAB_KEY.BILLING_CYCLE,
    value: G_CREDIT_TAB_VALUE[G_CREDIT_TAB_KEY.BILLING_CYCLE],
  },
]

export const CreditStatusLabel = Object.freeze({
  [CreditStatus.UNSPECIFIED]: "All",
  [CreditStatus.SUSPEND]: "Suspend",
  [CreditStatus.ACTIVE]: "Activate",
  [CreditStatus.SCHEDULED]: "Scheduled",
})

export const CreditIntervalUnitLabel = Object.freeze({
  [CreditIntervalUnit.UNSPECIFIED]: "All",
  [CreditIntervalUnit.DAY]: "Day",
  [CreditIntervalUnit.WEEK]: "Week",
  [CreditIntervalUnit.MONTH]: "Month",
  [CreditIntervalUnit.YEAR]: "Year",
})

export const G_CREDIT_METHOD_CODE = "g_credit"

export const TRANSACTION_LIMIT_OPTIONS = [
  { value: "3", label: "Recent Transactions (3)" },
  { value: "5", label: "Recent Transactions (5)" },
]

export const StatementDateOptions = [
  {
    value: JSON.stringify({ offset: 1, unit: CreditIntervalUnit.WEEK }),
    label: "1 week after Billing Start Date",
  },
  {
    value: JSON.stringify({ offset: 2, unit: CreditIntervalUnit.WEEK }),
    label: "2 weeks after Billing Start Date",
  },
  {
    value: JSON.stringify({ offset: 3, unit: CreditIntervalUnit.WEEK }),
    label: "3 weeks after Billing Start Date",
  },
  {
    value: JSON.stringify({ offset: 1, unit: CreditIntervalUnit.MONTH }),
    label: "1 month after Billing Start Date",
  },
]

export const DueDateOptions = [
  {
    value: JSON.stringify({ offset: 7, unit: CreditIntervalUnit.DAY }),
    label: "7 days after Statement Date",
  },
  {
    value: JSON.stringify({ offset: 10, unit: CreditIntervalUnit.DAY }),
    label: "10 days after Statement Date",
  },
  {
    value: JSON.stringify({ offset: 15, unit: CreditIntervalUnit.DAY }),
    label: "15 days after Statement Date",
  },
  {
    value: JSON.stringify({ offset: 30, unit: CreditIntervalUnit.DAY }),
    label: "30 days after Statement Date",
  },
]

export const COMMON_FORMAT_DATETIME_CREDIT = "YYYY/MM/DD HH:mm A"

export const StatementPaymentLabel = Object.freeze({
  [CreditStatementPaymentStatus.AWAITING_PAYMENT]: "Awaiting Payment",
  [CreditStatementPaymentStatus.PARTIAL_PAID]: "Partially Paid",
  [CreditStatementPaymentStatus.PAID]: "Paid",
  [CreditStatementPaymentStatus.PARTIAL_OVERDUE]: "Partially Overdue",
  [CreditStatementPaymentStatus.UNSPECIFIED]: "Unknown",
  [CreditStatementPaymentStatus.OVERDUE]: "Overdue",
  [CreditStatementPaymentStatus.ALL]: "All",
})

export const StatementStatusLabel = Object.freeze({
  [CreditStatementStatus.OVERDUE]: "Overdue",
  [CreditStatementStatus.COMPLETED]: "Completed",
  [CreditStatementStatus.CANCELLED]: "Cancelled",
  [CreditStatementStatus.ISSUED]: "Issued",
  [CreditStatementStatus.UNSPECIFIED]: "Unknown",
})

export const StatementStatusString = "statement_status"
export const StatementPaymentStatusString = "statement_payment_status"
export const StatementStatusOptions = [
  {
    label: "Awaiting Payment",
    value: `${StatementPaymentStatusString}.${CreditStatementPaymentStatus.AWAITING_PAYMENT}`,
    type: StatementPaymentStatusString,
    code: CreditStatementPaymentStatus.AWAITING_PAYMENT,
  },
  {
    label: "Partially Paid",
    value: `${StatementPaymentStatusString}.${CreditStatementPaymentStatus.PARTIAL_PAID}`,
    type: StatementPaymentStatusString,
    code: CreditStatementPaymentStatus.PARTIAL_PAID,
  },
  {
    label: "Partially Overdue",
    value: `${StatementPaymentStatusString}.${CreditStatementPaymentStatus.PARTIAL_OVERDUE}`,
    type: StatementPaymentStatusString,
    code: CreditStatementPaymentStatus.PARTIAL_OVERDUE,
  },
  {
    label: "Paid",
    value: `${StatementPaymentStatusString}.${CreditStatementPaymentStatus.PAID}`,
    type: StatementPaymentStatusString,
    code: CreditStatementPaymentStatus.PAID,
  },
  {
    label: "Overdue",
    value: `${StatementStatusString}.${CreditStatementStatus.OVERDUE}`,
    type: StatementStatusString,
    code: CreditStatementStatus.OVERDUE,
  },
]

export const StatementPaymentRequestStatusLabel = Object.freeze({
  [CreditStatementPaymentRequestStatus.UNKNOWN]: "All",
  [CreditStatementPaymentRequestStatus.REQUESTED]: "Requested",
  [CreditStatementPaymentRequestStatus.PROCESSING]: "Processing",
  [CreditStatementPaymentRequestStatus.APPROVED]: "Approved",
  [CreditStatementPaymentRequestStatus.REJECTED]: "Rejected",
})
