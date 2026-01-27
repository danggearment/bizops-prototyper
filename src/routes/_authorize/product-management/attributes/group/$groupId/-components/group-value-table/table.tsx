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
import { useAttributeGroupValue } from "../../-attribute-group-value-context"
import BadgeUsedInProducts from "../../../../-components/badge-used"
import CellActions from "./cell-actions"

const columnHelper = createColumnHelper<GMAttribute_Admin_Value>()

export default function GroupValueTable() {
  const { attributeValues, loading, rowCount, pageCount } =
    useAttributeGroupValue()

  const search = useSearch({
    from: "/_authorize/product-management/attributes/group/$groupId/",
  })

  const navigate = useNavigate({
    from: "/product-management/attributes/group/$groupId",
  })

  const columns: ColumnDef<GMAttribute_Admin_Value, any>[] = [
    columnHelper.accessor("attrValue", {
      header: "Attribute name",
      cell: ({ row }) => <div>{row.original.attrValue}</div>,
    }),
    columnHelper.accessor("attrCode", {
      header: "Code",
      cell: ({ row }) => <div>{row.original.attrCode}</div>,
    }),
    columnHelper.accessor("status", {
      header: "Status",
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
    columnHelper.accessor("productUsageCount", {
      header: () => <div className="text-center">Used in products</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <BadgeUsedInProducts count={Number(row.original.productUsageCount)} />
        </div>
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
    columnHelper.accessor("updatedAt", {
      header: "Updated at",
      meta: {
        width: 130,
      },
      cell: (info) => {
        const updatedAt = info.row.original.updatedAt
        return updatedAt ? <DateTime date={updatedAt.toDate()} /> : "--"
      },
    }),
    columnHelper.display({
      id: "actions",
      meta: {
        width: 70,
      },
      header: () => <div className="text-right">Actions</div>,
      cell: (props) => (
        <div className="flex justify-end">
          <CellActions {...props} />
        </div>
      ),
    }),
  ]

  const table = useTable({
    columns,
    data: attributeValues,
    rowCount: rowCount,
    pageCount: pageCount,
    getRowId: (row) => row.attrCode,
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
    <div className="bg-background p-4 rounded-lg">
      <DataTable table={table} loading={loading} />
      <TablePagination table={table} limitOptions={[10, 20, 50, 100]} />
    </div>
  )
}
