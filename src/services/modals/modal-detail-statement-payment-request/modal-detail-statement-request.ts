import { create } from "zustand"

interface SetOpenProps {
  onConfirm: () => void | Promise<void>
  requestId: string
}

interface DetailPaymentStatementModalStore {
  open: boolean
  onConfirm: () => void | Promise<void>
  onClose: () => void
  setOpen: (props: SetOpenProps) => void
  requestId: string
}

export const usePaymentStatementDetailModal =
  create<DetailPaymentStatementModalStore>((set) => ({
    open: false,
    onConfirm: () => {},
    requestId: "",
    setOpen: ({ onConfirm, requestId }: SetOpenProps) =>
      set(() => ({
        open: true,
        onConfirm,
        requestId,
      })),
    onClose: () => set(() => ({ open: false })),
  }))
