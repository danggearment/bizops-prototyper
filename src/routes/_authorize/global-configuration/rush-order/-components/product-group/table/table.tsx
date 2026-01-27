import { useQueryPod } from "@/services/connect-rpc/transport"
import { staffListRushProductGroup } from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { RushProductGroupStatus } from "@gearment/nextapi/api/pod/v1/product_admin_pb"
import { DataTable, TablePagination, useTable } from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { ExpandedState, getExpandedRowModel } from "@tanstack/react-table"
import { useState } from "react"
import { columns } from "./column"

export default function ProductGroupTable() {
  const search = useSearch({
    from: "/_authorize/global-configuration/rush-order/",
  })
  const navigate = useNavigate({
    from: "/global-configuration/rush-order",
  })

  const { data: productGroup } = useQueryPod(staffListRushProductGroup, {
    page: search.page,
    limit: search.limit,
    search: {
      groupName: search.search || undefined,
    },
    filter: {
      status: Number(search.status) as unknown as RushProductGroupStatus,
    },
  })

  const [expanded, setExpanded] = useState<ExpandedState>({})
  const table = useTable({
    columns: columns,
    data: productGroup?.data || [],
    rowCount: Number(productGroup?.total) || 0,
    state: {
      expanded,
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.limit,
      },
    },
    enableExpanding: true,
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,
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
    <div>
      <div className="bg-background rounded-lg p-4">
        <DataTable table={table} />
      </div>
      <TablePagination table={table} />
    </div>
  )
}
