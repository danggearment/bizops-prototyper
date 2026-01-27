import { create } from "zustand"
import { FlagType } from "./modal-open-feature"

interface SetOpen {
  onSave: Props["onSave"]
  title: Props["title"]
  defaultValues: Props["defaultValues"]
}
interface Props {
  open: boolean
  title: string
  defaultValues: FlagType
  onSave: (values: FlagType) => void | Promise<void>
  actions: {
    onOpen: (props: SetOpen) => void
    onClose: () => void
  }
}

export const useOpenFeatureModal = create<Props>((set) => ({
  open: false,
  title: "",
  onSave: () => {},
  defaultValues: {
    flagName: "",
    whitelist: "",
    version: "",
    defaultActive: false,
  },
  actions: {
    onOpen: ({ onSave, title, defaultValues }: SetOpen) =>
      set(() => ({ open: true, onSave, title, defaultValues })),
    onClose: () => set(() => ({ open: false })),
  },
}))
