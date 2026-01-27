import { create } from "zustand"

interface SetOpenProps {
  title?: string
  onConfirm: (reasonId: string, reason: string) => void | Promise<void>
}

interface SuspendCreditModalStore {
  open: boolean
  title: string
  onConfirm: (reasonId: string, reason: string) => void | Promise<void>
  onClose: () => void
  setOpen: (props: SetOpenProps) => void
}

export const useSuspendCreditModal = create<SuspendCreditModalStore>((set) => ({
  open: false,
  title: "",
  onConfirm: () => {},
  setOpen: ({ title, onConfirm }: SetOpenProps) =>
    set(() => ({
      open: true,
      title: title || "Suspend G-Credit",
      onConfirm,
    })),
  onClose: () => set(() => ({ open: false })),
}))
