import { useQueryIam } from "@/services/connect-rpc/transport"
import { Flag } from "@/services/connect-rpc/types"
import { staffListFlag } from "@gearment/nextapi/api/iam/v1/user_admin-UserAccountAdminAPI_connectquery"
import { useTable } from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import {
  ColumnDef,
  createColumnHelper,
  PaginationState,
  RowSelectionState,
} from "@tanstack/react-table"
import { useState } from "react"
import CellAction from "./cell-action"
import CellActive from "./cell-active"

const columnHelper = createColumnHelper<Flag>()

const columns: ColumnDef<Flag, any>[] = [
  columnHelper.accessor("flag", {
    header: "Flag name",
    cell: (props) => {
      return props.row.original.flag
    },
  }),
  columnHelper.accessor("defaultRule", {
    header: "Description",
    cell: () => {
      return "--"
    },
  }),
  columnHelper.accessor("variations", {
    header: "Version",
    meta: {
      width: 100,
    },
    cell: (props) => {
      return props.row.original.variations?.trueVar?.version
    },
  }),
  columnHelper.accessor("variations.falseVar", {
    header: "Active",
    meta: {
      width: 100,
    },
    cell: (props) => <CellActive {...props} />,
  }),
  columnHelper.accessor("id", {
    header: () => <div className="text-right">ACTIONS</div>,
    cell: (props) => (
      <div className="flex justify-end">
        <CellAction {...props} />
      </div>
    ),
  }),
]

export default function useFlagTable() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const search = useSearch({
    from: "/_authorize/dev/open-features/",
  })
  const navigate = useNavigate({
    from: "/dev/open-features",
  })

  const { data, isPending } = useQueryIam(
    staffListFlag,
    {
      page: search.page,
      limit: search.limit,
    },
    {
      select: (data) => ({
        flags: data.data,
        rowCount: Number(data?.total),
        pageCount: data?.totalPage,
      }),
    },
  )

  const table = useTable<Flag>({
    columns,
    data: data?.flags || [],
    rowCount: data?.rowCount || 0,
    pageCount: data?.pageCount || 0,
    getRowId: (row) => row.id,
    state: {
      expanded: true,
      rowSelection,
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.limit,
      },
    },
    onRowSelectionChange: setRowSelection,
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

  const handleChangePage = (pagination: PaginationState) => {
    navigate({
      to: "/dev/open-features",
      search: {
        limit: pagination.pageSize,
        page: pagination.pageIndex,
      },
      replace: true,
    })
  }

  return {
    table,
    rowSelection,
    setRowSelection,
    loading: isPending,
    handleChangePage,
  }
}
