import { create } from "zustand"

interface SetOpen {
  onSave: Props["onSave"]
  orderIds: Props["orderIds"]
}

interface Props {
  open: boolean
  onSave: () => void | Promise<void>
  onClose: () => void
  setOpen: (props: SetOpen) => void
  orderIds: string[]
}

export const useMarkFulfilledOrderModal = create<Props>((set) => ({
  open: false,
  orderIds: [],
  onSave: () => {},
  setOpen: ({ onSave, orderIds }: SetOpen) =>
    set(() => ({
      open: true,
      onSave,
      orderIds,
    })),
  onClose: () => set(() => ({ open: false })),
}))
