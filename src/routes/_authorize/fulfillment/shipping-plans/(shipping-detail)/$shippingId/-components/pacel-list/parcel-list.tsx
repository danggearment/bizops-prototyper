import { UpdateParcelModal } from "@/services/modals/modal-update-parcel/modal-update-parcel"
import { UpdateTrackingInfoModal } from "@/services/modals/modal-update-tracking-info/modal-update-tracking-info"
import {
  ShippingParcel,
  ShippingParcel_Item,
  ShippingPlan,
} from "@gearment/nextapi/api/ffm/v1/cross_dock_pb"
import {
  DataTable,
  Table,
  TableCell,
  TableHead,
  TableRow,
  useTable,
} from "@gearment/ui3"
import { ExpandedState, getExpandedRowModel, Row } from "@tanstack/react-table"
import { useState } from "react"
import { columns } from "./columns"

interface ShippingParcelWithBoxId extends ShippingParcel {
  boxId: string
}

export default function ParcelList({
  shippingPlan,
}: {
  shippingPlan: ShippingPlan
}) {
  const shippingBoxes = shippingPlan.shippingBoxes
  const shippingParcels: ShippingParcelWithBoxId[] = shippingBoxes
    .map((box) => {
      return box.parcels.map((parcel) => {
        return new ShippingParcel({
          ...parcel,
          boxId: box.boxId,
        })
      })
    })
    .flat()

  const [expanded, setExpanded] = useState<ExpandedState>({})

  const table = useTable({
    columns,
    data: shippingParcels,
    getRowId: (row) => row.parcelId,
    state: {
      expanded,
      columnPinning: {
        right: ["action"],
      },
    },
    onExpandedChange: setExpanded,
    getExpandedRowModel: getExpandedRowModel(),
  })

  const renderItems = (items: ShippingParcel_Item[]) => {
    return (
      <div className="p-2 space-y-2">
        <h2 className="text-md font-bold">Line items</h2>
        <div className="items-center gap-2 py-2">
          <div className="bg-background border rounded-md p-2">
            <Table>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
              {items.map((item) => (
                <tr key={item.sku}>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell>{item.note}</TableCell>
                </tr>
              ))}
            </Table>
          </div>
        </div>
      </div>
    )
  }

  const renderSubRow = (row: Row<ShippingParcelWithBoxId>) => {
    return (
      <TableRow className="bg-gray-50">
        <TableCell colSpan={100}>{renderItems(row.original.items)}</TableCell>
      </TableRow>
    )
  }

  return (
    <div className="bg-background rounded-md p-4">
      <h2 className="text-lg font-bold mb-4">Parcels information</h2>
      <DataTable table={table} renderSubrow={renderSubRow} />
      <UpdateTrackingInfoModal />
      <UpdateParcelModal />
    </div>
  )
}
