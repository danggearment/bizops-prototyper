import React from "react"
import { create } from "zustand"
interface SetOpen {
  onConfirm: Props["onConfirm"]
  title: Props["title"]
  description?: Props["description"]
  OK?: Props["OK"]
  className?: Props["className"]
}

interface Props {
  OK?: React.ReactNode
  open: boolean
  title: string
  description: React.ReactNode
  onConfirm: () => void | Promise<void>
  onClose: () => void
  setOpen: (props: SetOpen) => void
  className?: string
}
export const useNotificationModal = create<Props>((set) => ({
  open: false,
  OK: "OK",
  title: "",
  description: "",
  className: "",
  onConfirm: () => {},
  setOpen: ({ onConfirm, title, description, OK, className }: SetOpen) =>
    set(() => ({
      open: true,
      onConfirm,
      title,
      description,
      OK,
      className,
    })),
  onClose: () => set(() => ({ open: false })),
}))
