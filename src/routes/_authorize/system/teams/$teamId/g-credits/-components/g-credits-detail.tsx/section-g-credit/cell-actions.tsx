import {
  CreditStatementPaymentStatus,
  CreditStatementStatus,
  StaffListStatementHistoryResponse_StatementHistory,
} from "@/services/connect-rpc/types"
import { usePaymentStatementModal } from "@/services/modals/modal-payment-statement"
import { Button } from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"
import { CircleDollarSign, CreditCard, Eye } from "lucide-react"

export default function CellActions(
  props: CellContext<StaffListStatementHistoryResponse_StatementHistory, any>,
) {
  const { setOpen: openPaymentStatementModal } = usePaymentStatementModal()
  const original = props.row.original
  const isOverDue = props.row.original.status === CreditStatementStatus.OVERDUE

  const handleApprovePayment = () => {
    openPaymentStatementModal({
      onConfirm: () => {},
      statementId: original.statementId,
    })
  }

  switch (original.paymentStatus) {
    case CreditStatementPaymentStatus.AWAITING_PAYMENT:
    case CreditStatementPaymentStatus.OVERDUE:
      return (
        <>
          <Button
            variant={`${isOverDue ? "destructive" : "default"}`}
            className="border rounded-lg cursor-pointer w-40"
            onClick={handleApprovePayment}
          >
            <CircleDollarSign className="w-4 h-4" />
            Approve Payment
          </Button>
        </>
      )
    case CreditStatementPaymentStatus.PAID:
      return (
        <Button
          variant={"ghost"}
          onClick={handleApprovePayment}
          className="border rounded-lg cursor-pointer w-40"
        >
          <Eye className="w-4 h-4" />
          View Detail
        </Button>
      )
    case CreditStatementPaymentStatus.PARTIAL_PAID:
    case CreditStatementPaymentStatus.PARTIAL_OVERDUE:
      return (
        <>
          <Button
            onClick={handleApprovePayment}
            variant={`${isOverDue ? "destructive" : "default"}`}
            className="border rounded-lg cursor-pointer w-40"
          >
            <CreditCard className="w-4 h-4" /> Continue Payment
          </Button>
        </>
      )
    default:
      return <></>
  }
}
