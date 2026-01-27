import { DateTime } from "@/components/common/date-time"
import Image from "@/components/common/image/image"
import {
  mappingColor,
  PrintLocationStatusColorsMapping,
} from "@/constants/map-color"
import { PrintLocationStatusLabel } from "@/constants/prints"
import BadgeUsedInProducts from "@/routes/_authorize/product-management/attributes/-components/badge-used"
import { GMPrintLocation_Admin_Short } from "@/services/connect-rpc/types"
import { Badge, DataTable, TablePagination, useTable } from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { usePrintLocation } from "../../-print-location-context"
import { CellActions } from "./cell-actions"
import { CellName } from "./cell-name"

const columnHelper = createColumnHelper<GMPrintLocation_Admin_Short>()

export function LocationTable() {
  const { printLocations, rowCount, pageCount, loading } = usePrintLocation()

  const search = useSearch({
    from: "/_authorize/product-management/prints/location/",
  })

  const navigate = useNavigate({
    from: "/product-management/prints/location",
  })

  const columns: ColumnDef<GMPrintLocation_Admin_Short, any>[] = [
    columnHelper.accessor("previewImage", {
      header: "Image",
      cell: ({ row }) => (
        <div>
          <Image
            url={row.original.previewImage?.fileUrl ?? ""}
            width={60}
            responsive="w"
          />
        </div>
      ),
    }),
    columnHelper.accessor("name", {
      header: "Location name",
      cell: (props) => <CellName {...props} />,
    }),
    columnHelper.accessor("code", {
      header: "Location code",
      cell: ({ row }) => <div>{row.original.code}</div>,
    }),
    columnHelper.accessor("productUsageCount", {
      header: "Used in products",
      meta: {
        width: 100,
      },
      cell: ({ row }) => (
        <div className="flex justify-center">
          <BadgeUsedInProducts count={Number(row.original.productUsageCount)} />
        </div>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={mappingColor(
            PrintLocationStatusColorsMapping,
            row.original.status,
          )}
        >
          {PrintLocationStatusLabel[row.original.status]}
        </Badge>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Created at",
      cell: ({ row }) => {
        const createdAt = row.original.createdAt
        return createdAt ? <DateTime date={createdAt.toDate()} /> : "--"
      },
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: (props) => <CellActions {...props} />,
    }),
  ]

  const table = useTable({
    columns,
    data: printLocations,
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
