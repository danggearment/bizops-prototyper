import { create } from "zustand"

interface SetOpen {
  notFoundOrders: string[]
}

interface Props {
  open: boolean
  notFoundOrders: string[]
  actions: {
    setOpen: (props: SetOpen) => void
    onClose: () => void
  }
}

export const useNotFoundOrders = create<Props>((set) => ({
  open: false,
  notFoundOrders: [],
  actions: {
    setOpen: ({ notFoundOrders }: SetOpen) =>
      set({ notFoundOrders, open: true }),
    onClose: () => set({ open: false }),
  },
}))
