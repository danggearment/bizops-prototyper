import { DateTime } from "@/components/common/date-time"
import { AttributeGroupStatusLabel } from "@/constants/attributes"
import {
  AttributeGroupStatusColorsMapping,
  mappingColor,
} from "@/constants/map-color"
import { GMAttribute_Admin_Short } from "@/services/connect-rpc/types"
import {
  Badge,
  DataTable,
  TablePagination,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useTable,
} from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useAttributeGroup } from "../../-attribute-group-context"
import BadgeUsedInProducts from "../../../-components/badge-used"
import CellActions from "./cell-actions"
import CellName from "./cell-name"

const columnHelper = createColumnHelper<GMAttribute_Admin_Short>()

export default function GroupTable() {
  const { attributeGroups, rowCount, pageCount, loading } = useAttributeGroup()
  const search = useSearch({
    from: "/_authorize/product-management/attributes/group/",
  })
  const navigate = useNavigate({
    from: "/product-management/attributes/group",
  })

  const columns: ColumnDef<GMAttribute_Admin_Short, any>[] = [
    columnHelper.accessor("attrName", {
      header: "Group name",
      cell: (props) => <CellName {...props} />,
    }),
    columnHelper.accessor("attrDescription", {
      header: "Description",
      cell: ({ row }) => {
        const description = row.original.attrDescription
        if (!description) return null
        return (
          <Tooltip>
            <TooltipTrigger>
              <div className="body-small truncate max-w-[200px]">
                {description}
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[320px]">
              {description}
            </TooltipContent>
          </Tooltip>
        )
      },
    }),
    columnHelper.accessor("attributeValueCount", {
      header: () => <div className="text-center">Attributes count</div>,
      meta: {
        width: 100,
      },
      cell: ({ row }) => (
        <div className="flex justify-center">
          <BadgeUsedInProducts
            count={Number(row.original.attributeValueCount)}
          />
        </div>
      ),
    }),
    columnHelper.accessor("productUsageCount", {
      header: () => <div className="text-center">Used in products</div>,
      meta: {
        width: 100,
      },
      cell: ({ row }) => (
        <div className="flex justify-center">
          <BadgeUsedInProducts count={Number(row.original.productUsageCount)} />
        </div>
      ),
    }),
    columnHelper.accessor("maxSelection", {
      header: () => <div className="text-center">Max selection</div>,
      meta: {
        width: 100,
      },
      cell: ({ row }) => (
        <div className="text-center">{row.original.maxSelection}</div>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      meta: {
        width: 100,
      },
      cell: ({ row }) => (
        <Badge
          variant={mappingColor(
            AttributeGroupStatusColorsMapping,
            row.original.status,
          )}
        >
          {AttributeGroupStatusLabel[row.original.status]}
        </Badge>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: "Created at",
      meta: {
        width: 130,
      },
      cell: ({ getValue }) =>
        getValue() ? (
          <DateTime date={getValue().toDate()} className="body-small" />
        ) : (
          ""
        ),
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
    data: attributeGroups,
    rowCount: rowCount,
    pageCount: pageCount,
    getRowId: (row) => row.attrKey,
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
        <DataTable table={table} loading={loading} />
      </div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
    </div>
  )
}
