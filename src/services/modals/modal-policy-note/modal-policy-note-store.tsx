import { create } from "zustand"

interface SetOpenProps {
  title?: string
  initialValue?: string
  confirmText?: string
  onConfirm: (policyNote: string) => void | Promise<void>
}

interface PolicyNoteModalStore {
  open: boolean
  title: string
  initialValue: string
  confirmText: string
  onConfirm: (policyNote: string) => void | Promise<void>
  onClose: () => void
  setOpen: (props: SetOpenProps) => void
}

export const usePolicyNoteModal = create<PolicyNoteModalStore>((set) => ({
  open: false,
  title: "",
  initialValue: "",
  confirmText: "",
  onConfirm: () => {},
  setOpen: ({ title, initialValue, confirmText, onConfirm }: SetOpenProps) =>
    set(() => ({
      open: true,
      title: title || "Add policy note",
      initialValue: initialValue || "",
      confirmText: confirmText || "Add Note",
      onConfirm,
    })),
  onClose: () => set(() => ({ open: false })),
}))
