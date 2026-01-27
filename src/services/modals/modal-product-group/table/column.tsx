import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"
import CellName from "./cell-name"
import { ProductGroup } from "../modal-product-group-store"

export const columns: ColumnDef<ProductGroup>[] = [
  {
    header: "Product name",
    accessorKey: "name",
    cell: ({ row }) => {
      return <CellName row={row} />
    },
  },
  {
    header: "",
    accessorKey: "actions",
    meta: {
      width: 200,
    },
    cell: ({ row }) => {
      return <CellAction row={row} />
    },
  },
]
