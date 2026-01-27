import { useUpdateParcelModal } from "@/services/modals/modal-update-parcel/modal-update-parcel-store"
import { useUpdateTrackingInfoModal } from "@/services/modals/modal-update-tracking-info/modal-update-tracking-info-store"
import { ShippingParcel_Status } from "@gearment/nextapi/api/ffm/v1/cross_dock_pb"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@gearment/ui3"
import { useParams } from "@tanstack/react-router"
import { Row } from "@tanstack/react-table"
import { MoreHorizontalIcon } from "lucide-react"
import { useState } from "react"
import { ShippingParcelWithBoxId } from "./columns"

export default function CellActions({
  row,
}: {
  row: Row<ShippingParcelWithBoxId>
}) {
  const { shippingId } = useParams({
    from: "/_authorize/fulfillment/shipping-plans/(shipping-detail)/$shippingId/",
  })
  const shippingParcel = row.original.parcelId

  const [openDropdown, setOpenDropdown] = useState(false)

  const actionsParcel = useUpdateParcelModal((state) => state.actions)

  const actions = useUpdateTrackingInfoModal((state) => state.actions)
  const trackingInfo = row.original.trackingInfo
    ? {
        trackingNumber: row.original.trackingInfo.trackingNumber ?? "",
        trackingUrl: row.original.trackingInfo.trackingUrl ?? "",
        trackingCarrier: row.original.trackingInfo.trackingCarrier ?? "",
        trackingService: row.original.trackingInfo.trackingService ?? "",
        labelUrl: row.original.trackingInfo.labelUrl ?? "",
      }
    : {
        trackingNumber: "",
        trackingUrl: "",
        trackingCarrier: "",
        trackingService: "",
        labelUrl: "",
      }

  const disabledUpdateTracking =
    row.original.status === ShippingParcel_Status.NEW ||
    row.original.status === ShippingParcel_Status.UNDER_REVIEW

  return (
    <div className="flex justify-end">
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            disabled={disabledUpdateTracking}
            onClick={() => {
              actions.setOpen({
                shippingPlanId: shippingId,
                shippingParcelId: shippingParcel,
                trackingInfo,
              })
              setOpenDropdown(false)
            }}
          >
            Update tracking
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              actionsParcel.setOpen({
                shippingPlanId: shippingId,
                shippingParcelId: shippingParcel,
              })
              setOpenDropdown(false)
            }}
          >
            Update status
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
