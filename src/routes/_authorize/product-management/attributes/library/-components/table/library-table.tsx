import { DateTime } from "@/components/common/date-time"
import { AttributeGroupValueStatusLabel } from "@/constants/attributes"
import {
  AttributeGroupValueStatusColorsMapping,
  mappingColor,
} from "@/constants/map-color"
import { GMAttribute_Admin_Value } from "@/services/connect-rpc/types"
import { Badge, DataTable, TablePagination, useTable } from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useAttributeLibrary } from "../../-attribute-library-context"
import CellActions from "./cell-actions"
import CellGroupName from "./cell-group-name"
import CellName from "./cell-name"

const columnHelper = createColumnHelper<GMAttribute_Admin_Value>()

export default function LibraryTable() {
  const { attributeLibraries, rowCount, pageCount, loading } =
    useAttributeLibrary()

  const search = useSearch({
    from: "/_authorize/product-management/attributes/library/",
  })

  const navigate = useNavigate({
    from: "/product-management/attributes/library",
  })

  const columns: ColumnDef<GMAttribute_Admin_Value, any>[] = [
    columnHelper.accessor("attrValue", {
      header: "Attribute name",
      cell: (props) => <CellName {...props} />,
    }),
    columnHelper.accessor("attrCode", {
      header: "Attribute code",
      cell: ({ row }) => <div>{row.original.attrCode}</div>,
    }),
    columnHelper.accessor("groups", {
      header: "Group",
      cell: (props) => <CellGroupName {...props} />,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      meta: {
        width: 100,
      },
      cell: ({ row }) => (
        <Badge
          variant={mappingColor(
            AttributeGroupValueStatusColorsMapping,
            row.original.status,
          )}
        >
          {AttributeGroupValueStatusLabel[row.original.status]}
        </Badge>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Created at",
      meta: {
        width: 130,
      },
      cell: (info) => {
        const createdAt = info.row.original.createdAt
        return createdAt ? <DateTime date={createdAt.toDate()} /> : "--"
      },
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right"></div>,
      meta: {
        width: 70,
      },
      cell: (props) => <CellActions {...props} />,
    }),
  ]
  const table = useTable({
    columns: columns,
    data: attributeLibraries,
    rowCount: rowCount,
    pageCount: pageCount,
    getRowId: (row) => row.attrCode,
    state: {
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.limit,
      },
      columnPinning: {
        right: ["actions"],
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
          noDataText="No attributes found. Please adjust your filters or add new attributes."
        />
      </div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
    </div>
  )
}
