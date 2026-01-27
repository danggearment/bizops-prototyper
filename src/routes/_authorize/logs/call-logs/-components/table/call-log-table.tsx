import { CallLogEntry } from "@/schemas/schemas/call-logs"
import {
  DataTable,
  TableCell,
  TablePagination,
  TableRow,
  useTable,
} from "@gearment/ui3"
import { ExpandedState, Row } from "@tanstack/react-table"
import { useState } from "react"
import { CallLogDetailView } from "./call-log-detail-view"
import { columns } from "./columns"

interface Props {
  data: CallLogEntry[]
  isLoading: boolean
  totalPages: number
  rowCount: number
  pageIndex: number
  pageSize: number
  onPaginationChange: (updater: any) => void
  onSortingChange: (updater: any) => void
  sorting: any[]
}

export function CallLogTable({
  data,
  isLoading,
  totalPages,
  rowCount,
  pageIndex,
  pageSize,
  onPaginationChange,
  onSortingChange,
  sorting,
}: Props) {
  const [expanded, setExpanded] = useState<ExpandedState>({})

  const table = useTable({
    data,
    columns,
    rowCount,
    pageCount: totalPages,
    onExpandedChange: setExpanded,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
      sorting,
      expanded,
    },
    onSortingChange,
    onPaginationChange,
  })
  const renderSubrow = (row: Row<CallLogEntry>) => {
    return (
      <TableRow>
        <TableCell colSpan={table.getAllColumns().length}>
          <CallLogDetailView callLog={row.original} />
        </TableCell>
      </TableRow>
    )
  }
  return (
    <div>
      <TablePagination table={table} />
      <div className="bg-background p-4 rounded-lg">
        <DataTable
          table={table}
          loading={isLoading}
          renderSubrow={renderSubrow}
        />
      </div>
      <TablePagination table={table} />
    </div>
  )
}
