import { AllOrder_Type } from "@/services/connect-rpc/types"
import { create } from "zustand"

interface SetOpen {
  onConfirm: Props["onConfirm"]
  value: Props["value"]
  errorMessage: Props["errorMessage"]
  type: Props["type"]
}

interface Props {
  open: boolean
  value: string
  maxLength: number
  errorMessage: string
  type: AllOrder_Type
  setType: (type: AllOrder_Type) => void
  onConfirm: (text: string, type: AllOrder_Type) => void | Promise<void>
  actions: {
    setOpen: (props: SetOpen) => void
    onClose: () => void
  }
}

export const useSearchOrders = create<Props>((set) => ({
  open: false,
  maxLength: 100,
  value: "",
  errorMessage: "Max length is ",
  onConfirm: () => {},
  type: AllOrder_Type.ALL,
  setType: (type: AllOrder_Type) => set(() => ({ type })),
  actions: {
    setOpen: ({ value, onConfirm, errorMessage, type }: SetOpen) =>
      set(() => ({
        value,
        open: true,
        onConfirm,
        errorMessage,
        type,
      })),
    onClose: () => set(() => ({ open: false })),
  },
}))
