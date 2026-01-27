import { GMProduct_Admin_Short } from "@/services/connect-rpc/types"
import { create } from "zustand"

interface OpenProps {
  product: Props["product"]
}

interface Props {
  open: boolean
  product: GMProduct_Admin_Short | undefined
  actions: {
    onOpen: (props: OpenProps) => void
    onClose: () => void
  }
}

export const useViewProductVariants = create<Props>((set) => ({
  open: false,
  variants: [],
  product: undefined,
  actions: {
    onOpen: (props: OpenProps) => set({ open: true, ...props }),
    onClose: () => set({ open: false }),
  },
}))
