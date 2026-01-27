import CellShippingLabel from "@/components/common/cell-shipping-label"
import CellTrackingNumber from "@/components/common/cell-tracking-number"
import { DateTime } from "@/components/common/date-time"
import { AllSearchOrderStatusLabel } from "@/constants/all-orders-status"
import {
  AllSearchOrderStatusColorsMapping,
  mappingColor,
} from "@/constants/map-color"
import {
  AllOrder_Message,
  AllOrder_Status,
  Order_TrackingType,
} from "@/services/connect-rpc/types"
import { Badge } from "@gearment/ui3"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import ThirdPartyStatus from "./3rd-status"
import CellCheckbox from "./cell-checkbox"
import CellFfm from "./cell-ffm"
import CellOrder from "./cell-order"
import CellSelect from "./cell-select"
import CellTeam from "./cell-team"
import CellTotal from "./cell-total"

const columnHelper = createColumnHelper<AllOrder_Message>()

export const columns: ColumnDef<AllOrder_Message, any>[] = [
  {
    id: "select",
    meta: {
      width: 40,
    },
    header: (props) => (
      <CellCheckbox
        {...{
          checked: props.table.getIsAllRowsSelected(),
          onChange: props.table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: (props) => (
      <CellSelect
        {...props}
        {...{
          error: true,
          checked: props.row.getIsSelected(),
          disabled: !props.row.getCanSelect(),
          onCheckedChange: props.row.getToggleSelectedHandler(),
        }}
      />
    ),
  },
  columnHelper.accessor("orderId", {
    header: "Order ID",
    meta: {
      width: 100,
    },
    cell: ({ row }) => <CellOrder row={row} />,
  }),
  columnHelper.accessor("fulfillmentOrderIds", {
    id: "fulfillmentOrderId",
    header: () => (
      <span className="whitespace-nowrap">Fulfillment order ID</span>
    ),

    cell: ({ row }) => <CellFfm row={row} />,
  }),
  columnHelper.accessor("processingStatus", {
    header: () => <span className="block w-full">3rd status</span>,
    cell: ({ row }) => <ThirdPartyStatus row={row} />,
  }),
  columnHelper.accessor("teamId", {
    header: () => <span className="whitespace-nowrap">Team information</span>,
    cell: ({ row }) => <CellTeam row={row} />,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => (
      <span className={"text-center"}>
        <Badge
          variant={mappingColor<AllOrder_Status>(
            AllSearchOrderStatusColorsMapping,
            getValue<AllOrder_Status>(),
          )}
        >
          {AllSearchOrderStatusLabel[getValue<AllOrder_Status>()]}
        </Badge>
      </span>
    ),
  }),
  columnHelper.accessor("isLabelAttached", {
    header: () => <span>Tracking information</span>,
    cell: ({ row }) => {
      const isLabelAttached = row.original.isLabelAttached
      if (!isLabelAttached) {
        const trackingPrimary = row.original.orderTrackings.find(
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
      const shippingLabels = row.original.shippingLabels
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
    header: () => <div className="text-right">Total amount</div>,
    cell: ({ row }) => <CellTotal total={row.original.orderTotal} />,
  }),
  columnHelper.accessor("paidAt", {
    id: "paidAt",
    header: () => "Paid date",
    cell: ({ row }) =>
      row.original.paidAt ? (
        <DateTime date={row.original.paidAt.toDate()} />
      ) : (
        "--"
      ),
  }),
]
