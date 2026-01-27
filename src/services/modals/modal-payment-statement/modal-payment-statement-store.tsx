import { create } from "zustand"

interface SetOpenProps {
  onConfirm: (policyNote: string) => void | Promise<void>
  statementId: string
  viewOnly?: boolean
}

interface PaymentStatementModalStore {
  open: boolean
  onConfirm: (policyNote: string) => void | Promise<void>
  onClose: () => void
  setOpen: (props: SetOpenProps) => void
  statementId: string
  viewOnly: boolean
}

export const usePaymentStatementModal = create<PaymentStatementModalStore>(
  (set) => ({
    open: false,
    title: "",
    confirmText: "",
    onConfirm: () => {},
    statementId: "",
    viewOnly: false,
    setOpen: ({ onConfirm, statementId, viewOnly = false }: SetOpenProps) =>
      set(() => ({
        open: true,
        onConfirm,
        statementId,
        viewOnly,
      })),
    onClose: () => set(() => ({ open: false })),
  }),
)
