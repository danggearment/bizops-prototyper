import { type ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { format } from "date-fns"

export interface PrototypeType {
  id: string
  name: string
  description: string
  createdAt: string
}

const columnHelper = createColumnHelper<PrototypeType>()

export const columns: ColumnDef<PrototypeType, unknown>[] = [
  columnHelper.accessor("id", {
    header: "ID",
    size: 120,
    cell: (info) => <span className="font-mono text-sm text-muted-foreground">{info.getValue()}</span>,
  }),
  columnHelper.accessor("name", {
    header: "Name",
    size: 250,
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: (info) => <span className="text-sm text-muted-foreground">{info.getValue()}</span>,
  }),
  columnHelper.accessor("createdAt", {
    header: "Created",
    size: 150,
    cell: (info) => (
      <span className="text-sm text-muted-foreground">
        {format(new Date(info.getValue()), "dd/MM/yyyy HH:mm")}
      </span>
    ),
  }),
]