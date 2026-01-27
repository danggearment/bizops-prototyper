import { useQueryFinance } from "@/services/connect-rpc/transport"
import { ApproveReasonType } from "@/services/connect-rpc/types"
import { staffListApproveReason } from "@gearment/nextapi/api/payment/v1/payment_admin-PaymentAdminAPI_connectquery"
import {
  Button,
  ComboboxField,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  TextareaField,
} from "@gearment/ui3"
import { useEffect, useState } from "react"
import { useSuspendCreditModal } from "./modal-suspend-credit-store"

interface ApproveReason {
  approveReasonId: string
  reason: string
  isCustom: boolean
}

export function ModalSuspendCredit() {
  const { open, onClose, title, onConfirm } = useSuspendCreditModal()
  const [selectedReasonId, setSelectedReasonId] = useState("")
  const [customReason, setCustomReason] = useState("")

  const { data: approveReasonData } = useQueryFinance(
    staffListApproveReason,
    {
      type: ApproveReasonType.CREDIT_SUSPEND,
    },
    {
      enabled: open,
      select: (data) => data?.data as ApproveReason[] | undefined,
    },
  )

  const reasons: ApproveReason[] = approveReasonData || []

  const options = reasons.map((r: ApproveReason) => ({
    value: r.approveReasonId.toString(),
    label: r.reason,
  }))

  const selectedReason = reasons.find(
    (r: ApproveReason) => r.approveReasonId.toString() === selectedReasonId,
  )
  const isCustomReason = selectedReason?.isCustom || false

  useEffect(() => {
    if (open) {
      setSelectedReasonId("")
      setCustomReason("")
    }
  }, [open])

  const handleConfirm = async () => {
    if (!selectedReasonId) return
    const reasonText = isCustomReason
      ? customReason.trim()
      : selectedReason?.reason || ""
    await onConfirm(selectedReasonId, reasonText)
    onClose()
  }

  const trimmedCustom = customReason.trim()
  const disabledConfirm =
    !selectedReasonId || (isCustomReason && trimmedCustom.length < 5)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Please select a reason for suspending G-Credit.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <div className="font-medium">
              Reason for Suspension<span className="text-red-500">*</span>
            </div>
            <ComboboxField
              value={selectedReasonId}
              onChange={setSelectedReasonId}
              options={options}
              modal
              placeholder="Select reason"
            />
          </div>

          {isCustomReason && (
            <div className="space-y-2">
              <div className="font-medium">
                Custom Reason<span className="text-red-500">*</span>
              </div>
              <TextareaField
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                rows={3}
                placeholder="Enter custom reason"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant={"destructive"}
              disabled={disabledConfirm}
              onClick={handleConfirm}
            >
              Confirm Suspension
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
