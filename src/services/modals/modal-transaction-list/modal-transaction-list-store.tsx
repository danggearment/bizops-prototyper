import { create } from "zustand"
import { TeamTransactionType } from "@/services/connect-rpc/types"

export interface TransactionListFilter {
  type?: TeamTransactionType
  teamId?: string[]
  methodCode?: string[]
  from?: Date
  to?: Date
  searchText?: string
}

interface ModalTransactionListStore {
  isOpen: boolean
  filter: TransactionListFilter
  actions: {
    onOpen: (filter?: TransactionListFilter) => void
    onClose: () => void
    setFilter: (filter: TransactionListFilter) => void
  }
}

export const useModalTransactionListStore = create<ModalTransactionListStore>(
  (set) => ({
    isOpen: false,
    filter: {},
    actions: {
      onOpen: (filter?: TransactionListFilter) =>
        set({ isOpen: true, filter: filter || {} }),
      onClose: () => set({ isOpen: false, filter: {} }),
      setFilter: (filter: TransactionListFilter) => set({ filter }),
    },
  }),
)
