import { GMProduct_Admin_Short } from "@/services/connect-rpc/types"
import { DataTable, TablePagination, useTable } from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { usePrintLocationDetail } from "../../-print-location-detail-context"

const columnHelper = createColumnHelper<GMProduct_Admin_Short>()

export function LocationProductTable() {
  const {
    productsUsagePrintLocations,
    isProductsUsagePrintLocationsPending,
    rowCount,
    pageCount,
    printLocationDetail,
  } = usePrintLocationDetail()

  const search = useSearch({
    from: "/_authorize/product-management/prints/location/$locationId/",
  })

  const navigate = useNavigate({
    from: "/product-management/prints/location/$locationId",
  })

  const columns: ColumnDef<GMProduct_Admin_Short, any>[] = [
    columnHelper.accessor("productName", {
      header: "Product name",
      cell: ({ row }) => <div>{row.original.productName}</div>,
    }),
    columnHelper.accessor("productSku", {
      header: "Product code",
      cell: ({ row }) => <div>{row.original.productSku}</div>,
    }),
  ]

  const table = useTable({
    columns,
    data: productsUsagePrintLocations,
    rowCount: rowCount,
    pageCount: pageCount,
    getRowId: (row) => row.productId,
    state: {
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.limit,
      },
    },
    onPaginationChange: (updater) => {
      const newValue =
        updater instanceof Function
          ? updater({
              pageIndex: search.page - 1,
              pageSize: search.limit,
            })
          : updater
      navigate({
        search: (old) => {
          return {
            ...old,
            page: newValue.pageIndex + 1,
            limit: newValue.pageSize,
          }
        },
        replace: true,
      })
    },
  })

  const loading = isProductsUsagePrintLocationsPending

  return (
    <>
      <DataTable
        loading={loading}
        table={table}
        noDataText={
          Number(printLocationDetail.productUsageCount) === 0
            ? `No products are currently using this print location.`
            : "No data"
        }
      />
      <TablePagination table={table} limitOptions={[10, 20, 50, 100]} />
    </>
  )
}
