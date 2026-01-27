import { create } from "zustand"
import { UpdateShippingParcelTrackingInfoType } from "@/schemas/schemas/shipping-plan"

interface SetOpen {
  shippingPlanId: Props["shippingPlanId"]
  shippingParcelId: Props["shippingParcelId"]
  trackingInfo?: UpdateShippingParcelTrackingInfoType
}

interface Props {
  open: boolean
  shippingPlanId: string
  shippingParcelId: string
  trackingInfo?: UpdateShippingParcelTrackingInfoType
  actions: {
    onConfirm: () => void
    setOpen: (props: SetOpen) => void
    onClose: () => void
  }
}

export const useUpdateTrackingInfoModal = create<Props>((set) => ({
  open: false,
  shippingPlanId: "",
  shippingParcelId: "",
  trackingInfo: {
    trackingNumber: "",
    trackingUrl: "",
    trackingCarrier: "",
    trackingService: "",
    labelUrl: "",
  },
  actions: {
    onConfirm: () => {},
    setOpen: ({ shippingPlanId, shippingParcelId, trackingInfo }: SetOpen) =>
      set(() => ({
        open: true,
        shippingPlanId,
        shippingParcelId,
        trackingInfo,
      })),
    onClose: () =>
      set(() => ({
        open: false,
        trackingInfo: {
          trackingNumber: "",
          trackingUrl: "",
          trackingCarrier: "",
          trackingService: "",
          labelUrl: "",
        },
      })),
  },
}))
