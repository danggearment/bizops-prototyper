import CellTeam from "@/components/common/cell-team/cell-team"
import ShortText from "@/components/common/short-text"
import StatusIndicator from "@/components/common/status-indicator"
import { OrderFulfillmentVendorLabel } from "@/constants/enum-label"
import { AllCreationMethodsLabelAllOrder } from "@/constants/order"
import { AllPlatform } from "@/constants/platform.ts"
import { TeamSearchSchema } from "@/schemas/schemas/team"
import { useQueryStore } from "@/services/connect-rpc/transport.tsx"
import {
  MarketplacePlatform,
  Order_BillingOption,
  Order_CreatedMethod,
  Order_FulfillmentVendor,
  Order_ShippingOption,
} from "@/services/connect-rpc/types"
import { formatDateString } from "@/utils/format-date"
import { Timestamp } from "@bufbuild/protobuf"
import { staffListMarketplace } from "@gearment/nextapi/api/store/v1/admin_api-StoreAdminAPI_connectquery"
import { Badge, ButtonIconCopy } from "@gearment/ui3"
import { Link, useLocation } from "@tanstack/react-router"
import { ZapIcon } from "lucide-react"
import { useMemo } from "react"
import CellOrderStatus from "../cell-order-status"
import OrderName from "./order-name"

interface Props {
  storeId: string
  fulfillmentOrderId: string
  platformRef: string
  teamCode: string
  orderPlatform: AllPlatform
  storeName: string
  paymentMethodCode: string
  orderLocation: string
  priority: string
  isApproved: boolean
  isCheckedOut: boolean
  isProductMatched: boolean
  isAddressVerified: boolean
  approvedAt?: Timestamp
  createdAt?: Timestamp
  paidAt?: Timestamp
  billingOption?: Order_BillingOption
  shippingOption?: Order_ShippingOption
  openByPassModal: boolean
  setOpenByPassModal: React.Dispatch<React.SetStateAction<boolean>>
  isEdit?: boolean
  orderId: string
  fulfillmentVendor?: Order_FulfillmentVendor
  teamOwnerEmail?: string
  createdByEmail?: string
  isRushOrder?: boolean
  isMarkFulfilled?: boolean
  createdMethod: Order_CreatedMethod
  teamName?: string
}

const defaultValue = "--"

export default function OrderInformation(props: Props) {
  const location = useLocation()

  const { data: marketplaces } = useQueryStore(
    staffListMarketplace,
    undefined,
    {
      select: (data) => data.marketplace,
    },
  )

  const marketplace = useMemo(() => {
    return marketplaces?.find(
      (marketplace) =>
        marketplace.platform ===
        (props.orderPlatform as unknown as MarketplacePlatform),
    )
  }, [marketplaces, props.orderPlatform])

  const FirstColumn = [
    {
      name: "Reference ID",
      value: (
        <ShortText
          text={props.platformRef}
          startLength={4}
          endLength={8}
          allowCopy
        />
      ),
    },
    {
      name: "Fulfillment ID",
      value: !props.fulfillmentOrderId ? (
        defaultValue
      ) : (
        <OrderName orderId={props.fulfillmentOrderId} />
      ),
    },
    {
      name: "Priority",
      value: <span>{props.priority || defaultValue}</span>,
    },
    {
      name: "Store",
      value: (
        <>
          <p>{props.storeName || defaultValue}</p>
          <div className="flex items-center gap-2 text-muted-foreground">
            <p>{props.storeId || defaultValue}</p>
            <ButtonIconCopy size="sm" copyValue={props.storeId} />
          </div>
        </>
      ),
    },
    {
      name: "Team",
      value: (
        <CellTeam
          teamId={props.teamCode || defaultValue}
          teamName={props.teamName || defaultValue}
        />
      ),
    },
    {
      name: props.createdByEmail ? "Created by" : "Team owner",
      value: (
        <>
          {props.createdByEmail || props.teamOwnerEmail ? (
            <div className="flex items-center gap-1 ">
              <Link
                to={"/system/teams"}
                search={() =>
                  TeamSearchSchema.parse({
                    searchText: props.createdByEmail || props.teamOwnerEmail,
                  })
                }
                state={{
                  ...location,
                }}
                className="hover:text-primary"
              >
                {props.createdByEmail || props.teamOwnerEmail}
              </Link>
              <ButtonIconCopy
                size="sm"
                copyValue={props.createdByEmail || props.teamOwnerEmail || ""}
              />
            </div>
          ) : (
            defaultValue
          )}
        </>
      ),
    },

    {
      name: "Fulfillment partner",
      value: (
        <span>
          {props.fulfillmentVendor
            ? OrderFulfillmentVendorLabel[props.fulfillmentVendor]
            : defaultValue}
        </span>
      ),
    },

    {
      name: "Platform",
      value: (
        <img src={marketplace?.logoUrl || ""} className="h-[20px] w-auto" />
      ),
    },
    {
      name: "Creation method",
      value: (
        <span>
          {AllCreationMethodsLabelAllOrder[props.createdMethod] || defaultValue}
        </span>
      ),
    },
  ]

  const SecondColumn = [
    {
      name: "Created at",
      value: props.createdAt
        ? formatDateString(props.createdAt.toDate())
        : defaultValue,
    },
    {
      name: "Approved at",
      value: props.approvedAt
        ? formatDateString(props.approvedAt.toDate())
        : defaultValue,
    },
    {
      name: "Paid at",
      value: props.paidAt
        ? formatDateString(props.paidAt.toDate())
        : defaultValue,
    },
  ]
  return (
    <div className="p-4 rounded-xl bg-background space-y-4 h-full">
      <h3 className="heading-3 mb-4 flex items-center gap-2">
        Order Information
      </h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-600">Order ID:</span>#{props.orderId}
          <ButtonIconCopy size="sm" copyValue={props.orderId} />
        </div>
        <div className="flex items-center gap-2">
          <CellOrderStatus
            productMapped={props.isProductMatched}
            verifyAddress={props.isAddressVerified}
            approve={props.isApproved}
          />
          {props.isRushOrder && (
            <>
              <span className="text-border">|</span>
              <StatusIndicator
                isVerified={props.isRushOrder}
                icon={
                  <ZapIcon
                    size={14}
                    className="stroke-orange-600 fill-orange-600"
                  />
                }
                verifiedText="Rush order"
                unverifiedText="Normal order"
              />
            </>
          )}
          {props.isMarkFulfilled && (
            <>
              <span className="text-border">|</span>
              <Badge variant={"success"}>Mark as Fulfill</Badge>
            </>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
        {[FirstColumn, SecondColumn].map((col, colIdx) => (
          <div key={colIdx} className="space-y-2">
            {col.map((item, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-2">
                <p className="text-gray-600">{item.name}</p>
                <p className="break-all">{item.value}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
