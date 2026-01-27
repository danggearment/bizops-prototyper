import {
  mappingColor,
  MigrationStatusColorsMapping,
} from "@/constants/map-color"
import {
  MigrationDataTypeLabel,
  MigrationStatusLabel,
} from "@/constants/migration"
import {
  Migration_DataType,
  Migration_Job,
  Migration_Job_Status,
} from "@/services/connect-rpc/types"
import {
  ModalMigrationJobDetail,
  useMigrationJobDetailModal,
} from "@/services/modals/modal-migration-job-detail"
import {
  Badge,
  Button,
  DataTable,
  TablePagination,
  useTable,
} from "@gearment/ui3"
import { useNavigate } from "@tanstack/react-router"
import { ColumnDef, createColumnHelper, Row } from "@tanstack/react-table"
import { CircleArrowDown, CircleArrowUp, Eye } from "lucide-react"
import { useMigration } from "../../-migration-context"
import CellDate from "../cell-date"

const columnHelper = createColumnHelper<Migration_Job>()

const createColumns = (
  onViewDetail: (migrationJob: Migration_Job) => void,
): ColumnDef<Migration_Job, any>[] => [
  columnHelper.accessor("jobId", {
    header: "#",
    meta: {
      width: 40,
    },
  }),
  columnHelper.accessor("dataType", {
    header: "Migration Type",
    meta: {
      width: 130,
    },
    cell: ({ row, getValue }) => {
      return (
        <div className="font-medium">
          Migrate {MigrationDataTypeLabel[getValue<Migration_DataType>()]}
          <br />
          <span className="text-xs text-gray-500">
            CusID: <strong>{row.original.input?.cusId}</strong>
          </span>
        </div>
      )
    },
  }),
  columnHelper.accessor("status", {
    id: "status",
    header: "Status",
    meta: {
      width: 130,
    },
    cell: ({ row }) => (
      <span className={"text-center"}>
        <Badge
          variant={mappingColor<Migration_Job_Status>(
            MigrationStatusColorsMapping,
            row.original.status,
          )}
        >
          {MigrationStatusLabel[row.original.status]}
        </Badge>
      </span>
    ),
  }),
  columnHelper.accessor("error", {
    header: "Results",
    cell: ({ row }) => {
      return (
        <div>
          <div>
            <div className="text-xs text-gray-500">Extracted</div>
            <div className="flex items-center gap-1">
              <CircleArrowUp className="w-4 h-4 text-green-500" />
              <span className="font-medium">
                {String(row.original.totalExtractedCount || 0)}
              </span>{" "}
              (
              <span className="text-green-500">
                {String(row.original.completedExtractedCount || 0)}
              </span>
              /
              <span className="text-red-500">
                {String(row.original.failedExtractedCount || 0)}
              </span>
              )
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Loaded</div>
            <div className="flex items-center gap-1">
              <CircleArrowDown className="w-4 h-4 text-green-500" />
              <span className="font-medium">
                {String(row.original.totalLoadedCount || 0)}
              </span>{" "}
              (
              <span className="text-green-500">
                {String(row.original.completedLoadedCount || 0)}
              </span>
              /
              <span className="text-red-500">
                {String(row.original.failedLoadedCount || 0)}
              </span>
              )
            </div>
          </div>
          {row.original.error && (
            <div className="text-red-500 text-wrap">
              <div className="text-xs text-gray-500">Error:</div>
              <div className="text-xs text-red-500">{row.original.error}</div>
            </div>
          )}
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
  columnHelper.accessor("staffId", {
    header: "Staff ID",
    meta: {
      width: 80,
    },
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    meta: {
      width: 100,
    },
    cell: ({ row }) => {
      const handleViewDetail = () => {
        onViewDetail(row.original)
      }

      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewDetail}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )
    },
  }),
]

export default function TableMigrationJobs() {
  const navigate = useNavigate({ from: "/dev/migration" })
  const { search, migrationJobs, isPendingJob } = useMigration()
  const migrationJobDetailModal = useMigrationJobDetailModal()

  const handleViewDetail = (migrationJob: Migration_Job) => {
    migrationJobDetailModal.setOpen({ migrationJob })
  }

  const columns = createColumns(handleViewDetail)

  const rowProps = (
    row: Row<Migration_Job>,
  ): React.HTMLAttributes<HTMLTableRowElement> => {
    if (row.original && row.original.error) {
      return {
        "aria-errormessage": row.original.error,
        "aria-invalid": "true",
      }
    }
    return {}
  }

  const table = useTable({
    columns,
    data: migrationJobs.data || [],
    pageCount: migrationJobs.pageCount,
    rowCount: migrationJobs.rowCount,
    state: {
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.limit,
      },
    },
    getRowId: (row) => String(row.jobId),
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
        <DataTable
          table={table}
          loading={isPendingJob}
          className="[&_tr[aria-invalid='true']]:bg-yellow-50"
          rowProps={rowProps}
        />
      </div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
      <ModalMigrationJobDetail />
    </>
  )
}
