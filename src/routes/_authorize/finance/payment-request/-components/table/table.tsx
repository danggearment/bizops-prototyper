import { DateTime } from "@/components/common/date-time"
import {
  mappingColor,
  StatementPaymentRequestStatusColorsMapping,
} from "@/constants/map-color"
import { StatementPaymentRequestStatusLabel } from "@/constants/payment"
import {
  Credit_StatementPaymentRequest_Admin,
  CreditStatementPaymentRequestStatus,
  StaffListStatementPaymentRequestResponse,
} from "@/services/connect-rpc/types"
import { formatPrice } from "@/utils/format-currency"
import {
  Badge,
  ButtonIconCopy,
  CellHeader,
  DataTable,
  TablePagination,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useTable,
} from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { NotepadText } from "lucide-react"
import CellAction from "./cell-action"
import CellAmountRequested from "./cell-amount-requested"
import CellRequest from "./cell-request"

const columnHelper = createColumnHelper<Credit_StatementPaymentRequest_Admin>()

const columns: ColumnDef<Credit_StatementPaymentRequest_Admin, any>[] = [
  columnHelper.accessor("requestId", {
    header: () => <span className="whitespace-nowrap">Request ID</span>,
    cell: (props) => <CellRequest {...props} />,
  }),
  columnHelper.accessor("statementId", {
    header: () => <span className="whitespace-nowrap">Statement ID</span>,
    cell: ({ row }) => (
      <span>
        <span className="flex items-center gap-2">
          {row.original.statementId}
          <ButtonIconCopy
            size={"sm"}
            copyValue={row.original.statementId || ""}
            className="ml-2"
          />
        </span>
      </span>
    ),
  }),
  columnHelper.accessor("teamId", {
    header: () => <span className="whitespace-nowrap">Team information</span>,
    cell: ({ row }) => (
      <div className="font-medium">
        <p>{row.original.teamName}</p>
        <div className="flex gap-2 text-foreground/50">
          {row.original.teamId}
          <ButtonIconCopy
            size={"sm"}
            copyValue={row.original.teamId || ""}
            className="ml-2"
          />
        </div>
      </div>
    ),
  }),
  columnHelper.accessor("statementAmount", {
    header: () => <span className="whitespace-nowrap">Statement amount</span>,
    cell: ({ row }) => (
      <span>
        <Badge className="text-sm " variant={"default"}>
          {formatPrice(row.original.statementAmount)}
        </Badge>
      </span>
    ),
  }),
  columnHelper.accessor("requestAmount", {
    header: () => <span className="whitespace-nowrap">Amount requested</span>,
    cell: (props) => <CellAmountRequested {...props} />,
  }),
  columnHelper.accessor("status", {
    header: () => <span className="whitespace-nowrap">Status</span>,
    cell: ({ row }) => (
      <span className="flex items-center">
        <Badge
          className="text-sm "
          variant={mappingColor(
            StatementPaymentRequestStatusColorsMapping,
            row.original.status,
          )}
        >
          {StatementPaymentRequestStatusLabel[row.original.status]}
        </Badge>
        {row.original.status ===
          CreditStatementPaymentRequestStatus.REJECTED && (
          <Tooltip>
            <TooltipTrigger asChild>
              <NotepadText className="w-4 h-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Reject reason: {row.original.rejectReason}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </span>
    ),
  }),
  columnHelper.accessor("resolver", {
    header: () => <span className="whitespace-nowrap">Approver/Rejector</span>,
    cell: ({ row }) => <span>{row.original.resolver || "--"}</span>,
  }),
  columnHelper.accessor("requestedAt", {
    header: (header) => (
      <CellHeader {...header} sort>
        Requested at
      </CellHeader>
    ),
    cell: ({ row }) => (
      <span>
        <DateTime date={row.original.requestedAt?.toDate()} />
      </span>
    ),
  }),
  columnHelper.display({
    id: "action",
    header: () => <span className="block text-right">Actions</span>,
    cell: (props) => <CellAction {...props} />,
  }),
]

interface TableProps {
  data?: StaffListStatementPaymentRequestResponse
  isLoading: boolean
}

export default function Table({ data, isLoading }: TableProps) {
  const search = useSearch({
    from: "/_authorize/finance/payment-request/",
  })
  const navigate = useNavigate({ from: "/finance/payment-request" })

  const sorting = (search.sortBy || []).map((s, i) => ({
    id: s,
    desc: search.sortDirection ? search.sortDirection[i] === "desc" : false,
  }))

  const table = useTable<Credit_StatementPaymentRequest_Admin>({
    columns,
    data: data?.data || [],
    rowCount: Number(data?.pagination?.total) || 0,
    pageCount: data?.pagination?.totalPage || 0,
    manualSorting: true,
    state: {
      columnPinning: {
        right: ["action"],
      },
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.limit,
      },
      sorting,
    },
    onSortingChange: (updater) => {
      const newValue = updater instanceof Function ? updater(sorting) : updater

      const order = newValue.map((s) => s.id)
      const desc = newValue.map((s) => (s.desc ? "desc" : "asc"))

      navigate({
        search: (old) => ({
          ...old,
          sortBy: order,
          sortDirection: desc,
        }),
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
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
      <div className="bg-background rounded-lg p-4">
        <DataTable table={table} loading={isLoading} sticky />
      </div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
    </div>
  )
}
