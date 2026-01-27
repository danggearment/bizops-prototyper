// store.ts - Enhanced store with refund type handling
import { Order_Admin, Reason } from "@/services/connect-rpc/types"
import { create } from "zustand"
export type RefundType =
  | "fully"
  | "fullShippingFee"
  | "refundBasePrice"
  | "refundCustom"

export interface RefundComponentProps {
  orderIds: string[]
  onBack: () => void
  onClose: () => void
  reasons: Reason[]
}

export enum RefundStep {
  SelectReason = "selectReason",
  RefundDetails = "refundDetails",
}

interface RefundOrderState {
  open: boolean
  refundType: RefundType
  selectedOrders: Order_Admin[]
  currentStep: RefundStep
  actions: {
    onOpen: (
      refundType: RefundType,
      selectedOrders: Order_Admin[],
      callbackSuccess?: () => void,
    ) => void
    onClose: () => void

    nextStep: () => void
    prevStep: () => void
    reset: () => void
    setSelectedOrders: (selectedOrders: Order_Admin[]) => void
  }
  callbackSuccess: () => void
}

export const useRefundOrder = create<RefundOrderState>((set) => ({
  open: false,
  refundType: "fully",
  selectedOrders: [],
  currentStep: RefundStep.SelectReason,
  callbackSuccess: () => {},
  actions: {
    onOpen: (refundType, selectedOrders, callbackSuccess) =>
      set(() => ({
        open: true,
        refundType,
        selectedOrders: selectedOrders,
        currentStep: RefundStep.SelectReason,
        callbackSuccess,
      })),
    onClose: () =>
      set((state) => ({
        ...state,
        currentStep: RefundStep.SelectReason,
        open: false,
      })),

    nextStep: () =>
      set((state) => {
        return {
          ...state,
          currentStep: RefundStep.RefundDetails,
        }
      }),
    prevStep: () =>
      set((state) => ({
        ...state,
        currentStep: RefundStep.SelectReason,
      })),
    reset: () =>
      set((state) => ({
        ...state,
        currentStep: RefundStep.SelectReason,
      })),
    setSelectedOrders: (selectedOrders: Order_Admin[]) =>
      set((state) => ({
        ...state,
        selectedOrders: selectedOrders,
      })),
  },
}))
