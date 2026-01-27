import FormSearch from "@/components/form-search/form-search"
import {
  CreditStatementPaymentStatusColorsMapping,
  CreditStatementStatusColorsMapping,
  mappingColor,
} from "@/constants/map-color"
import {
  COMMON_FORMAT_DATETIME_CREDIT,
  StatementPaymentLabel,
  StatementPaymentStatusString,
  StatementStatusLabel,
  StatementStatusOptions,
  StatementStatusString,
} from "@/constants/payment"
import { useQueryFinance } from "@/services/connect-rpc/transport"
import {
  CreditStatementPaymentStatus,
  CreditStatementStatus,
  StaffListStatementHistoryResponse_StatementHistory,
} from "@/services/connect-rpc/types"
import { ModalPaymentStatement } from "@/services/modals/modal-payment-statement"
import { ModalReasonRejectStatement } from "@/services/modals/modal-reason-reject-statement"
import { formatPrice } from "@/utils/format-currency"
import { formatDateString } from "@/utils/format-date"
import { staffListStatementHistory } from "@gearment/nextapi/api/credit/v1/credit_admin-CreditAdminAPI_connectquery"
import {
  Badge,
  Button,
  ComboboxMulti,
  DataTable,
  LoadingCircle,
  TablePagination,
  useTable,
} from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { useParams } from "@tanstack/react-router"
import { ColumnDef } from "@tanstack/react-table"
import { Calendar, Download } from "lucide-react"
import { useCallback, useState } from "react"
import CellActions from "./cell-actions"

const columns: ColumnDef<StaffListStatementHistoryResponse_StatementHistory>[] =
  [
    {
      header: "Statement ID",
      cell: ({ row }) => {
        return <div>{row.original.statementId}</div>
      },
    },
    {
      header: "Billing Period",
      cell: ({ row }) => {
        return (
          <div>
            {formatDateString(
              row.original.statementStartDate?.toDate() || new Date(),
              COMMON_FORMAT_DATETIME_CREDIT,
            )}{" "}
            -
            {formatDateString(
              row.original.statementEndDate?.toDate() || new Date(),
              COMMON_FORMAT_DATETIME_CREDIT,
            )}
          </div>
        )
      },
    },
    {
      header: "Statement Date",
      accessorKey: "statementEndDate",
      cell: ({ row }) => {
        return formatDateString(
          row.original.statementEndDate?.toDate() || new Date(),
          COMMON_FORMAT_DATETIME_CREDIT,
        )
      },
    },
    {
      header: "Due Date",
      accessorKey: "dueDate",
      cell: ({ row }) => {
        return formatDateString(
          row.original.dueDate?.toDate() || new Date(),
          COMMON_FORMAT_DATETIME_CREDIT,
        )
      },
    },
    {
      header: "Amount",
      accessorKey: "totalAmount",
      cell: ({ row }) => {
        return <div>{formatPrice(row.original.totalAmount)}</div>
      },
    },
    {
      header: "Amount Paid",
      accessorKey: "paidAmount",
      cell: ({ row }) => {
        return <div>{formatPrice(row.original.paidAmount)}</div>
      },
    },
    {
      header: "Remaining Due",
      accessorKey: "remainingAmount",
      cell: ({ row }) => {
        return <div>{formatPrice(row.original.remainingAmount)}</div>
      },
    },
    {
      header: "Status",
      accessorKey: "paymentStatus",
      cell: ({ row }) => {
        if (row.original.status === CreditStatementStatus.OVERDUE) {
          return (
            <Badge
              className="text-base"
              variant={mappingColor(
                CreditStatementStatusColorsMapping,
                row.original.status,
              )}
            >
              {StatementStatusLabel[row.original.status]}
            </Badge>
          )
        }

        return (
          <Badge
            className="text-base"
            variant={mappingColor(
              CreditStatementPaymentStatusColorsMapping,
              row.original.paymentStatus,
            )}
          >
            {StatementPaymentLabel[row.original.paymentStatus]}
          </Badge>
        )
      },
    },
    {
      header: "Approved By",
      accessorKey: "approvalBy",
      cell: ({ row }) => {
        return <div>{row.original.approvalBy || "--"}</div>
      },
    },
    {
      header: "Approved At",
      accessorKey: "approvedAt",
      cell: ({ row }) => {
        return formatDateString(
          row.original.dueDate?.toDate() || new Date(),
          COMMON_FORMAT_DATETIME_CREDIT,
        )
      },
    },
    {
      id: "actions",
      cell: (props) => <CellActions {...props} />,
    },
  ]

