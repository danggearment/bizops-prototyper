import { ModalConfirmPaid } from "@/services/modals/modal-confirm-paid/modal-confirm-paid"
import { useModalConfirmPaid } from "@/services/modals/modal-confirm-paid/modal-confirm-paid-store"
import {
  ShippingPlan,
  ShippingPlan_Status,
} from "@gearment/nextapi/api/ffm/v1/cross_dock_pb"
import { Button } from "@gearment/ui3"

export default function ConfirmShippingPlanPaid({
  shippingPlan,
}: {
  shippingPlan: ShippingPlan
}) {
  const actions = useModalConfirmPaid((state) => state.actions)

  const handleConfirm = () => {
    actions.setOpen({
      shippingPlanId: shippingPlan.planId,
    })
  }
  const enable = shippingPlan.status === ShippingPlan_Status.UNDER_REVIEW

  return (
    <>
      <Button variant="outline" disabled={!enable} onClick={handleConfirm}>
        Confirm paid
      </Button>
      <ModalConfirmPaid />
    </>
  )
}
