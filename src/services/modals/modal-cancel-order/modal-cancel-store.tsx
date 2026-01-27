import { create } from "zustand"
import React from "react"
interface SetOpen {
  onConfirm: Props["onConfirm"]
  title: Props["title"]
  description?: Props["description"]
  type?: "error" | "info"
  cancelText?: string
  confirmText?: string
  callbackOnClose?: Props["callbackOnClose"]
}

interface Props {
  type?: "error" | "info"
  open: boolean
  title: string
  description: React.ReactNode
  cancelText: string
  confirmText: string
  onConfirm: () => void | Promise<void>
  onClose: () => void
  setOpen: (props: SetOpen) => void
  callbackOnClose?: () => void
}
export const useModalCancelOrder = create<Props>((set) => ({
  open: false,
  type: "info",
  title: "",
  description: "",
  cancelText: "",
  confirmText: "",
  onConfirm: () => {},
  setOpen: ({
    onConfirm,
    title,
    description,
    type,
    cancelText,
    confirmText,
    callbackOnClose,
  }: SetOpen) =>
    set(() => ({
      open: true,
      onConfirm,
      title,
      description,
      type,
      cancelText,
      confirmText,
      callbackOnClose,
    })),
  onClose: () => set(() => ({ open: false })),
}))
