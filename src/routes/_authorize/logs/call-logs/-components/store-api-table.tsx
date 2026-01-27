import { useStoreAPICallLogsQuery } from "@/data-center/call-logs/use-query"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { PaginationState, SortingState, Updater } from "@tanstack/react-table"
import { getCallLogFilter } from "../-helper"
import { CallLogTable } from "./table/call-log-table"

export default function StoreAPITable() {
  const search = useSearch({
    from: "/_authorize/logs/call-logs/",
  })

  const { filter, paging } = getCallLogFilter(search)

  const { data, isLoading } = useStoreAPICallLogsQuery({
    paging,
    filter,
  })

  const navigate = useNavigate({
    from: "/logs/call-logs",
  })

  const sorting = (search.sortBy || []).map((s, i) => ({
    id: s,
    desc: search.sortDirection ? search.sortDirection[i] === "desc" : false,
  }))

  const handleSortingChange = (updater: Updater<SortingState>) => {
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
  }

  const handlePaginationChange = (updater: Updater<PaginationState>) => {
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
  }

  return (
    <CallLogTable
      data={data?.data ?? []}
      isLoading={isLoading}
      totalPages={Number(data?.pagination?.totalPage ?? 0)}
      rowCount={Number(data?.pagination?.total ?? 0)}
      pageIndex={search.page - 1}
      pageSize={search.limit}
      onPaginationChange={handlePaginationChange}
      onSortingChange={handleSortingChange}
      sorting={sorting}
    />
  )
}
