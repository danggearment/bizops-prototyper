import { create } from "zustand"
import { AllOrderStatus } from "@/constants/all-orders-status"

export const ReasonCancelOrdersType = {
  ANOTHER_REASON: "another_reason",
}

interface SetOpen {
  listOrderId?: string[]
  status?: AllOrderStatus
  step: "1_form_reason" | "2_confirm_cancel"
  callbackWhenSuccess?: () => void
}

interface Props {
  open: boolean
  step: "1_form_reason" | "2_confirm_cancel"
  listOrderId: string[]
  status: AllOrderStatus
  callbackWhenSuccess?: () => void
  actions: {
    setStep: (step: "1_form_reason" | "2_confirm_cancel") => void
    onClose: () => void
    setOpen: (props: SetOpen) => void
  }
}
export const useReasonCancelOrdersModal = create<Props>((set) => ({
  open: false,
  step: "1_form_reason",
  listOrderId: [],
  status: AllOrderStatus.ALL,
  callbackWhenSuccess: undefined,
  actions: {
    setStep: (step) => {
      set(() => ({ step: step }))
    },
    onClose: () => set(() => ({ open: false })),
    setOpen: ({ listOrderId, status, callbackWhenSuccess }) =>
      set(() => ({
        open: true,
        listOrderId,
        status,
        callbackWhenSuccess,
      })),
  },
}))
