import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import CellActions from "./cell-actions"

const columnHelper = createColumnHelper<any>()

export const Columns: ColumnDef<any>[] = [
  columnHelper.accessor("name", {
    header: "Plan name",
  }),
  columnHelper.accessor("name", {
    header: "Status",
  }),
  columnHelper.accessor("name", {
    header: "Time line",
  }),
  columnHelper.accessor("name", {
    header: "",
    cell: () => {
      return <CellActions />
    },
  }),
]
