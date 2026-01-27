import { FileType } from "@/schemas/common/common.ts"
import {
  Order_Address,
  Order_BillingOption,
  Order_OrderTracking,
  Order_ShippingOption,
  OrderDraft_Address,
  OrderDraft_BillingOption,
  OrderDraft_ShippingOption,
} from "@/services/connect-rpc/types"
import TrackingInformation from "../tracking-information"
import LabelOrder from "./label-order"
import ManualOrder from "./manual-order"

interface Props {
  address?: Order_Address | OrderDraft_Address
  shippingOption?: Order_ShippingOption | OrderDraft_ShippingOption
  isLabelOrder?: boolean
  isAmazonOrder?: boolean
  shippingLabels?: { labelFile?: FileType; isLabelUpdated?: boolean }[]
  orderId: string
  orderTrackings: Order_OrderTracking[]
  billingOption?: Order_BillingOption | OrderDraft_BillingOption
  addressUpdate?: Order_Address
}

export default function ShippingInformation({
  address,
  shippingOption,
  isLabelOrder,
  shippingLabels,
  isAmazonOrder,
  orderTrackings,
  orderId,
  billingOption,
  addressUpdate,
}: Props) {
  return (
    <div className="p-4 rounded-md bg-background">
      <div className="space-y-4 border-b mb-2">
        {!isLabelOrder && (
          <ManualOrder
            address={address}
            shippingOption={shippingOption}
            billingOption={billingOption}
            addressUpdate={addressUpdate}
          />
        )}
        {isLabelOrder && (
          <LabelOrder
            isEdit={false}
            orderId={orderId}
            isAmazonOrder={isAmazonOrder}
            shippingLabels={shippingLabels}
          />
        )}
      </div>
      <TrackingInformation orderTrackings={orderTrackings} />
    </div>
  )
}
