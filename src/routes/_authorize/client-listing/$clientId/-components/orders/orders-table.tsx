import { Badge, DataTable, useTable } from "@gearment/ui3"
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { format } from "date-fns"
import {
  useClientDetailContext,
  type ClientOrder,
} from "../../-client-detail-context"

const columnHelper = createColumnHelper<ClientOrder>()

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

const columns: ColumnDef<ClientOrder, unknown>[] = [
  columnHelper.accessor("orderNumber", {
    header: "Order Number",
    cell: (info) => (
      <span className="font-mono text-sm font-medium text-primary">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue()
      const variants: Record<
        string,
        "default" | "secondary" | "destructive" | "outline"
      > = {
        completed: "default",
        processing: "secondary",
        pending: "outline",
        cancelled: "destructive",
      }
      return <Badge variant={variants[status]}>{status}</Badge>
    },
  }),
  columnHelper.accessor("items", {
    header: "Items",
    cell: (info) => <span>{info.getValue()} items</span>,
  }),
  columnHelper.accessor("total", {
    header: "Total",
    cell: (info) => (
      <span className="font-medium">{formatCurrency(info.getValue())}</span>
    ),
  }),
  columnHelper.accessor("createdAt", {
    header: "Date",
    cell: (info) => format(new Date(info.getValue()), "dd/MM/yyyy HH:mm"),
  }),
]

export default function OrdersTable() {
  const { client } = useClientDetailContext()
  const table = useTable({ columns, data: client.orders })

  return (
    <div className="bg-background rounded-lg p-4">
      <DataTable table={table} loading={false} sticky />
    </div>
  )
}
