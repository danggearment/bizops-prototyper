import { DepositRequestStatus } from "@/services/connect-rpc/types"

export const AllDepositRequestStatusLabel = Object.freeze({
  [DepositRequestStatus.UNKNOWN]: "Unknown",
  [DepositRequestStatus.REQUESTED]: "Requested",
  [DepositRequestStatus.APPROVED]: "Approved",
  [DepositRequestStatus.REJECTED]: "Rejected",
})

export const DepositRequestStatusOptions = [
  {
    label: AllDepositRequestStatusLabel[DepositRequestStatus.REQUESTED],
    value: DepositRequestStatus.REQUESTED,
  },

  {
    label: AllDepositRequestStatusLabel[DepositRequestStatus.APPROVED],
    value: DepositRequestStatus.APPROVED,
  },
  {
    label: AllDepositRequestStatusLabel[DepositRequestStatus.REJECTED],
    value: DepositRequestStatus.REJECTED,
  },
]

interface RejectReason {
  label: string
  value: string
}

export const REJECT_REASON_OTHER = "other"
export const RejectReasons: RejectReason[] = [
  {
    label: "Invalid transaction information",
    value: "Invalid transaction information",
  },
  {
    label: "Suspicious activity detected",
    value: "Suspicious activity detected",
  },
  { label: "Incomplete documentation", value: "Incomplete documentation" },
  { label: "Amount exceeds limit", value: "Amount exceeds limit" },
  { label: "Duplicate transaction", value: "Duplicate transaction" },
  { label: "Other compliance issues", value: "Other compliance issues" },
  { label: "Other", value: REJECT_REASON_OTHER },
]
