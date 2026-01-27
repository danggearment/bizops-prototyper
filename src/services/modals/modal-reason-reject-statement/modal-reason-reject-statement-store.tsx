import { ReasonRejectStatement } from "@/schemas/schemas/payment"
import { create } from "zustand"

interface SetOpenProps {
  onConfirm: (values: ReasonRejectStatement) => void | Promise<void>
}

interface ReasonRejectStatementModalStore {
  open: boolean
  onConfirm: (values: ReasonRejectStatement) => void | Promise<void>
  onClose: () => void
  setOpen: (props: SetOpenProps) => void
}

export const useRejectReasonStatementModal =
  create<ReasonRejectStatementModalStore>((set) => ({
    open: false,
    onConfirm: () => {},
    viewOnly: false,
    setOpen: ({ onConfirm }: SetOpenProps) =>
      set(() => ({
        open: true,
        onConfirm,
      })),
    onClose: () => set(() => ({ open: false })),
  }))
