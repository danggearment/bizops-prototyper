import { DateTime } from "@/components/common/date-time"
import Image from "@/components/common/image/image"
import {
  mappingColor,
  TeamTransactionTypeColorMapping,
} from "@/constants/map-color"
import {
  AllTransactionType,
  COMMON_FORMAT_DATETIME_CREDIT,
} from "@/constants/payment"
import { StaffListTransactionResponse_ListTransaction } from "@/services/connect-rpc/types"
import { formatDateString } from "@/utils"
import { Badge, DataTable, TablePagination, useTable } from "@gearment/ui3"
import { useNavigate } from "@tanstack/react-router"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useAllTransaction } from "../../-all-transactions-context"
import CellAmount from "./cell-amount"
import CellImage from "./cell-image"
import CellTxn from "./cell-txn"

const columnHelper =
  createColumnHelper<StaffListTransactionResponse_ListTransaction>()

const columns: ColumnDef<StaffListTransactionResponse_ListTransaction, any>[] =
  [
    columnHelper.accessor("txnId", {
      header: () => (
        <span className={"text-center whitespace-nowrap pr-2"}>
          Transaction ID
        </span>
      ),
      cell: ({ getValue }) => {
        return <CellTxn txnId={getValue()} />
      },
    }),
    columnHelper.accessor("email", {
      header: () => (
        <span className="whitespace-nowrap text-right">Email address</span>
      ),
      cell: ({ row }) => {
        return (
          <span className="block">
            {row.original.email || row.original.teamOwnerEmail || "--"}
          </span>
        )
      },
    }),
    columnHelper.accessor("statementEndDate", {
      header: () => (
        <span className="whitespace-nowrap text-right">Statement date</span>
      ),
      cell: ({ row }) => {
        return (
          <span className="block">
            {row.original.statementEndDate
              ? formatDateString(
                  row.original.statementEndDate?.toDate(),
                  COMMON_FORMAT_DATETIME_CREDIT,
                )
              : "--"}
          </span>
        )
      },
    }),

    columnHelper.accessor("type", {
      header: () => <span className="whitespace-nowrap">Type</span>,
      cell: ({ getValue }) => {
        return (
          <Badge
            variant={mappingColor(TeamTransactionTypeColorMapping, getValue())}
          >
            {AllTransactionType[getValue()]}
          </Badge>
        )
      },
    }),
    columnHelper.accessor("amount", {
      header: () => <span className="whitespace-nowrap">Amount</span>,
      cell: ({ getValue, row }) => {
        const isRefund = row.original.type === AllTransactionType.REFUND
        if (isRefund) {
          return "--"
        }
        return <CellAmount amount={getValue()} />
      },
    }),
    columnHelper.accessor("refundedBy", {
      header: () => <span>Refunded by</span>,
      cell: ({ getValue }) => getValue() || "--",
    }),
    columnHelper.accessor("refundedAmount", {
      header: () => (
        <span className="whitespace-nowrap text-right">Refund amount</span>
      ),
      cell: ({ getValue, row }) => {
        const isRefund = row.original.type === AllTransactionType.REFUND
        if (!isRefund) {
          return "--"
        }
        return <CellAmount amount={getValue()} />
      },
    }),
    columnHelper.accessor("methodIconUrls", {
      header: () => <p className="whitespace-nowrap ">Payment method</p>,
      cell: ({ getValue }) => {
        const iconUrl = getValue()
        if (!iconUrl) return null
        return <Image url={iconUrl} height={24} width={100} responsive="w" />
      },
    }),
    columnHelper.accessor("fileUrls", {
      header: () => <span>Payment receipt</span>,
      cell: (props) => <CellImage {...props} />,
    }),
    columnHelper.accessor("approvalBy", {
      header: () => <span>Approval by</span>,
      cell: ({ getValue }) => getValue() || "--",
    }),

    columnHelper.accessor("createdAt", {
      header: () => <span>Created date</span>,
      cell: (info) => {
        const value = info.getValue()
        return (
          <p>
            <DateTime date={value ? value.toDate() : undefined} />
          </p>
        )
      },
    }),
    columnHelper.accessor("approvedAt", {
      header: () => <span>Approved at</span>,
      cell: (info) => {
        const value = info.getValue()
        return (
          <p>
            {value ? (
              <DateTime date={value ? value.toDate() : undefined} />
            ) : (
              "--"
            )}
          </p>
        )
      },
    }),
  ]

export default function TableAllTransaction() {
  const { search, rowSelection, setRowSelection, transactions, total } =
    useAllTransaction()

  const navigate = useNavigate({
    from: "/finance/transactions",
  })

  const table = useTable({
    columns,
    data: transactions || [],
    rowCount: total,
    state: {
      rowSelection: rowSelection,
      columnVisibility: {
        methodIconUrls: search.type !== AllTransactionType.REFUND,
        amount: search.type !== AllTransactionType.REFUND,
        fileUrls:
          search.type === AllTransactionType.DEPOSIT ||
          search.type === AllTransactionType.ALL,
        approvalBy:
          search.type === AllTransactionType.DEPOSIT ||
          search.type === AllTransactionType.SETTLEMENT ||
          search.type === AllTransactionType.ALL,
        refundedAmount:
          search.type === AllTransactionType.REFUND ||
          search.type === AllTransactionType.ALL,
        refundedBy:
          search.type === AllTransactionType.REFUND ||
          search.type === AllTransactionType.ALL,
        type: search.type === AllTransactionType.ALL,
        statementEndDate: search.type === AllTransactionType.SETTLEMENT,
        approvedAt: search.type === AllTransactionType.SETTLEMENT,
        createdAt: search.type !== AllTransactionType.SETTLEMENT,
      },
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.limit,
      },
    },
    getRowId: (row) => row.txnId,
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
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
      <div className="bg-background p-4 rounded-lg">
        <DataTable
          table={table}
          loading={false}
          sticky
          reInitSticky={true}
          //   headerAction={headerAction}
        />
      </div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
    </>
  )
}