type StatementStatusOption = {
  code: CreditStatementPaymentStatus | CreditStatementStatus
  type: string
}
export default function SectionStatementHistory() {
  const { teamId } = useParams({
    from: "/_authorize/system/teams/$teamId/g-credits/",
  })

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchKeyword, setSearchKeyword] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<{
    statementStatuses: CreditStatementStatus[]
    paymentStatuses: CreditStatementPaymentStatus[]
  }>({
    statementStatuses: [],
    paymentStatuses: [],
  })
  const [debouncedStatusFilter, setDebouncedStatusFilter] = useState<{
    statementStatuses: CreditStatementStatus[]
    paymentStatuses: CreditStatementPaymentStatus[]
  }>({
    statementStatuses: [],
    paymentStatuses: [],
  })

  const optionsMap = StatementStatusOptions.reduce(
    (acc, option) => {
      acc[option.value] = {
        code: option.code,
        type: option.type,
      }
      return acc
    },
    {} as Record<string, StatementStatusOption>,
  )

  const selectedStatuses = StatementStatusOptions.filter((option) => {
    const isStatementStatus =
      statusFilter.statementStatuses.includes(
        option.code as CreditStatementStatus,
      ) && option.type === StatementStatusString
    const isPaymentStatus =
      statusFilter.paymentStatuses.includes(
        option.code as CreditStatementPaymentStatus,
      ) && option.type === StatementPaymentStatusString
    return isStatementStatus || isPaymentStatus
  }).map((option) => option.value)

  const _debounceStatusFilter = useCallback(
    _debounce(
      (newStatusFilter: {
        statementStatuses: CreditStatementStatus[]
        paymentStatuses: CreditStatementPaymentStatus[]
      }) => {
        setDebouncedStatusFilter(newStatusFilter)
      },
      600,
    ),
    [],
  )

  const handleSelectStatus = (values: string[]) => {
    const statementStatuses = []
    const statementPaymentStatuses = []
    for (const value of values) {
      const option = optionsMap[value]
      if (option.type === StatementStatusString) {
        statementStatuses.push(option.code as CreditStatementStatus)
      }

      if (option.type === StatementPaymentStatusString) {
        statementPaymentStatuses.push(
          option.code as CreditStatementPaymentStatus,
        )
      }
    }
    const newStatusFilter = {
      statementStatuses,
      paymentStatuses: statementPaymentStatuses,
    }
    setStatusFilter(newStatusFilter)
    _debounceStatusFilter(newStatusFilter)
    setPage(1)
  }

  const handleSearchSubmit = (values: { searchText: string }) => {
    setSearchKeyword(values.searchText.trim())
    setPage(1)
  }

  const { data: statementData, isLoading } = useQueryFinance(
    staffListStatementHistory,
    {
      filter: {
        teamIds: [teamId],
        paymentStatus: debouncedStatusFilter.paymentStatuses,
        status: debouncedStatusFilter.statementStatuses,
      },
      search: searchKeyword
        ? {
            search: {
              case: "statementId",
              value: searchKeyword,
            },
          }
        : undefined,
      paging: {
        limit,
        page,
      },
    },
    {
      select: (data) => data,
    },
  )

  const table = useTable({
    columns: columns,
    data: statementData?.data || [],
    rowCount: Number(statementData?.pagination?.total),
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
    onPaginationChange: (updater) => {
      const newPage =
        updater instanceof Function
          ? updater(table.getState().pagination)
          : updater
      setPage(newPage.pageIndex + 1)
      setLimit(newPage.pageSize)
    },
    manualPagination: true,
  })

  if (isLoading) {
    return (
      <div className="border p-4 rounded-lg space-y-4 bg-secondary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="text-lg font-bold">Statement history</span>
          </div>
          <div>
            <Button variant={"outline"} disabled>
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <LoadingCircle />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="border p-4 rounded-lg space-y-4 bg-secondary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="text-lg font-bold">Statement history</span>
          </div>
          <div>
            <Button variant={"outline"}>
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <FormSearch
            onSubmit={handleSearchSubmit}
            placeholder="Search statement"
            value={searchKeyword}
          />
          <div className="max-w-[200px]">
            <ComboboxMulti
              options={StatementStatusOptions}
              onChange={handleSelectStatus}
              placeholder="Select a status"
              value={selectedStatuses}
            />
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <DataTable table={table} />
          <TablePagination table={table} limitOptions={[10, 20, 50, 100]} />
          <div className="flex items-center justify-between border-t py-4">
            <div className="text-muted-foreground">Summary total</div>
            <div className="flex items-center gap-4">
              <span className="text-success-foreground ">
                Total paid: {formatPrice(statementData?.totalPaid)}
              </span>
              <span className="text-error-foreground">
                Outstanding: {formatPrice(statementData?.totalOutstanding)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <ModalPaymentStatement />
      <ModalReasonRejectStatement />
    </>
  )
}
