import { Badge, DataTable, useTable } from "@gearment/ui3"
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { format } from "date-fns"
import {
  useClientDetailContext,
  type ClientPayment,
} from "../../-client-detail-context"

const columnHelper = createColumnHelper<ClientPayment>()

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

const columns: ColumnDef<ClientPayment, unknown>[] = [
  columnHelper.accessor("transactionId", {
    header: "Transaction ID",
    cell: (info) => (
      <span className="font-mono text-sm">{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("method", {
    header: "Method",
    cell: (info) => {
      const method = info.getValue()
      const labels: Record<string, string> = {
        credit_card: "Credit Card",
        bank_transfer: "Bank Transfer",
        paypal: "PayPal",
      }
      return <span>{labels[method] || method}</span>
    },
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: (info) => (
      <span className="font-medium">{formatCurrency(info.getValue())}</span>
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
        pending: "secondary",
        failed: "destructive",
        refunded: "outline",
      }
      return <Badge variant={variants[status]}>{status}</Badge>
    },
  }),
  columnHelper.accessor("createdAt", {
    header: "Date",
    cell: (info) => format(new Date(info.getValue()), "dd/MM/yyyy HH:mm"),
  }),
]

export default function PaymentsTable() {
  const { client } = useClientDetailContext()
  const table = useTable({ columns, data: client.payments })

  return (
    <div className="bg-background rounded-lg p-4">
      <DataTable table={table} loading={false} sticky />
    </div>
  )
}
