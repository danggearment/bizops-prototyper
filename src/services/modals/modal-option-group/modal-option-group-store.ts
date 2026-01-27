import { create } from "zustand"
import { OptionGroupType } from "./modal-option-group"

interface SetOpen {
  title: Props["title"]
  description: Props["description"]
  confirmText: Props["confirmText"]
  defaultValues: Props["defaultValues"]
  disabledChangeType?: Props["disabledChangeType"]
  onConfirm: Props["onConfirm"]
}

interface Props {
  open: boolean
  title: string | undefined
  description: string | undefined
  confirmText: string | undefined
  onConfirm: (values: OptionGroupType) => Promise<void>
  defaultValues: OptionGroupType | undefined
  disabledChangeType: boolean
  actions: {
    onOpen: (props: SetOpen) => void
    onClose: () => void
  }
}

export const useModalOptionGroup = create<Props>((set) => ({
  open: false,
  title: undefined,
  description: undefined,
  confirmText: undefined,
  defaultValues: undefined,
  disabledChangeType: false,
  onConfirm: async () => {},
  actions: {
    onOpen: (props: SetOpen) => set({ open: true, ...props }),
    onClose: () => set({ open: false }),
  },
}))
