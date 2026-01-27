import { create } from "zustand"

interface SetOpen {
  shippingPlanId: Props["shippingPlanId"]
}

interface Props {
  open: boolean
  shippingPlanId: string
  actions: {
    onConfirm: () => void
    setOpen: (props: SetOpen) => void
    onClose: () => void
  }
}

export const useModalConfirmPaid = create<Props>((set) => ({
  open: false,
  shippingPlanId: "",
  actions: {
    onConfirm: () => {},
    setOpen: ({ shippingPlanId }: SetOpen) =>
      set(() => ({
        open: true,
        shippingPlanId,
      })),
    onClose: () =>
      set(() => ({
        open: false,
      })),
  },
}))
