import { useQueryPod } from "@/services/connect-rpc/transport.tsx"
import { staffListOrderImportSession } from "@gearment/nextapi/api/pod/v1/order_import_admin-OrderImportAdminAPI_connectquery.ts"
import {
  Badge,
  ButtonIconCopy,
  DataTable,
  TablePagination,
  toast,
  useTable,
} from "@gearment/ui3"
import { useNavigate, useParams, useSearch } from "@tanstack/react-router"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"

import { DateTime } from "@/components/common/date-time"

import { OrderImportOrderStatusLabel } from "@/constants/enum-label.ts"
import {
  ImportOrderOrderStatusColorsMapping,
  mappingColor,
} from "@/constants/map-color.ts"
import {
  LogsImportOrdersSearchSchema,
  LogsImportOrdersSearchType,
} from "@/schemas/schemas/logs-import-orders"
import { formatDateForCallApi } from "@/utils/format-date.ts"
import {
  OrderAdmin_OrderDraftImportSession,
  OrderAdmin_OrderDraftImportSessionOrderStatus,
} from "@gearment/nextapi/api/pod/v1/admin_api_type_pb"
import CellActions from "./cell-actions.tsx"
import CellFileName from "./cell-file-name.tsx"
import CellPlatform from "./cell-platform.tsx"
import FilterTeam from "./filter/filter.tsx"

const columnHelper = createColumnHelper<OrderAdmin_OrderDraftImportSession>()

export default function TableImportOrders() {
  const search = useSearch({
    from: "/_authorize/system/teams/$teamId/logs/import-orders/",
  })
  const { teamId } = useParams({
    from: "/_authorize/system/teams/$teamId/logs/import-orders/",
  })
  const navigate = useNavigate({
    from: "/system/teams/$teamId/logs/import-orders",
  })

  const { data, isPending, refetch } = useQueryPod(
    staffListOrderImportSession,
    {
      filter: {
        orderStatuses: search.status,
        from: search.from ? formatDateForCallApi(search.from) : undefined,
        to: search.to ? formatDateForCallApi(search.to, "endOfDay") : undefined,
        teamIds: [teamId],
      },
      pagination: {
        page: search.page,
        limit: search.limit,
      },
    },
    {
      select: (data) => ({
        data: data.data,
        rowCount: Number(data?.pagination?.total),
        pageCount: data?.pagination?.totalPage,
      }),
    },
  )

  const columns: ColumnDef<OrderAdmin_OrderDraftImportSession, any>[] = useMemo(
    () => [
      columnHelper.accessor("fileName", {
        header: () => (
          <span className={"text-center whitespace-nowrap pr-2"}>
            File name
          </span>
        ),
        cell: (info) => <CellFileName {...info} />,
      }),
      columnHelper.accessor("orderCount", {
        header: () => (
          <span className={"text-left whitespace-nowrap pr-2"}>
            Total orders
          </span>
        ),
        cell: (info) => (
          <div className="text-left">
            {info.getValue()} orders ({info.row.original.orderSuccessCount}{" "}
            success, {info.row.original.orderFailedCount} failed)
          </div>
        ),
      }),
      columnHelper.accessor("orderStatus", {
        header: () => <span>Status</span>,
        cell: ({ getValue }) => {
          const status =
            getValue<OrderAdmin_OrderDraftImportSessionOrderStatus>()
          return (
            <span className={"block w-full"}>
              <Badge
                variant={mappingColor(
                  ImportOrderOrderStatusColorsMapping,
                  status,
                )}
              >
                {OrderImportOrderStatusLabel[status]}
              </Badge>
            </span>
          )
        },
      }),
      columnHelper.accessor("platform", {
        header: () => (
          <span className={"text-center whitespace-nowrap pr-2"}>Platform</span>
        ),
        cell: (info) => <CellPlatform {...info} />,
      }),

      columnHelper.accessor("storeName", {
        header: () => (
          <span className={"text-center whitespace-nowrap pr-2"}>Store</span>
        ),
        cell: (info) => (
          <div>
            <p>{info.row.original.storeName}</p>
            <div className="flex items-center gap-1 text-muted-foreground">
              {info.row.original.storeId}
              <ButtonIconCopy size="sm" copyValue={info.row.original.storeId} />
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("requestTime", {
        header: () => (
          <span className={"text-center whitespace-nowrap pr-2"}>
            Request time
          </span>
        ),
        cell: (info) => (
          <DateTime date={info.getValue()?.toDate()} className="body-small" />
        ),
      }),
      columnHelper.accessor("completeTime", {
        header: () => (
          <span className={"text-center whitespace-nowrap pr-2"}>
            Completed time
          </span>
        ),
        cell: (info) => (
          <DateTime date={info.getValue()?.toDate()} className="body-small" />
        ),
      }),

      columnHelper.display({
        id: "actions",
        header: () => <span></span>,
        cell: (info) => {
          return <CellActions {...info} />
        },
      }),
    ],
    [],
  )

  const handleChangeSearch = (search: LogsImportOrdersSearchType) => {
    navigate({
      search: (old) => ({
        ...old,
        ...search,
      }),
      replace: true,
    })
  }

  const table = useTable<OrderAdmin_OrderDraftImportSession>({
    columns,
    data: data?.data || [],
    rowCount: data?.rowCount || 0,
    pageCount: data?.pageCount || 0,
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

  const handleResetFilter = () => {
    navigate({
      search: LogsImportOrdersSearchSchema.parse({}),
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
    <div className="">
      <div className="bg-background rounded-lg p-4">
        <FilterTeam
          handleChangeSearch={handleChangeSearch}
          handleResetFilter={handleResetFilter}
          handleRefetchData={handleRefetchData}
          isRefetching={isPending}
        />
      </div>
      <div>
        <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
        <div className="bg-background rounded-lg p-4">
          <DataTable
            loading={isPending}
            table={table}
            sticky
            containerRefId="layout-team"
          />
        </div>
        <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
      </div>
    </div>
  )
}
