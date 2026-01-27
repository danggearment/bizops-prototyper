import { useQueryIam, useQueryPod } from "@/services/connect-rpc/transport.tsx"
import { Team_Detail } from "@/services/connect-rpc/types"
import { formatDateForCallApi } from "@/utils/format-date.ts"
import { staffListAllGMTeam } from "@gearment/nextapi/api/iam/v1/team-TeamAPI_connectquery.ts"
import {
  Badge,
  DataTable,
  TablePagination,
  toast,
  useTable,
} from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"

import { DateTime } from "@/components/common/date-time"
import { AllGMTeamStatusLabel } from "@/constants/gm-team-status.tsx"
import {
  GMTeamStatusColorsMapping,
  mappingColor,
} from "@/constants/map-color.ts"
import FilterTeam from "@/routes/_authorize/system/teams/-component/filter/filter-team.tsx"
import CellActions from "@/routes/_authorize/system/teams/-component/table-team/cell-actions.tsx"
import CellTeamName from "@/routes/_authorize/system/teams/-component/table-team/cell-team-name.tsx"
import { FilterTeamType, TeamSearchSchema } from "@/schemas/schemas/team.ts"
import { TeamStatus } from "@/services/connect-rpc/types"
import { staffListProductPriceTierKey } from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { StaffListProductPriceTierKeyResponse_Key } from "@gearment/nextapi/api/pod/v1/product_admin_pb"

const columnHelper = createColumnHelper<Team_Detail>()

export default function TableTeam() {
  const search = useSearch({
    from: "/_authorize/system/teams/",
  })
  const navigate = useNavigate({
    from: "/system/teams",
  })

  const { data, isPending, refetch } = useQueryIam(
    staffListAllGMTeam,
    {
      page: search.page,
      limit: search.limit,
      filter: {
        isRushOrder: search.isRushOrder,
        searchText: search.searchText,
        status: search.status,
        createdFrom: search.from
          ? formatDateForCallApi(search.from)
          : undefined,
        createdTo: search.to
          ? formatDateForCallApi(search.to, "endOfDay")
          : undefined,
        tierIds: search.tierIds,
      },
    },
    {
      select: (data) => ({
        data: data.data,
        rowCount: Number(data?.total),
        pageCount: data?.totalPage,
      }),
    },
  )

  const { data: tierKeys } = useQueryPod(staffListProductPriceTierKey, {
    page: 1,
    limit: 1000,
  })

  const tierKeysMap = useMemo(() => {
    return (tierKeys?.keys ?? []).reduce<
      Record<string, StaffListProductPriceTierKeyResponse_Key>
    >((acc, curr) => {
      acc[curr.tierId] = curr
      return acc
    }, {})
  }, [tierKeys])

  const columns: ColumnDef<Team_Detail, any>[] = useMemo(
    () => [
      columnHelper.accessor("teamName", {
        header: () => (
          <span className={"text-center whitespace-nowrap pr-2"}>
            Team name
          </span>
        ),
        cell: (info) => <CellTeamName {...info} />,
      }),
      columnHelper.accessor("email", {
        header: () => (
          <span className={"text-center whitespace-nowrap pr-2"}>Email</span>
        ),
        cell: (info) => (
          <span className={"text-center"}>{info.getValue()}</span>
        ),
      }),
      {
        id: "tier",
        meta: {
          width: 100,
        },
        header: () => (
          <p className={"text-center whitespace-nowrap"}>Tier level</p>
        ),
        cell: ({ row }) => {
          const tierKey = tierKeysMap[row.original.tierId]
          return (
            <p
              style={{
                backgroundColor: tierKey?.bgColor,
                color: tierKey?.color,
              }}
              className="text-center p-1 font-medium rounded-full"
            >
              {row.original.tierName}
            </p>
          )
        },
      },
      columnHelper.accessor("status", {
        header: () => (
          <span className={"text-center whitespace-nowrap pr-2"}>Status</span>
        ),
        cell: ({ getValue }) => {
          const status = getValue<TeamStatus>()
          return (
            <Badge variant={mappingColor(GMTeamStatusColorsMapping, status)}>
              {AllGMTeamStatusLabel[status]}
            </Badge>
          )
        },
      }),
      columnHelper.accessor("createdAt", {
        header: () => (
          <span className={"text-center whitespace-nowrap pr-2"}>
            Created date
          </span>
        ),
        cell: (info) => (
          <DateTime date={info.getValue().toDate()} className="body-small" />
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: () => <div className={"text-right"}></div>,
        cell: (props) => <CellActions {...props} />,
        meta: {
          width: 100,
        },
      }),
    ],
    [tierKeysMap],
  )

  const handleChangeSearch = (search: FilterTeamType) => {
    navigate({
      search: (old) => ({
        ...old,
        ...search,
      }),
      replace: true,
    })
  }

  const table = useTable<Team_Detail>({
    columns,
    data: data?.data || [],
    rowCount: data?.rowCount || 0,
    pageCount: data?.pageCount || 0,
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

  const handleResetFilter = () => {
    navigate({
      search: TeamSearchSchema.parse({}),
      replace: true,
    })
  }

  const handleRefetchData = async () => {
    await refetch()
    toast({
      title: "Refetch data successfully",
      variant: "success",
    })
  }

  return (
    <div>
      <div className="bg-background rounded-lg p-4">
        <FilterTeam
          handleChangeSearch={handleChangeSearch}
          handleResetFilter={handleResetFilter}
          handleRefetchData={handleRefetchData}
          isRefetching={isPending}
          tierKeys={tierKeys?.keys}
        />
      </div>
      <div>
        <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
        <div className="bg-background rounded-lg p-4">
          <DataTable loading={isPending} table={table} />
        </div>
        <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
      </div>
    </div>
  )
}
