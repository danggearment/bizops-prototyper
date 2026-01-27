import { DateTime } from "@/components/common/date-time"
import {
  mappingColor,
  PrintTypeStatusColorsMapping,
} from "@/constants/map-color"
import { PrintTypeStatusLabel } from "@/constants/prints"
import BadgeUsedInProducts from "@/routes/_authorize/product-management/attributes/-components/badge-used"
import { GMProductPrintType_Admin_Short } from "@/services/connect-rpc/types"
import { Badge, DataTable, TablePagination, useTable } from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { usePrintType } from "../../-print-type-context"
import { CellActions } from "./cell-actions"
import { CellName } from "./cell-name"

const columnHelper = createColumnHelper<GMProductPrintType_Admin_Short>()

export function TypeTable() {
  const { printTypes, rowCount, pageCount, loading } = usePrintType()

  const search = useSearch({
    from: "/_authorize/product-management/prints/type/",
  })

  const navigate = useNavigate({
    from: "/product-management/prints/type",
  })

  const columns: ColumnDef<GMProductPrintType_Admin_Short, any>[] = [
    columnHelper.accessor("name", {
      header: "Type name",
      cell: (props) => <CellName {...props} />,
    }),
    columnHelper.accessor("usageProductCount", {
      header: "Used in products",
      meta: {
        width: 100,
      },
      cell: ({ row }) => (
        <div className="flex justify-center">
          <BadgeUsedInProducts count={Number(row.original.usageProductCount)} />
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={mappingColor(
            PrintTypeStatusColorsMapping,
            row.original.status,
          )}
        >
          {PrintTypeStatusLabel[row.original.status]}
        </Badge>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Created at",
      cell: ({ row }) =>
        row.original.createdAt ? (
          <DateTime date={row.original.createdAt.toDate()} />
        ) : (
          "--"
        ),
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: (props) => <CellActions {...props} />,
    }),
  ]

  const table = useTable({
    columns,
    data: printTypes,
    rowCount: rowCount,
    pageCount: pageCount,
    getRowId: (row) => row.code,
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

  return (
    <div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
      <div className="bg-background p-4 rounded-lg">
        <DataTable
          table={table}
          loading={loading}
          noDataText="No print locations found."
        />
      </div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
    </div>
  )
}
