import { DataTable, useTable } from "@gearment/ui3"
import { Link } from "@tanstack/react-router"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"

interface Props {
  orderIds?: string[]
}

interface OrderIdRow {
  orderId: string
}

const columnHelper = createColumnHelper<OrderIdRow>()

function OrderTable({ orderIds = [] }: Props) {
  const tableData = orderIds.map((orderId) => ({ orderId }))

  const columns: ColumnDef<{ orderId: string }, any>[] = [
    columnHelper.accessor("orderId", {
      header: () => (
        <div className="text-sm font-semibold text-gray-700 px-4 py-3">
          Order ID
        </div>
      ),
      cell: (info) => {
        const orderId = info.getValue()
        return (
          <div className="px-4 py-2">
            <Link
              to="/order/$orderId"
              params={{ orderId }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {orderId}
            </Link>
          </div>
        )
      },
    }),
  ]

  const table = useTable<OrderIdRow>({
    columns,
    data: tableData,
  })

  return (
    <>
      {orderIds.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
          No orders associated with this transaction
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <DataTable table={table} className="divide-y divide-gray-100" />
        </div>
      )}
    </>
  )
}

export default OrderTable
