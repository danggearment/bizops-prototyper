import { create } from "zustand"
import React from "react"

interface SetOpen {
  onConfirm: Props["onConfirm"]
  title: Props["title"]
  description?: Props["description"]
  OK?: Props["OK"]
}

interface Props {
  OK?: React.ReactNode
  open: boolean
  title: string
  description: React.ReactNode
  onConfirm: () => void | Promise<void>
  onClose: () => void
  setOpen: (props: SetOpen) => void
}

export const useSeedPolicyModal = create<Props>((set) => ({
  open: false,
  OK: "Submit",
  title: "",
  description: "",
  onConfirm: () => {},
  setOpen: ({ onConfirm, title, description, OK = "Submit" }: SetOpen) =>
    set(() => ({
      open: true,
      onConfirm,
      title,
      description,
      OK,
    })),
  onClose: () => set(() => ({ open: false })),
}))
