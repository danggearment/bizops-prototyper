import { create } from "zustand"

interface SetOpen {
  onConfirm: Props["onConfirm"]
  enableESC?: Props["enableESC"]
  enableOverflow?: Props["enableOverflow"]
  title: Props["title"]
  description?: Props["description"]
  type?: "error" | "info"
}

interface Props {
  type?: "error" | "info"
  open: boolean
  enableESC: boolean
  enableOverflow: boolean
  title: string
  description: React.ReactNode
  onConfirm: () => void | Promise<void>
  onClose: () => void
  setOpen: (props: SetOpen) => void
}
export const useConfirmModal = create<Props>((set) => ({
  open: false,
  enableESC: true,
  enableOverflow: true,
  type: "info",
  title: "",
  description: "",
  onConfirm: () => {},
  setOpen: ({
    onConfirm,
    title,
    description,
    enableESC,
    enableOverflow,
    type,
  }: SetOpen) =>
    set(() => ({
      open: true,
      onConfirm,
      title,
      description,
      enableESC,
      enableOverflow,
      type,
    })),
  onClose: () => set(() => ({ open: false })),
}))
