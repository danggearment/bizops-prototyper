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
import { AllOrder_Message, AllOrder_Type } from "@/services/connect-rpc/types"
import { Badge } from "@gearment/ui3"
import { Row } from "@tanstack/react-table"

interface Props {
  row: Row<AllOrder_Message>
}

export default function ThirdPartyStatus({ row }: Props) {
  const { fulfillmentOrderStatus, omsOrderSyncTrackingStatus, type } =
    row.original
  if (!fulfillmentOrderStatus) {
    return (
      <span className={"text-center"}>
        <Badge
          variant={mappingColor<AllOMSOrderSyncTrackingStatus>(
            AllOMSOrderSyncTrackingStatusColorsMapping,
            omsOrderSyncTrackingStatus,
          )}
        >
          {AllOMSOrderSyncTrackingStatusLabel[omsOrderSyncTrackingStatus]}
        </Badge>
      </span>
    )
  }
  return (
    <>
      {(type === AllOrder_Type.SALE || type === AllOrder_Type.ERROR) && (
        <span className={"text-center"}>
          <Badge
            variant={mappingColor<AllFulfillmentOrderStatus>(
              AllFulfillmentOrderStatusColorsMapping,
              fulfillmentOrderStatus,
            )}
          >
            {AllFulfillmentOrderStatusLabel[fulfillmentOrderStatus]}
          </Badge>
        </span>
      )}
    </>
  )
}
