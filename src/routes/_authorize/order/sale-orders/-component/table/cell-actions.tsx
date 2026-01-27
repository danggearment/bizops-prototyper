import { AllOrderStatus } from "@/constants/all-orders-status"
import {
  Order_Admin,
  Order_TrackingType,
  RefundRequestType,
} from "@/services/connect-rpc/types"
import { Tooltip, TooltipContent, TooltipTrigger } from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"
import { InfoIcon } from "lucide-react"
import { useMemo, useState } from "react"
import DropdownActions, {
  CancelDropdownItem,
  MarkFulfillDropdownItem,
  OnHoldDropdownItem,
  ResumeOnHoldDropdownItem,
} from "../../../-component/dropdown-actions"

export default function CellActions(props: CellContext<Order_Admin, any>) {
  const {
    orderId,
    status,
    orderRefunds,
    isProcessingOnHold,
    isResumeOnHold,
    isLabelAttached,
    orderTrackings,
    isMarkFulfilled,
    beforeCancelStatus,
  } = props.row.original

  const [dropdownOpen, setDropdownOpen] = useState(false)

  const disabledRefundFull =
    (status !== AllOrderStatus.CANCELLED &&
      status !== AllOrderStatus.SHIPPED) ||
    beforeCancelStatus === AllOrderStatus.PACKED ||
    orderRefunds.some(
      (refund) =>
        refund.type === RefundRequestType.FULL ||
        refund.type === RefundRequestType.FULL_BASE_PRICE ||
        refund.type === RefundRequestType.FULL_SHIPPING_FEE ||
        refund.type === RefundRequestType.CUSTOM,
    )

  const disabledCancel =
    status === AllOrderStatus.CANCELLED || status === AllOrderStatus.SHIPPED

  const disabledShippingFeeRefund =
    orderRefunds.some(
      (refund) =>
        refund.type === RefundRequestType.FULL_SHIPPING_FEE ||
        refund.type === RefundRequestType.FULL ||
        refund.type === RefundRequestType.CUSTOM,
    ) ||
    !(status === AllOrderStatus.CANCELLED || status === AllOrderStatus.SHIPPED)

  const disabledBasePriceRefund =
    orderRefunds.some(
      (refund) =>
        refund.type === RefundRequestType.FULL_BASE_PRICE ||
        refund.type === RefundRequestType.FULL ||
        refund.type === RefundRequestType.CUSTOM,
    ) ||
    !(status === AllOrderStatus.CANCELLED || status === AllOrderStatus.SHIPPED)

  const disabledCustomRefund =
    orderRefunds.some((refund) => refund.type === RefundRequestType.FULL) ||
    !(status === AllOrderStatus.CANCELLED || status === AllOrderStatus.SHIPPED)

  const hasOnHold = [
    AllOrderStatus.AWAITING_FULFILLMENT,
    AllOrderStatus.IN_PRODUCTION,
    AllOrderStatus.PACKED,
  ]

  const hasResumeOnHold = [AllOrderStatus.ON_HOLD]

  const disabledOnHold = isProcessingOnHold || isMarkFulfilled
  const disabledResumeOnHold = isResumeOnHold

  const isPrimaryShipment = useMemo(() => {
    return orderTrackings?.some(
      (tracking) => tracking.trackingType === Order_TrackingType.PRIMARY,
    )
  }, [orderTrackings])

  const disableMarkFulfillButton =
    isMarkFulfilled ||
    (status !== AllOrderStatus.IN_PRODUCTION &&
      status !== AllOrderStatus.PACKED) ||
    (!isLabelAttached && !isPrimaryShipment)

  return (
    <>
      <div className="flex items-center justify-end gap-3">
        <DropdownActions
          disabledRefundFull={disabledRefundFull}
          disabledShippingFeeRefund={disabledShippingFeeRefund}
          disabledBasePriceRefund={disabledBasePriceRefund}
          disabledCustomRefund={disabledCustomRefund}
          disabledCancel={disabledCancel}
          selectedOrders={[props.row.original]}
          status={status}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          as="icon"
        >
          {hasOnHold.includes(status) && (
            <OnHoldDropdownItem
              orderIds={[orderId]}
              setDropdownOpen={setDropdownOpen}
              disabledOnHold={disabledOnHold}
            />
          )}
          {hasResumeOnHold.includes(status) && (
            <ResumeOnHoldDropdownItem
              orderIds={[orderId]}
              setDropdownOpen={setDropdownOpen}
              disabledResumeOnHold={disabledResumeOnHold}
            />
          )}

          <MarkFulfillDropdownItem
            orderIds={[orderId]}
            setDropdownOpen={setDropdownOpen}
            disableMarkFulfillButton={disableMarkFulfillButton}
          />

          <div className="flex justify-between items-center">
            <CancelDropdownItem
              disabledCancel={disabledCancel}
              setDropdownOpen={setDropdownOpen}
              orderIds={[orderId]}
              status={status}
            />
            {disabledCancel && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon size={14} />
                </TooltipTrigger>
                <TooltipContent>
                  <div>
                    <p>This order has been cancelled. </p>
                    <p>
                      Processing status is pending synchronization from a
                      third-party system.
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </DropdownActions>
      </div>
    </>
  )
}
