import { OnHoldType } from "@/services/connect-rpc/types"
import { create } from "zustand"
import { OnHoldOrdersType } from "./modal-on-hold-orders"

interface SetOpen {
  onSave: Props["onSave"]
  title: Props["title"]
  description: Props["description"]
  onHoldType: Props["onHoldType"]
}

interface Props {
  open: boolean
  title: string
  description: string
  onHoldType: OnHoldType
  onSave: (values: OnHoldOrdersType) => void | Promise<void>
  onClose: () => void
  setOpen: (props: SetOpen) => void
}
export const useOnHoldOrderModal = create<Props>((set) => ({
  open: false,
  title: "",
  description: "",
  onHoldType: OnHoldType.UNSPECIFIED,
  onSave: () => {},
  setOpen: ({ onSave, title, description, onHoldType }: SetOpen) =>
    set(() => ({
      open: true,
      onSave,
      title,
      description,
      onHoldType,
    })),
  onClose: () => set(() => ({ open: false })),
}))
