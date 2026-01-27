import { create } from "zustand"

interface SetOpen {
  onConfirm: Props["onConfirm"]
  value: Props["value"]
  maxLength?: Props["maxLength"]
}

interface Props {
  open: boolean
  value: string
  maxLength: number
  onConfirm: (text: string) => void | Promise<void>
  actions: {
    setOpen: (props: SetOpen) => void
    onClose: () => void
  }
}

export const useEnterSearchText = create<Props>((set) => ({
  open: false,
  maxLength: 100,
  value: "",
  onConfirm: () => {},
  actions: {
    setOpen: ({ value, onConfirm, maxLength }: SetOpen) =>
      set(() => ({
        value,
        open: true,
        onConfirm,
        maxLength: maxLength ?? 100,
      })),
    onClose: () => set(() => ({ open: false })),
  },
}))
