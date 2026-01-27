import {
  AllFulfillmentOrderStatus,
  AllFulfillmentOrderStatusLabel,
  AllOMSOrderSyncTrackingStatus,
  AllOMSOrderSyncTrackingStatusLabel,
} from "@/constants/all-orders-status"
import {
  AllFulfillmentOrderStatusColorsMapping,
  AllOMSOrderSyncTrackingStatusColorsMapping,
  mappingColor,
} from "@/constants/map-color"
import { Order_Admin } from "@/services/connect-rpc/types"
import { Badge } from "@gearment/ui3"
import { Row } from "@tanstack/react-table"

interface Props {
  row: Row<Order_Admin>
}

export default function ThirdPartyStatus({ row }: Props) {
  const fulfillmentOrderStatus = row.original.fulfillmentOrderStatus
  const syncStatus = row.original.omsOrderSyncTrackingStatus
  if (!fulfillmentOrderStatus) {
    return (
      <span>
        <Badge
          variant={mappingColor<AllOMSOrderSyncTrackingStatus>(
            AllOMSOrderSyncTrackingStatusColorsMapping,
            syncStatus,
          )}
        >
          {AllOMSOrderSyncTrackingStatusLabel[syncStatus]}
        </Badge>
      </span>
    )
  }
  return (
    <span>
      <Badge
        variant={mappingColor<AllFulfillmentOrderStatus>(
          AllFulfillmentOrderStatusColorsMapping,
          fulfillmentOrderStatus,
        )}
      >
        {AllFulfillmentOrderStatusLabel[fulfillmentOrderStatus]}
      </Badge>
    </span>
  )
}
