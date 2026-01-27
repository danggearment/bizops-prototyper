import StatusIndicator from "@/components/common/status-indicator"
import { AllOrderPriority } from "@/constants/all-orders-status"
import { Order_Admin } from "@/services/connect-rpc/types"
import {
  BizIcons,
  ButtonIconCopy,
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { Link, useLocation } from "@tanstack/react-router"
import { Row } from "@tanstack/react-table"
import { TruckIcon, ZapIcon } from "lucide-react"
import React from "react"
import {
  CreatedDuplicated,
  CreatedMethod,
} from "../../../-component/tooltip-order"

interface Props {
  row: Row<Order_Admin>
  isCrmUrl?: boolean
  children?: React.ReactNode
}

function VendorInitialsBadge({
  vendorName,
  initials,
}: {
  vendorName: string
  initials: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="rounded-lg px-1 bg-primary text-white text-xs font-semibold">
          {initials}
        </div>
      </TooltipTrigger>
      <TooltipContent>Fulfilled by: {vendorName}</TooltipContent>
    </Tooltip>
  )
}

export default function CellOrder({ row, isCrmUrl = false, children }: Props) {
  const location = useLocation()
  const isRushOrder =
    row.original.priority === AllOrderPriority.RUSH || row.original.isRush
  const isMarkFulfilled = row.original.isMarkFulfilled

  const renderCrmUrl = () => {
    const orderId = row.original.fulfillmentOrderId
    return (
      <Link
        to={
          import.meta.env.VITE_CRM_URL +
          "/acp/?site=order&act=show&id=" +
          (orderId.split("-")[1] ? orderId.split("-")[1] : orderId) // Split TW-xxxxxx
        }
        target="_blank"
        rel="noreferrer"
        state={{
          ...location,
        }}
      >
        {orderId}
      </Link>
    )
  }

  const renderOrderId = () => {
    const orderId = row.original.orderId
    const storeName = row.original.storeName
    const refId = row.original.referenceId

    const isFastShipOrder = row.original.shippingMethod === "fastship"

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <Link
            to="/order/$orderId"
            params={{
              orderId: orderId || "",
            }}
            state={{
              ...location,
            }}
          >
            {orderId}
          </Link>
          {orderId && <ButtonIconCopy size="sm" copyValue={orderId} />}
        </div>
        <div className="body-small mb-1 flex items-center gap-1 text-foreground/50">
          <span>{storeName ? `${storeName}` : "--"}</span>
        </div>
        <div className="body-small mb-1 flex items-center gap-1 text-foreground/50">
          <span>Ref ID: {refId ? `${refId}` : "--"}</span>
          {refId && <ButtonIconCopy size="sm" copyValue={refId} />}
        </div>
        <div className="flex items-center gap-2">
          <CreatedMethod
            createdMethod={row.original.createdMethod}
            isLabelAttached={row.original.isLabelAttached}
          />
          {!!row.original.fulfillmentVendorName && (
            <VendorInitialsBadge
              vendorName={row.original.fulfillmentVendorName}
              initials={row.original.fulfillmentVendorShortName}
            />
          )}
          <CreatedDuplicated originOrderId={row.original.originOrderId} />
          {isRushOrder && (
            <StatusIndicator
              isVerified={isRushOrder}
              icon={
                <ZapIcon
                  size={14}
                  className="stroke-orange-600 fill-orange-600"
                />
              }
              verifiedText="Rush order"
              unverifiedText="Normal order"
            />
          )}
          {isMarkFulfilled && (
            <StatusIndicator
              isVerified={isMarkFulfilled}
              icon={<TruckIcon size={14} className="text-primary" />}
              verifiedText="Marked fulfilled"
              unverifiedText="Unmarked fulfilled"
            />
          )}
          {isFastShipOrder && (
            <StatusIndicator
              isVerified={isFastShipOrder}
              icon={
                <BizIcons.CartFastShip className="w-4 h-4 [&>path]:stroke-" />
              }
              verifiedText="Shipping service: Fast Ship"
              unverifiedText="Shipping service: Normal"
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div
        className={cn(
          "text-base font-medium flex gap-1 items-center",
          isCrmUrl && "text-primary",
        )}
      >
        {isCrmUrl ? renderCrmUrl() : renderOrderId()}
      </div>
      {children}
    </div>
  )
}
