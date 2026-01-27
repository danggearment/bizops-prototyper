import { Migration_Job } from "@/services/connect-rpc/types"
import { create } from "zustand"

interface SetOpen {
  migrationJob: Migration_Job
}

interface Props {
  open: boolean
  migrationJob: Migration_Job | null
  onClose: () => void
  setOpen: (props: SetOpen) => void
}

export const useMigrationJobDetailModal = create<Props>((set) => ({
  open: false,
  migrationJob: null,
  onClose: () => set(() => ({ open: false, migrationJob: null })),
  setOpen: ({ migrationJob }: SetOpen) =>
    set(() => ({
      open: true,
      migrationJob,
    })),
}))
