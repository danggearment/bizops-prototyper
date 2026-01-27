import { StoreColors } from "@/constants/map-color.ts"
import { StoreStatusLabel } from "@/constants/store.ts"
import CellSelect from "@/routes/_authorize/system/members/-component/table-staff/cell-select.tsx"
import Filter from "@/routes/_authorize/system/teams/$teamId/store/-component/filter/filter.tsx"
import CellActions from "@/routes/_authorize/system/teams/$teamId/store/-component/table-store/cell-action.tsx"
import { FilterStoreType } from "@/schemas/schemas/store.ts"
import { useQueryStore } from "@/services/connect-rpc/transport.tsx"
import { formatDateForCallApi } from "@/utils/format-date.ts"
import { staffListStoreOfTeam } from "@gearment/nextapi/api/store/v1/admin_api-StoreAdminAPI_connectquery"
import {
  Store,
  StoreStatus,
} from "@gearment/nextapi/api/store/v1/data_store_pb.ts"
import { Badge, DataTable, TablePagination, useTable } from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"

import CellCheckbox from "@/components/common/cell-checkbox"
import { DateTime } from "@/components/common/date-time"
import CellStoreName from "@/routes/_authorize/system/teams/$teamId/store/-component/table-store/cell-name.tsx"

const columnHelper = createColumnHelper<Store>()

interface Props {
  teamId: string
}

export default function TableStoreManagement({ teamId }: Props) {
  const search = useSearch({
    from: "/_authorize/system/teams/$teamId/store/",
  })

  const navigate = useNavigate({
    from: "/system/teams/$teamId/store",
  })

  const { data, isPending } = useQueryStore(
    staffListStoreOfTeam,
    {
      page: search.page,
      limit: search.limit,
      teamId: teamId,
      storeName: search.searchText,
      storeStatus: search.status,
      createdFrom: search.from ? formatDateForCallApi(search.from) : undefined,
      createdTo: search.to
        ? formatDateForCallApi(search.to, "endOfDay")
        : undefined,
    },
    {
      select: (data) => ({
        stores: data.store,
        rowCount: Number(data?.total),
        pageCount: data?.totalPage,
      }),
    },
  )

  const columns: ColumnDef<Store, any>[] = useMemo(
    () => [
      {
        id: "select",
        meta: {
          width: 40,
        },
        header: (props) => (
          <CellCheckbox
            {...{
              checked: props.table.getIsAllRowsSelected(),
              onChange: props.table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: (props) => {
          return (
            <CellSelect
              {...props}
              {...{
                checked: props.row.getIsSelected(),
                disabled: !props.row.getCanSelect(),
                onChange: props.row.getToggleSelectedHandler(),
              }}
            />
          )
        },
      },
      columnHelper.accessor("name", {
        header: () => (
          <span className={"text-center whitespace-nowrap pr-2"}>
            Store name
          </span>
        ),
        cell: (info) => <CellStoreName {...info} />,
      }),
      columnHelper.accessor("storeId", {
        header: () => (
          <span className={"text-center whitespace-nowrap pr-2"}>Store ID</span>
        ),
        meta: {
          width: 200,
        },
        cell: (info) => (
          <span className={"text-center"}>{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("logoUrl", {
        header: () => (
          <span className={"text-center whitespace-nowrap pr-2"}>Platform</span>
        ),
        meta: {
          width: 200,
        },
        cell: ({ getValue }) => {
          const iconUrl = getValue()
          if (!iconUrl) return null
          return (
            <img className="w-[100px] max-h-[24px]" src={getValue()} alt="" />
          )
        },
      }),
      columnHelper.accessor("status", {
        header: () => (
          <span className={"text-center whitespace-nowrap pr-2"}>Status</span>
        ),
        meta: {
          width: 200,
        },
        cell: ({ getValue }) => (
          <span className={"block w-full"}>
            <Badge color={StoreColors[getValue<StoreStatus>()]}>
              {StoreStatusLabel[getValue<StoreStatus>()]}
            </Badge>
          </span>
        ),
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
      columnHelper.accessor("storeId", {
        header: () => <div className={"text-right"}>Actions</div>,
        cell: () => <CellActions />,
      }),
    ],
    [],
  )

  const handleChangeSearch = (search: FilterStoreType) => {
    navigate({
      search: (old) => ({
        ...old,
        ...search,
      }),
      replace: true,
    })
  }

  const table = useTable<Store>({
    columns,
    data: data?.stores || [],
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
        search: (old) => ({
          ...old,
          page: newValue.pageIndex + 1,
          limit: newValue.pageSize,
        }),
        replace: true,
      })
    },
  })

  return (
    <div className="space-y-4">
      <div className="bg-background p-4 rounded-lg">
        <Filter handleChangeSearch={handleChangeSearch}></Filter>
      </div>
      <div>
        <div className="bg-background p-4 rounded-lg">
          <DataTable table={table} loading={isPending} />
        </div>
        <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
      </div>
    </div>
  )
}
