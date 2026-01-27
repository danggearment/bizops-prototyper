import {
  LineItem,
  Order_LineItem,
  OrderDraft_LineItemAdmin,
} from "@/services/connect-rpc/types"
import { Table } from "@tanstack/react-table"
import React from "react"
import { create } from "zustand"
interface SetOpen {
  title: Props["title"]
  description?: Props["description"]
  dataTable?: Props["dataTable"]
  className?: string
  closeText?: string
  onConfirm: Props["onConfirm"]
}

interface Props {
  open: boolean
  title: React.ReactNode
  description: React.ReactNode
  dataTable: Table<LineItem | Order_LineItem | OrderDraft_LineItemAdmin>
  className: string
  closeText: string
  onConfirm: () => void | Promise<void>
  onClose: () => void
  setOpen: (props: SetOpen) => void
}
export const useLineItemListModal = create<Props>((set) => ({
  open: false,
  title: "",
  description: "",
  dataTable: {} as Table<LineItem | Order_LineItem | OrderDraft_LineItemAdmin>,
  className: "",
  closeText: "",
  enableOverflow: true,
  onConfirm: () => {},
  setOpen: ({
    title,
    description,
    dataTable,
    className,
    closeText,
    onConfirm,
  }: SetOpen) =>
    set(() => ({
      open: true,
      title,
      description,
      dataTable,
      className,
      closeText,
      onConfirm,
    })),
  onClose: () => set(() => ({ open: false })),
}))
