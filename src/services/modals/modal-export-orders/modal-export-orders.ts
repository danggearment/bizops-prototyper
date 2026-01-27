// modal-export-orders.ts
import { Order_ListingSearch } from "@/services/connect-rpc/types"
import { z } from "zod"
import { create } from "zustand"

export enum ExportType {
  ALL_RECORDS,
  FILTERED_RECORDS,
}

export const EXPORT_CATEGORY = {
  ORDER: "order",
  ITEM: "item",
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
  [EXPORT_CATEGORY.ORDER]: {
    title: "Export orders",
    allRecordsLabel: "All orders",
    filteredRecordsLabel: "Filtered orders",
    allRecordsDescription:
      "All orders created within the last 6 months will be exported",
    filteredRecordsDescription:
      "Only orders created within the last 6 months that match the filter criteria will be exported.",
  },
  [EXPORT_CATEGORY.ITEM]: {
    title: "Export order items",
    allRecordsLabel: "All orders items",
    filteredRecordsLabel: "Filtered orders items",
    allRecordsDescription:
      "All items created within the last 6 months will be exported",
    filteredRecordsDescription:
      "Only items created within the last 6 months that match the filter criteria will be exported.",
  },
}

export const ExportOrderSchema = z.object({
  exportType: z.nativeEnum(ExportType, {
    required_error: "Export type is required",
  }),
})

export type ExportOrdersType = z.infer<typeof ExportOrderSchema>

interface SetOpen {
  onSave: Props["onSave"]
  type: ExportContentType
  filter: Props["filter"]
}

interface Props {
  open: boolean
  onClose: () => void
  setOpen: (props: SetOpen) => void
  type: ExportContentType
  filter: {
    limit: number
    page: number
    search: Order_ListingSearch
    filter: Record<string, any>
  }
  onSave: (exportType: ExportOrdersType) => void | Promise<void>
}

export const useExportOrders = create<Props>((set) => ({
  open: false,
  filter: {
    limit: 10,
    page: 1,
    search: new Order_ListingSearch({}),
    filter: {},
  },
  type: EXPORT_CATEGORY.ORDER,
  onSave: () => {},
  setOpen: ({ type, filter, onSave }: SetOpen) =>
    set(() => ({
      open: true,
      type,
      filter,
      onSave,
    })),
  onClose: () => set(() => ({ open: false })),
}))
