import CellShippingLabel from "@/components/common/cell-shipping-label"
import CellTrackingNumber from "@/components/common/cell-tracking-number"
import { AllOrderStatusLabel } from "@/constants/all-orders-status"
import {
  AllOrderStatusColorsMapping,
  mappingColor,
} from "@/constants/map-color"
import {
  Order_TrackingType,
  StaffGetTeamTransactionDetailResponse,
  StaffGetTeamTransactionDetailResponse_OrderItem,
  TeamTransactionType,
} from "@/services/connect-rpc/types"
import { formatPrice } from "@/utils"
import { Badge, ButtonIconCopy, DataTable, useTable } from "@gearment/ui3"
import { Link, useLocation } from "@tanstack/react-router"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"

const OrderIdCell = ({ orderId }: { orderId: string }) => {
  const location = useLocation()
  return (
    <div className="px-4 py-2 flex items-center gap-2">
      <Link
        to="/order/$orderId"
        params={{ orderId }}
        className="hover:text-primary font-medium"
        state={{
          ...location,
        }}
      >
        {orderId}
      </Link>
      <ButtonIconCopy copyValue={orderId} size="sm" />
    </div>
  )
}

const columnHelper =
  createColumnHelper<StaffGetTeamTransactionDetailResponse_OrderItem>()

function OrderTable({ data }: { data: StaffGetTeamTransactionDetailResponse }) {
  const columns: ColumnDef<
    StaffGetTeamTransactionDetailResponse_OrderItem,
    any
  >[] = [
    columnHelper.accessor("orderId", {
      header: () => (
        <div className="text-sm font-semibold text-gray-700 px-4 py-3">
          Order ID
        </div>
      ),
      cell: (info) => {
        const orderId = info.getValue()
        return <OrderIdCell orderId={orderId} />
      },
    }),
    columnHelper.accessor("fulfillmentId", {
      header: () => (
        <div className="text-sm font-semibold text-gray-700 px-4 py-3">
          Fulfillment ID
        </div>
      ),
      cell: (info) => {
        return <div className="px-4 py-2">{info.getValue()}</div>
      },
    }),
    columnHelper.accessor((row) => row.orderStatus, {
      id: "orderStatus",
      header: () => (
        <div className="text-sm font-semibold text-gray-700 px-4 py-3">
          Status
        </div>
      ),
      cell: (info) => {
        return (
          <div className="px-4 py-2">
            <Badge
              variant={mappingColor(
                AllOrderStatusColorsMapping,
                info.getValue(),
              )}
            >
              {
                AllOrderStatusLabel[
                  info.getValue() as keyof typeof AllOrderStatusLabel
                ]
              }
            </Badge>
          </div>
        )
      },
    }),
    columnHelper.accessor("orderTrackings", {
      header: () => (
        <div className="text-sm font-semibold text-gray-700 px-4 py-3">
          Tracking information
        </div>
      ),
      cell: (info) => {
        const isLabelAttached = info.row.original.isLabelAttached
        if (!isLabelAttached) {
          const trackingPrimary = info.row.original.orderTrackings.find(
            (tracking) => tracking.trackingType === Order_TrackingType.PRIMARY,
          )
          if (!trackingPrimary) {
            return <div className="px-4 py-2">--</div>
          }
          return (
            <CellTrackingNumber
              labelFile={trackingPrimary.labelFile || null}
              trackingNo={trackingPrimary.trackingNo}
              trackingUrl={trackingPrimary.trackingUrl}
              trackingCarrier={trackingPrimary.carrier}
              trackingService={trackingPrimary.service}
            />
          )
        }
        const shippingLabels = info.row.original.shippingLabels
        if (!shippingLabels.length) {
          return <div className="px-4 py-2">--</div>
        }
        return (
          <CellShippingLabel
            fileUrl={shippingLabels[0].labelFile?.fileUrl || ""}
            fileName={shippingLabels[0].labelFile?.fileName || ""}
          />
        )
      },
    }),
    columnHelper.accessor("orderTotal", {
      header: () => (
        <div className="text-sm font-semibold text-gray-700 px-4 py-3">
          Price
        </div>
      ),
      cell: (info) => {
        const value = info.getValue()
        return (
          <div className="px-4 py-2">{value ? formatPrice(value) : "--"}</div>
        )
      },
    }),
    columnHelper.accessor("refundedTotal", {
      header: () => (
        <div className="text-sm font-semibold text-gray-700 px-4 py-3">
          Refund amount
        </div>
      ),
      cell: (info) => {
        const value = info.getValue()
        return (
          <div className="px-4 py-2">{value ? formatPrice(value) : "--"}</div>
        )
      },
    }),
    columnHelper.accessor("remainingTotal", {
      header: () => (
        <div className="text-sm font-semibold text-gray-700 px-4 py-3">
          Remaining order value
        </div>
      ),
      cell: (info) => {
        const value = info.getValue()
        return (
          <div className="px-4 py-2">{value ? formatPrice(value) : "--"}</div>
        )
      },
    }),
  ]

  const transactionType =
    data?.txnDetail?.txnType || TeamTransactionType.UNSPECIFIED
  const columnVisibility = {
    refundedTotal: transactionType === TeamTransactionType.REFUND,
    remainingTotal: transactionType === TeamTransactionType.REFUND,
  }

  const table = useTable<StaffGetTeamTransactionDetailResponse_OrderItem>({
    columns,
    data: data.orders || [],
    state: {
      columnVisibility,
    },
  })

  return (
    <>
      {(transactionType === TeamTransactionType.PAYMENT ||
        transactionType === TeamTransactionType.REFUND) && (
        <div className="bg-white rounded-md shadow-md overflow-hidden">
          <DataTable table={table} className="divide-y divide-gray-100" />
        </div>
      )}
    </>
  )
}

export default OrderTable
