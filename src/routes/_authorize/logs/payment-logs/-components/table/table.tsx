import { usePaymentLogsQuery } from "@/data-center/payment-logs/use-query"
import { DataTable, TablePagination, useTable } from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { getFilter } from "../../-helper"
import { columns } from "./column"

export default function Table() {
  const search = useSearch({
    from: "/_authorize/logs/payment-logs/",
  })

  const { filter, sortCriterion, pagination } = getFilter(search)

  const { data, isLoading } = usePaymentLogsQuery({
    pagination,
    filter,
    sortCriterion,
  })

  const navigate = useNavigate({
    from: "/logs/payment-logs",
  })

  const sorting = (search.sortBy || []).map((s, i) => ({
    id: s,
    desc: search.sortDirection ? search.sortDirection[i] === "desc" : false,
  }))

  const table = useTable({
    columns: columns,
    data: data?.data ?? [],
    rowCount: Number(data?.pagination?.total ?? 0),
    pageCount: Number(data?.pagination?.totalPage ?? 0),
    state: {
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.limit,
      },
      sorting: sorting,
    },
    onSortingChange: (updater) => {
      const newValue = updater instanceof Function ? updater(sorting) : updater

      const order = newValue.map((s) => s.id)
      const desc = newValue.map((s) => (s.desc ? "desc" : "asc"))

      navigate({
        search: (old) => {
          return {
            ...old,
            sortBy: order,
            sortDirection: desc,
          }
        },
        replace: true,
      })
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
      <TablePagination table={table} />
      <div className="bg-background p-4 rounded-lg">
        <DataTable sticky table={table} loading={isLoading} />
      </div>
      <TablePagination table={table} />
    </div>
  )
}
