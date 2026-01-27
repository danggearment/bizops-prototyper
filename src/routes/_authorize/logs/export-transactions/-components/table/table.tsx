import { DateTime } from "@/components/common/date-time"
import {
  AllTransactionExportStatusColorsMapping,
  mappingColor,
} from "@/constants/map-color"
import { TransactionExportStatusLabel } from "@/constants/payment"
import {
  TransactionExportSession,
  TransactionExportSessionStatus,
} from "@/services/connect-rpc/types"
import { Badge, DataTable, TablePagination, useTable } from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useExportTransactions } from "../../-export-transactions-context"
import CellFilename from "./cell-filename"

const columnHelper = createColumnHelper<TransactionExportSession>()

function Table() {
  const { loading, exportTransactions, rowCount, pageCount } =
    useExportTransactions()

  const search = useSearch({
    from: "/_authorize/logs/export-transactions/",
  })

  const navigate = useNavigate({
    from: "/logs/export-transactions/",
  })

  const columns: ColumnDef<TransactionExportSession, any>[] = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "File name",
        meta: {
          width: 250,
        },
        cell: (props) => <CellFilename {...props} />,
      }),
      columnHelper.accessor("createdAt", {
        header: "Request time",
        meta: {
          width: 257,
        },
        cell: ({ getValue }) =>
          getValue() ? (
            <DateTime date={getValue().toDate()} className="body-small" />
          ) : (
            ""
          ),
      }),
      columnHelper.accessor("updatedAt", {
        header: "Complete time",
        meta: {
          width: 257,
        },
        cell: ({ getValue }) =>
          getValue() ? (
            <DateTime date={getValue().toDate()} className="body-small" />
          ) : (
            ""
          ),
      }),
      columnHelper.accessor("teamId", {
        header: "Team id",
        meta: {
          width: 257,
        },
        cell: ({ getValue, row }) => (
          <div className="body-small">
            <div>{row.original.teamName}</div>
            <div className=" text-foreground/50">#{getValue()}</div>
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        meta: {
          width: 120,
        },
        cell: ({ getValue }) => {
          const status = getValue<TransactionExportSessionStatus>()
          return (
            <Badge
              variant={mappingColor(
                AllTransactionExportStatusColorsMapping,
                status,
              )}
            >
              {TransactionExportStatusLabel[status]}
            </Badge>
          )
        },
      }),
    ],
    [],
  )
  const table = useTable<TransactionExportSession>({
    columns,
    rowCount,
    pageCount,
    data: exportTransactions,
    state: {
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.limit,
      },
    },
    getRowId: (row) => row.id,
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
    <>
      <div className="rounded-lg  bg-background p-4">
        <DataTable loading={loading} table={table} />
      </div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
    </>
  )
}

export default Table
