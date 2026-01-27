import { Migration_Account } from "@/services/connect-rpc/types"
import { ModalMigrationJobDetail } from "@/services/modals/modal-migration-job-detail/modal-migration-job-detail"
import { DataTable, TablePagination, useTable } from "@gearment/ui3"
import { useNavigate } from "@tanstack/react-router"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useMigration } from "../../-migration-context"
import CellDate from "../cell-date"
import CellProgress from "./cell-progress"

const columnHelper = createColumnHelper<Migration_Account>()

const columns: ColumnDef<Migration_Account, any>[] = [
  columnHelper.accessor("profileId", {
    header: "#",
    meta: {
      width: 40,
    },
  }),
  columnHelper.accessor("cusId", {
    header: "Customer ID",
    meta: {
      width: 120,
    },
    cell: ({ row }) => {
      return (
        <div className="text-sm">
          CusId: <strong>{row.original.cusId}</strong>
          <br />
          NextUserId: <strong>{row.original.nextUserId}</strong>
          <br />
          Email: {row.original.email}
          <br />
          Name: {row.original.name}
        </div>
      )
    },
  }),
  columnHelper.accessor("createdAt", {
    id: "dateInformation",
    meta: {
      width: 180,
    },
    header: () => <p>Date Information</p>,
    cell: ({ row }) => {
      const createdAt = row.original.createdAt
      const updatedAt = row.original.updatedAt
      return <CellDate createdAt={createdAt} updatedAt={updatedAt} />
    },
  }),
  columnHelper.accessor("progresses", {
    id: "progress",
    header: () => <p>Migration Progress</p>,
    cell: ({ row }) => {
      const progresses = row.original.progresses
      return <CellProgress progresses={progresses} />
    },
  }),
]

export default function TableMigrationAccounts() {
  const navigate = useNavigate({ from: "/dev/migration" })
  const { search, migrationAccounts, isPendingAccount } = useMigration()

  const table = useTable({
    columns,
    data: migrationAccounts.data || [],
    pageCount: migrationAccounts.pageCount,
    rowCount: migrationAccounts.rowCount,
    state: {
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.limit,
      },
    },
    getRowId: (row) => row.nextUserId,
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
    <>
      <div className="bg-background border p-4 rounded-lg">
        <DataTable table={table} loading={isPendingAccount} />
      </div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
      <ModalMigrationJobDetail />
    </>
  )
}
