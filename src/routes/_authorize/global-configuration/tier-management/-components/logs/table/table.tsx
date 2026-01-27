import { DateTime } from "@/components/common/date-time"
import { UpdateTeamTierLogsSearchType } from "@/schemas/schemas/global-configuration"
import {
  StaffListTeamPriceTierActivityResponse,
  StaffListTeamPriceTierActivityResponse_Activity,
  TeamPriceTierAction,
} from "@/services/connect-rpc/types"
import { StaffListProductPriceTierKeyResponse_Key } from "@gearment/nextapi/api/pod/v1/product_admin_pb"
import { Badge, DataTable, TablePagination, useTable } from "@gearment/ui3"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, Calendar } from "lucide-react"
import { useMemo } from "react"

function generateColumns(
  tierMapping?: Record<string, StaffListProductPriceTierKeyResponse_Key>,
): ColumnDef<StaffListTeamPriceTierActivityResponse_Activity>[] {
  return [
    {
      header: () => (
        <div>
          <span className="text-base font-medium">Time (CTA)</span>
        </div>
      ),
      meta: {
        width: 240,
      },
      accessorKey: "createdAt",
      cell: ({ row }) => {
        return (
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <DateTime
              date={row.original.createdAt?.toDate()}
              format="YYYY/MM/DD HH:mm A"
            />
          </span>
        )
      },
    },
    {
      header: () => (
        <div>
          <span className="text-base font-medium">CS Username</span>
        </div>
      ),
      accessorKey: "staffUsername",
      cell: ({ row }) => {
        return <p>{row.original.staffUsername}</p>
      },
    },
    {
      header: () => (
        <div>
          <span className="text-base font-medium">Team Email</span>
        </div>
      ),
      accessorKey: "staffEmail",
      cell: ({ row }) => {
        return <p>{row.original.userEmail}</p>
      },
    },
    {
      header: () => (
        <div>
          <span className="text-base font-medium">Old Tier</span>
        </div>
      ),

      accessorKey: "oldTierId",
      cell: ({ row }) => {
        return (
          <div
            className="p-1 rounded-full text-center font-bold w-[120px]"
            style={{
              backgroundColor: tierMapping?.[row.original.oldTierId]?.bgColor,
              color: tierMapping?.[row.original.oldTierId]?.color,
            }}
          >
            {tierMapping?.[row.original.oldTierId]?.tierName}
          </div>
        )
      },
    },
    {
      header: () => (
        <div>
          <span className="text-base font-medium">New Tier</span>
        </div>
      ),
      accessorKey: "newTierId",
      cell: ({ row }) => {
        return (
          <div
            className="p-1 rounded-full text-center font-bold w-[120px]"
            style={{
              backgroundColor: tierMapping?.[row.original.newTierId]?.bgColor,
              color: tierMapping?.[row.original.newTierId]?.color,
            }}
          >
            {tierMapping?.[row.original.newTierId]?.tierName}
          </div>
        )
      },
    },
    {
      header: () => (
        <div>
          <span className="text-base font-medium">Action</span>
        </div>
      ),
      accessorKey: "action",
      cell: ({ row }) => {
        return renderTierChangeBadge(row.original.action)
      },
    },
  ]
}

const renderTierChangeBadge = (action: TeamPriceTierAction) => {
  switch (action) {
    case TeamPriceTierAction.UNSPECIFIED:
      return (
        <div className="flex items-center">
          <Badge variant="default">Unknown</Badge>
        </div>
      )

    case TeamPriceTierAction.UPGRADED:
      return (
        <div className="flex items-center">
          <Badge variant="success">
            <div className="flex items-center gap-1">
              Upgraded
              <ArrowUp className="w-4 h-4" />
            </div>
          </Badge>
        </div>
      )

    case TeamPriceTierAction.DOWNGRADED:
      return (
        <div className="flex items-center">
          <Badge variant="error">
            <div className="flex items-center gap-1">
              Downgraded
              <ArrowDown className="w-4 h-4" />
            </div>
          </Badge>
        </div>
      )

    default:
      return (
        <div className="flex items-center">
          <Badge variant="default">Unknown</Badge>
        </div>
      )
  }
}

interface Props {
  data?: StaffListTeamPriceTierActivityResponse
  isLoading: boolean
  priceKeys?: StaffListProductPriceTierKeyResponse_Key[]
  handleSetNewSearch: (newSearch: UpdateTeamTierLogsSearchType) => void
  search: UpdateTeamTierLogsSearchType
}

export function UpdateTeamTierLogTable({
  data,
  isLoading,
  priceKeys,
  handleSetNewSearch,
  search,
}: Props) {
  const tierMapping = useMemo(() => {
    return priceKeys?.reduce<
      Record<string, StaffListProductPriceTierKeyResponse_Key>
    >((acc, key) => {
      acc[key.tierId] = key
      return acc
    }, {})
  }, [priceKeys])

  const columns = generateColumns(tierMapping)

  const table = useTable({
    columns: columns,
    data: data?.data || [],
    rowCount: Number(data?.pagination?.total) || 0,
    pageCount: Number(data?.pagination?.totalPage) || 0,
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
      handleSetNewSearch({
        ...search,
        page: newValue.pageIndex + 1,
        limit: newValue.pageSize,
      })
    },
  })
  return (
    <div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
      <div className="bg-background rounded-lg p-4">
        <DataTable sticky loading={isLoading} table={table} />
      </div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
    </div>
  )
}
