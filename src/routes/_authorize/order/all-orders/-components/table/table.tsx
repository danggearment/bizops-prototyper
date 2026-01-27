import { DataTable, useTable } from "@gearment/ui3"
import { useAllOrders } from "../../-all-orders-context"
import { columns } from "./columns"

export default function Table() {
  const { orders, loading } = useAllOrders()

  const table = useTable({
    columns,
    data: orders,
  })

  return (
    <div className="bg-background p-4 rounded-lg">
      <DataTable table={table} loading={loading} sticky />
    </div>
  )
}
