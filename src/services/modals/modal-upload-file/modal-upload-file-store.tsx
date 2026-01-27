import { create } from "zustand"

interface SetOpenProps {
  title?: string
  confirmText?: string
  onConfirm: (uppyInstance: any) => void | Promise<void>
}

interface UploadFileModalStore {
  open: boolean
  title: string
  confirmText: string
  onConfirm: (uppyInstance: any) => void | Promise<void>
  onClose: () => void
  setOpen: (props: SetOpenProps) => void
}

export const useUploadFileModal = create<UploadFileModalStore>((set) => ({
  open: false,
  title: "",
  confirmText: "",
  onConfirm: () => {},
  setOpen: ({ title, confirmText, onConfirm }: SetOpenProps) =>
    set(() => ({
      open: true,
      title: title || "Upload Files",
      confirmText: confirmText || "Upload",
      onConfirm,
    })),
  onClose: () => set(() => ({ open: false })),
}))
