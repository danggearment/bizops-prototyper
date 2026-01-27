import { create } from "zustand"
import { MigrationType } from "./modal-migration"

interface SetOpen {
  onCreate: Props["onCreate"]
}

interface Props {
  open: boolean
  onCreate: (values: MigrationType) => void | Promise<void>
  onClose: () => void
  setOpen: (props: SetOpen) => void
}
export const useMigrationModal = create<Props>((set) => ({
  open: false,
  onCreate: () => {},
  setOpen: (props: SetOpen) => set(() => ({ open: true, ...props })),
  onClose: () => set(() => ({ open: false })),
}))
