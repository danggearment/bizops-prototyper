import { DateTime } from "@/components/common/date-time"
import { ShippingPlan } from "@gearment/nextapi/api/ffm/v1/cross_dock_pb"
import {
  BarcodeIcon,
  NotepadTextIcon,
  PlaneLandingIcon,
  PlaneTakeoff,
} from "lucide-react"
import Address from "../../../-components/address"

interface Props {
  shippingPlan: ShippingPlan
}

const getText = (value?: string) => {
  return value ? value : "--"
}

export default function ShippingRoute({ shippingPlan }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">Shipping information</span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="space-y-1">
          <div className="text-sm font-medium flex items-center gap-1">
            Origin address:
          </div>
          <div className="border border-gray-200 rounded-md p-2">
            {shippingPlan.shippingRoute?.origin && (
              <Address address={shippingPlan.shippingRoute?.origin} />
            )}
            {!shippingPlan.shippingRoute?.origin && (
              <div className="text-sm text-gray-500 h-[50px] ">
                Need to update shipping plan
              </div>
            )}
            <div className="flex gap-1 py-2 max-h-[100px] overflow-y-auto">
              <NotepadTextIcon
                size={16}
                className="text-gray-500 shrink-0 sticky top-0"
              />
              <span className="text-sm">
                {getText(shippingPlan.shippingRoute?.origin?.note)}
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-sm font-medium flex items-center gap-1">
            Destination address:
          </div>
          <div className="border border-gray-200 rounded-md p-2">
            {shippingPlan.shippingRoute?.destination && (
              <Address address={shippingPlan.shippingRoute?.destination} />
            )}
            {!shippingPlan.shippingRoute?.destination && (
              <div className="text-sm text-gray-500 h-[40px] ">
                Need to update shipping plan
              </div>
            )}
            <div className="flex gap-1 py-2 max-h-[100px] overflow-y-auto">
              <NotepadTextIcon
                size={16}
                className="text-gray-500 shrink-0 sticky top-0"
              />
              <span className="text-sm">
                {getText(shippingPlan.shippingRoute?.destination?.note)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-4 border rounded-md bg-primary/20 border-primary/20">
        <div className="text-sm font-medium flex gap-2">
          <BarcodeIcon size={16} />
          Tracking number:{" "}
          <span className="text-sm font-normal">
            {getText(shippingPlan.shippingRoute?.trackingInfo?.trackingNumber)}
          </span>
        </div>
        <div className="text-sm font-medium flex gap-2">
          <PlaneTakeoff size={16} />
          Shipping date:{" "}
          <DateTime
            date={shippingPlan.shippingRoute?.shipDate?.toDate()}
            className="text-sm font-normal"
            format="YYYY/MM/DD"
          />
        </div>
        <div className="text-sm font-medium flex gap-2">
          <PlaneLandingIcon size={16} />
          Expected arrival:{" "}
          <DateTime
            date={shippingPlan.shippingRoute?.eta?.toDate()}
            className="text-sm font-normal"
            format="YYYY/MM/DD"
          />
        </div>
      </div>
    </div>
  )
}
