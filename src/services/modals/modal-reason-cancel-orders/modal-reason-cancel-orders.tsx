import { ReasonCancelOrders } from "@/schemas/schemas/all-orders"
import { useQueryPod } from "@/services/connect-rpc/transport"
import { staffListOrderCancelReason } from "@gearment/nextapi/api/pod/v1/admin_api-OrderAdminAPI_connectquery"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@gearment/ui3"
import { useEffect, useState } from "react"
import ConfirmCancel from "./components/confirm-cancel"
import { FormReason } from "./components/form-reason"
import { useReasonCancelOrdersModal } from "./modal-reason-cancel-orders"

export const ModalReasonCancelOrders = () => {
  const { open, actions, listOrderId, status, step } =
    useReasonCancelOrdersModal()
  const { setStep, onClose } = actions

  const { data } = useQueryPod(
    staffListOrderCancelReason,
    {},
    {
      enabled: open,
    },
  )
  useEffect(() => {
    if (data?.reasons.length) {
      const firstReason = data?.reasons[0]
      if (firstReason) {
        setReasonId(firstReason.reasonId)
      }
    }
  }, [data, open])

  const [reasonId, setReasonId] = useState("")
  const [customReason, setCustomReason] = useState("")

  const handleSubmit = async (values: ReasonCancelOrders) => {
    setReasonId(values.reasonId)
    setCustomReason(values.customReason ?? "")
    setStep("2_confirm_cancel")
  }

  const handleClose = () => {
    onClose()
    setReasonId("")
    setCustomReason("")
    setStep("1_form_reason")
  }
  const defaultValues = {
    reasonId: reasonId,
    customReason: customReason,
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="min-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            Reason for cancellation
          </DialogTitle>
          <DialogDescription className="text-center">
            Please provide a valid reason to proceed with the cancellation.
          </DialogDescription>
        </DialogHeader>
        {step === "1_form_reason" && (
          <FormReason
            defaultValues={defaultValues}
            handleSubmit={handleSubmit}
            data={data}
          />
        )}
        {step === "2_confirm_cancel" && (
          <ConfirmCancel
            status={status}
            listOrderId={listOrderId}
            reasonId={reasonId}
            customReason={customReason}
            handleClose={handleClose}
            reasonList={data?.reasons ?? []}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
