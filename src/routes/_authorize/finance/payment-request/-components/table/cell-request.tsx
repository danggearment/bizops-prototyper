import { Credit_StatementPaymentRequest_Admin } from "@/services/connect-rpc/types"
import { usePaymentStatementDetailModal } from "@/services/modals/modal-detail-statement-payment-request"
import { ButtonIconCopy } from "@gearment/ui3"
import { formatShortenText } from "@gearment/utils"
import { CellContext } from "@tanstack/react-table"

export default function CellRequest(
  props: CellContext<Credit_StatementPaymentRequest_Admin, any>,
) {
  const requestId = props.row.original.requestId

  const [
    setOpenPaymentStatementDetailModal,
    onClosePaymentStatementDetailModal,
  ] = usePaymentStatementDetailModal((state) => [state.setOpen, state.onClose])

  const handleOpenModal = () => {
    setOpenPaymentStatementDetailModal({
      onConfirm: () => {
        onClosePaymentStatementDetailModal()
      },
      requestId: props.row.original.requestId,
    })
  }

  return (
    <>
      <span className="flex items-center gap-2">
        <div onClick={handleOpenModal} className="font-medium cursor-pointer">
          {formatShortenText(requestId, 4, 8)}
        </div>
        <ButtonIconCopy
          size={"sm"}
          copyValue={requestId || ""}
          className="ml-2"
        />
      </span>
      <p className="text-sm text-foreground/50">
        Statement ID: {props.row.original.statementId || "--"}
      </p>
      <p className="text-sm text-foreground/50">
        Ref ID: {props.row.original.txnRef || "--"}
      </p>
    </>
  )
}
