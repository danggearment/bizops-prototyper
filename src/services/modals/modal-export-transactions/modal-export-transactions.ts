// modal-export-transactions.ts
import { create } from "zustand"
import { z } from "zod"

export enum ExportType {
  ALL_RECORDS,
  FILTERED_RECORDS,
}

export const EXPORT_CATEGORY = {
  TRANSACTION: "transaction",
}

export type ExportContentType =
  (typeof EXPORT_CATEGORY)[keyof typeof EXPORT_CATEGORY]

export interface ExportModalLabels {
  title: string
  allRecordsLabel: string
  filteredRecordsLabel: string
  allRecordsDescription: string
  filteredRecordsDescription: string
}

export const EXPORT_MODAL_CONTENT: Record<
  ExportContentType,
  ExportModalLabels
> = {
  [EXPORT_CATEGORY.TRANSACTION]: {
    title: "Export Transactions",
    allRecordsLabel: "All transactions",
    filteredRecordsLabel: "Filtered transactions",
    allRecordsDescription:
      "All transactions created within the last 6 months will be exported",
    filteredRecordsDescription:
      "Only transactions created within the last 6 months that match the filter criteria will be exported.",
  },
}

export const ExportTransactionsSchema = z.object({
  exportType: z.nativeEnum(ExportType, {
    required_error: "Export type is required",
  }),
})

export type ExportTransactionsType = z.infer<typeof ExportTransactionsSchema>

interface SetOpen {
  onSave: Props["onSave"]
  allRecordsLength: Props["allRecordsLength"]
  filteredLength: Props["filteredLength"]
  type: ExportContentType
}

interface Props {
  open: boolean
  allRecordsLength: number
  filteredLength: number
  onSave: (values: ExportTransactionsType) => void | Promise<void>
  onClose: () => void
  setOpen: (props: SetOpen) => void
  type: ExportContentType
}

export const useExportTransactions = create<Props>((set) => ({
  open: false,
  allRecordsLength: 0,
  filteredLength: 0,
  onSave: () => {},
  type: EXPORT_CATEGORY.TRANSACTION,
  setOpen: ({ onSave, allRecordsLength, filteredLength, type }: SetOpen) =>
    set(() => {
      console.log("setOpen called with:", {
        onSave,
        allRecordsLength,
        filteredLength,
        type,
      })
      return {
        open: true,
        onSave,
        allRecordsLength,
        filteredLength,
        type,
      }
    }),
  onClose: () => set(() => ({ open: false })),
}))
