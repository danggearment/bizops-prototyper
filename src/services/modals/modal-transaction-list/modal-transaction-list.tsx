import { DateTime } from "@/components/common/date-time"
import {
  mappingColor,
  TeamTransactionTypeColorMapping,
} from "@/constants/map-color"
import { AllTransactionType } from "@/constants/payment"
import { useQueryFinance } from "@/services/connect-rpc/transport"
import { formatDateForCallApi } from "@/utils"
import { formatPrice, getPrice } from "@/utils/format-currency"
import { staffListTransaction } from "@gearment/nextapi/api/payment/v1/payment_admin-PaymentAdminAPI_connectquery"
import {
  Badge,
  BoxEmpty,
  DataTable,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  LoadingCircle,
  TablePagination,
  useTable,
} from "@gearment/ui3"
import { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { useModalTransactionListStore } from "./modal-transaction-list-store"

const columns: ColumnDef<any>[] = [
  {
    header: "Transaction ID",
    accessorKey: "txnId",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.txnId}
          <div className="text-sm text-muted-foreground">
            <DateTime date={row.original.createdAt?.toDate() || new Date()} />
          </div>
        </div>
      )
    },
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }) => {
      return (
        <Badge
          variant={mappingColor(
            TeamTransactionTypeColorMapping,
            row.original.type,
          )}
        >
          {AllTransactionType[row.original.type]}
        </Badge>
      )
    },
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ row }) => {
      return (
        <Badge
          variant={getPrice(row.original.amount) < 0 ? "error" : "success"}
        >
          {formatPrice(row.original.amount)}
        </Badge>
      )
    },
  },
]

export default function ModalTransactionList() {
  const { isOpen, filter, actions } = useModalTransactionListStore()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const { data: transactionResponse, isLoading } = useQueryFinance(
    staffListTransaction,
    {
      filter: {
        type: filter.type,
        teamId: filter.teamId || [],
        from: filter.from ? formatDateForCallApi(filter.from) : undefined,
        to: filter.to ? formatDateForCallApi(filter.to, "endOfDay") : undefined,
        methodCode: filter.methodCode || [],
      },
      search: filter.searchText
        ? {
            search: {
              case: "transactionId",
              value: filter.searchText,
            },
          }
        : undefined,
      page,
      limit,
    },
    {
      enabled: isOpen,
      select: (data) => data,
    },
  )

  const listTransaction = transactionResponse?.data || []
  const totalCount = Number(transactionResponse?.total || 0)

  const table = useTable({
    columns: columns,
    data: listTransaction,
    rowCount: totalCount,
    state: {
      pagination: {
        pageIndex: page - 1, // table pagination is 0-based
        pageSize: limit,
      },
    },
    onPaginationChange: (updater) => {
      const newPage =
        typeof updater === "function"
          ? updater(table.getState().pagination)
          : updater
      setPage(newPage.pageIndex + 1)
      setLimit(newPage.pageSize)
    },
  })

  const handleClose = () => {
    setPage(1)
    setLimit(10)
    actions.onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="min-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transaction List</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <LoadingCircle />
          </div>
        ) : listTransaction.length === 0 ? (
          <div className="py-8">
            <BoxEmpty
              title="No transactions found"
              description="No transactions match the current filter criteria."
            />
          </div>
        ) : (
          <>
            <DataTable table={table} />
            <TablePagination
              table={table}
              limitOptions={[10, 50, 100, 200, 500]}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
