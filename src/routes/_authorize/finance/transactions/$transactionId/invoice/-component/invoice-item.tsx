import CellShippingLabel from "@/components/common/cell-shipping-label"
import CellTrackingNumber from "@/components/common/cell-tracking-number"
import Image from "@/components/common/image/image"
import { Order_TrackingType } from "@/services/connect-rpc/types"
import { formatPrice } from "@/utils"
import { StaffGetInvoice_InvoiceItem } from "@gearment/nextapi/api/payment/v1/payment_admin_pb"
import { DataTable, useTable } from "@gearment/ui3"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"

interface Props {
  items?: StaffGetInvoice_InvoiceItem[]
}

export default function InvoiceItems({ items }: Props) {
  const columnHelper = createColumnHelper<StaffGetInvoice_InvoiceItem>()

  const columns: ColumnDef<StaffGetInvoice_InvoiceItem, any>[] = [
    columnHelper.accessor("variantName", {
      header: () => <span className="whitespace-nowrap">Order detail</span>,
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex items-center gap-4">
            <Image url={item.productImageUrl} width={50} responsive="w" />
            <div>
              <p className="font-medium">{item.variantName || "--"}</p>
              <p className="text-sm text-gray-500">{item.orderId}</p>
            </div>
          </div>
        )
      },
    }),
    columnHelper.accessor("quantity", {
      header: () => <span className="whitespace-nowrap">Quantity</span>,
      cell: ({ getValue }) => {
        return <span>{Number(getValue())}</span>
      },
    }),
    columnHelper.accessor("isLabelAttached", {
      header: () => (
        <span className="whitespace-nowrap">Tracking information</span>
      ),
      cell: (info) => {
        const isLabelAttached = info.getValue()
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
    columnHelper.accessor("lineTotal", {
      header: () => <span className="whitespace-nowrap">Line total</span>,
      cell: ({ getValue }) => {
        return <div>{formatPrice(getValue())}</div>
      },
    }),
  ]

  const table = useTable({
    columns,
    data: items || [],
    getRowId: (row) => `${row.orderId}`,
  })

  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className="border rounded-md p-4 w-full mt-4">
      <DataTable table={table} />
    </div>
  )
}
