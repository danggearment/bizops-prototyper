import { create } from "zustand"

interface SetOpen {
  onConfirm: Props["onConfirm"]
  groupId: Props["groupId"]
}

interface Props {
  open: boolean
  groupId: string | undefined
  onConfirm: (values: string[]) => Promise<void>
  actions: {
    onOpen: (props: SetOpen) => void
    onClose: () => void
  }
}

export const useModalExcludeAttributeValue = create<Props>((set) => ({
  open: false,
  groupId: undefined,
  onConfirm: async () => {},
  actions: {
    onOpen: (props: SetOpen) => set({ open: true, ...props }),
    onClose: () => set({ open: false }),
  },
}))
