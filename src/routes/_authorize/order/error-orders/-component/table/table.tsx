import { Order_Admin } from "@/services/connect-rpc/types"
import { DataTable, TablePagination, useSidebar, useTable } from "@gearment/ui3"
import { useNavigate } from "@tanstack/react-router"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useAllOrder } from "../../-all-orders-context"
import { columns } from "../../../sale-orders/-component/table/table"

const columnHelper = createColumnHelper<Order_Admin>()

const allowColumns = [
  "orderId",
  "status",
  "teamCode",
  "shippingMethod",
  "total",
  "dateInformation",
]

const columnsErrorOrders: ColumnDef<Order_Admin, any>[] = columns
  .filter((column) => allowColumns.includes(column.id as any))
  .concat([
    columnHelper.accessor("errorReason", {
      header: () => <span className="block w-full">Error reason</span>,
      cell: (props) => <p className="">{props.getValue()}</p>,
    }),
  ])

export default function TableAllOrder() {
  const {
    orderList,
    rowCount,
    search,
    rowSelection,
    setRowSelection,
    loading,
  } = useAllOrder()

  const navigate = useNavigate({
    from: "/order/error-orders",
  })

  const table = useTable({
    columns: columnsErrorOrders,
    data: orderList,
    rowCount: rowCount,
    state: {
      rowSelection: rowSelection,
      columnVisibility: {
        select: false,
        action: false,
      },
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.limit,
      },
    },
    getRowId: (row) => row.orderId,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      const newValue =
        updater instanceof Function
          ? updater({
              pageIndex: search.page - 1,
              pageSize: search.limit,
            })
          : updater

      navigate({
        search: (old) => ({
          ...old,
          page: newValue.pageIndex + 1,
          limit: newValue.pageSize,
        }),
        replace: true,
      })
    },
  })

  const { open } = useSidebar()

  return (
    <>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
      <div className="bg-background rounded-lg p-4">
        <DataTable table={table} loading={loading} sticky reInitSticky={open} />
      </div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
    </>
  )
}
