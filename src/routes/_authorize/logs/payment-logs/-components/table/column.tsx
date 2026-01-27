import CellTeam from "@/components/common/cell-team/cell-team"
import Image from "@/components/common/image/image"
import {
  StaffCheckoutRequestStatusLabel,
  StaffCheckoutRequestTypeLabel,
} from "@/constants/enum-label"
import {
  mappingColor,
  StaffCheckoutRequestStatusColorsMapping,
} from "@/constants/map-color"
import { formatPrice } from "@/utils/format-currency"
import { StaffCheckoutRequest_Message } from "@gearment/nextapi/api/payment/v1/data_staff_checkout_request_pb"
import { Badge, CellHeader } from "@gearment/ui3"
import { ColumnDef } from "@tanstack/react-table"
import CellDate from "./cell-date"
import CellOrder from "./cell-order"
import CellTxn from "./cell-txn"

export const columns: ColumnDef<StaffCheckoutRequest_Message>[] = [
  {
    header: "Log ID",
    accessorKey: "id",
  },
  {
    header: "Order IDs",
    accessorKey: "orderIds",
    cell: ({ row }) => {
      return <CellOrder orderIds={row.original.orderIds} />
    },
  },
  {
    header: "Transaction ID ",
    accessorKey: "transactionId",
    cell: ({ row }) => {
      return <CellTxn txnIds={row.original.txnIds} />
    },
  },
  {
    header: "Type",
    accessorKey: "type",
    cell: ({ row }) => {
      return (
        <Badge variant={"info"}>
          {StaffCheckoutRequestTypeLabel[row.original.type]}
        </Badge>
      )
    },
  },
  {
    header: "Payment method",
    accessorKey: "paymentMethodIconUrl",
    cell: ({ row }) => {
      const iconUrl = row.original.paymentMethodIconUrl
      if (!iconUrl) return "--"

      return <Image url={iconUrl} height={24} width={100} responsive="w" />
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      return (
        <Badge
          variant={mappingColor(
            StaffCheckoutRequestStatusColorsMapping,
            row.original.status,
          )}
        >
          {StaffCheckoutRequestStatusLabel[row.original.status]}
        </Badge>
      )
    },
  },
  {
    header: "Amount",
    accessorKey: "amount",
    cell: ({ row }) => {
      return formatPrice(row.original.amount)
    },
  },

  {
    header: "Team information",
    accessorKey: "teamId",
    cell: ({ row }) => {
      return (
        <CellTeam
          teamId={row.original.teamId}
          teamName={row.original.teamName}
        />
      )
    },
  },

  {
    header: (header) => (
      <CellHeader {...header} sort>
        Created at
      </CellHeader>
    ),
    accessorKey: "createdAt",
    cell: ({ row }) => {
      return <CellDate createdAt={row.original.createdAt} />
    },
  },
]
