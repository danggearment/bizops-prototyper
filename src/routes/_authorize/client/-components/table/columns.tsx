import { Button } from "@gearment/ui3"
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { Pencil } from "lucide-react"

export interface ClientType {
  id: string
  name: string
}

export interface ColumnsProps {
  onEdit: (client: ClientType) => void
}

const columnHelper = createColumnHelper<ClientType>()

export const createColumns = ({ onEdit }: ColumnsProps): ColumnDef<ClientType, unknown>[] => [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => <span className="font-mono text-sm">{info.getValue()}</span>,
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(row.original)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
    ),
  }),
]