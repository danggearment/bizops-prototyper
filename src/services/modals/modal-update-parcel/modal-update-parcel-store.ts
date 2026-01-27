import { create } from "zustand"

interface SetOpen {
  shippingPlanId: Props["shippingPlanId"]
  shippingParcelId: Props["shippingParcelId"]
}

interface Props {
  open: boolean
  shippingPlanId: string
  shippingParcelId: string
  actions: {
    onConfirm: () => void
    setOpen: (props: SetOpen) => void
    onClose: () => void
  }
}

export const useUpdateParcelModal = create<Props>((set) => ({
  open: false,
  shippingPlanId: "",
  shippingParcelId: "",
  actions: {
    onConfirm: () => {},
    setOpen: ({ shippingPlanId, shippingParcelId }: SetOpen) =>
      set(() => ({
        open: true,
        shippingPlanId,
        shippingParcelId,
      })),
    onClose: () =>
      set(() => ({
        open: false,
        shippingPlanId: "",
        shippingParcelId: "",
      })),
  },
}))
