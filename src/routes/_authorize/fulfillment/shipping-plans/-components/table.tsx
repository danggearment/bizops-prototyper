import { useQueryFfm } from "@/services/connect-rpc/transport"
import { formatDateForCallApi } from "@/utils"
import { staffListShippingPlan } from "@gearment/nextapi/api/ffm/v1/cross_dock_admin-CrossDockingFulfillmentAdminAPI_connectquery"
import { DataTable, TablePagination, useTable } from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { RowSelectionState } from "@tanstack/react-table"
import { useState } from "react"
import { Columns } from "./columns"
import Filter from "./filter/filter"

export default function TableShippingPlans() {
  const [rowSelected, setRowSelected] = useState<RowSelectionState>({})
  const search = useSearch({
    from: "/_authorize/fulfillment/shipping-plans/",
  })
  const navigate = useNavigate({
    from: "/fulfillment/shipping-plans",
  })
  const { data, refetch } = useQueryFfm(staffListShippingPlan, {
    paging: {
      page: search.page,
      limit: search.limit,
    },
    filter: {
      status: search.status,
      searchText: search.searchText,
      fromDate: search.fromDate
        ? formatDateForCallApi(search.fromDate)
        : undefined,
      toDate: search.toDate ? formatDateForCallApi(search.toDate) : undefined,
    },
  })

  const table = useTable({
    columns: Columns,
    data: data?.items ?? [],
    rowCount: Number(data?.pagination?.total ?? 0),
    pageCount: Number(data?.pagination?.totalPage ?? 0),
    state: {
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.limit,
      },
      rowSelection: rowSelected,
    },
    getRowId: (row) => row.planId,
    onRowSelectionChange: setRowSelected,
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
      <Filter refetch={refetch} />
      <TablePagination table={table} />
      <div className="bg-background rounded-lg p-4">
        <DataTable sticky table={table} />
      </div>
      <TablePagination table={table} />
    </div>
  )
}
