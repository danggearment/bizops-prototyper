import {
  AllOrderStatus,
  AllOrderStatusLabel,
} from "@/constants/all-orders-status.ts"
import {
  AllOrderStatusColorsMapping,
  mappingColor,
} from "@/constants/map-color.ts"
import { useMutationPod } from "@/services/connect-rpc/transport"
import {
  OnHoldType,
  Order_Admin,
  Order_OrderRefund,
  Order_TrackingType,
  RefundRequestType,
} from "@/services/connect-rpc/types"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import {
  OnHoldOrdersType,
  useOnHoldOrderModal,
} from "@/services/modals/modal-on-hold-orders"
import { useReasonCancelOrdersModal } from "@/services/modals/modal-reason-cancel-orders"
import { queryClient } from "@/services/react-query"
import {
  staffGetOrder,
  staffHoldOrder,
  staffMarkFulfilled,
  staffResumeOrderOnHold,
} from "@gearment/nextapi/api/pod/v1/admin_api-OrderAdminAPI_connectquery"
import { OrderAdmin } from "@gearment/nextapi/api/pod/v1/admin_api_type_pb"
import {
  Badge,
  Button,
  PageHeader,
  toast,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { Link, useRouterState } from "@tanstack/react-router"
import {
  ArrowLeftIcon,
  CirclePause,
  CirclePlay,
  Info,
  TruckIcon,
  XCircleIcon,
} from "lucide-react"
import { useMemo, useState } from "react"
import DropdownActions from "../../-component/dropdown-actions"

interface Props {
  order: OrderAdmin
  orderRefunds: Order_OrderRefund[]
}

export default function OrderHeader({ order, orderRefunds }: Props) {
  const processingStatus = order.processingStatus
  const status = order.status

  const [openDropdownRefund, setOpenDropdownRefund] = useState(false)

  const actionsCancelModal = useReasonCancelOrdersModal(
    (state) => state.actions,
  )

  const [setOpenOnHold, onCloseOnHold] = useOnHoldOrderModal((state) => [
    state.setOpen,
    state.onClose,
  ])

  const [setOpenConfirm, onClose] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])

  const disabledRefundFull =
    (processingStatus !== AllOrderStatus.CANCELLED &&
      processingStatus !== AllOrderStatus.SHIPPED) ||
    orderRefunds.some(
      (refund) =>
        refund.type === RefundRequestType.FULL ||
        refund.type === RefundRequestType.FULL_BASE_PRICE ||
        refund.type === RefundRequestType.FULL_SHIPPING_FEE ||
        refund.type === RefundRequestType.CUSTOM,
    )

  const disabledShippingFeeRefund =
    orderRefunds.some(
      (refund) =>
        refund.type === RefundRequestType.FULL_SHIPPING_FEE ||
        refund.type === RefundRequestType.FULL ||
        refund.type === RefundRequestType.CUSTOM,
    ) ||
    !(
      processingStatus === AllOrderStatus.CANCELLED ||
      processingStatus === AllOrderStatus.SHIPPED
    )

  const disabledBasePriceRefund =
    orderRefunds.some(
      (refund) =>
        refund.type === RefundRequestType.FULL_BASE_PRICE ||
        refund.type === RefundRequestType.FULL ||
        refund.type === RefundRequestType.CUSTOM,
    ) ||
    !(
      processingStatus === AllOrderStatus.CANCELLED ||
      processingStatus === AllOrderStatus.SHIPPED
    )

  const hideCancelButton =
    processingStatus === AllOrderStatus.CANCELLED ||
    processingStatus === AllOrderStatus.SHIPPED

  const disabledCancel = status === AllOrderStatus.CANCELLED

  const hasOnHold = [
    AllOrderStatus.AWAITING_FULFILLMENT,
    AllOrderStatus.IN_PRODUCTION,
    AllOrderStatus.PACKED,
  ]

  const hasResumeOnHold = [AllOrderStatus.ON_HOLD]

  const disabledOnHold = order.isProcessingOnHold || order.isMarkFulfilled
  const disabledResumeOnHold = order.isResumeOnHold

  const disabledCustomRefund =
    orderRefunds.some((refund) => refund.type === RefundRequestType.FULL) ||
    !(
      processingStatus === AllOrderStatus.CANCELLED ||
      processingStatus === AllOrderStatus.SHIPPED
    )

  const isPrimaryShipment = useMemo(() => {
    return order.orderTrackings?.some(
      (tracking) => tracking.trackingType === Order_TrackingType.PRIMARY,
    )
  }, [order.orderTrackings])

  const showMarkFulfillButton =
    !order.isMarkFulfilled &&
    (processingStatus === AllOrderStatus.IN_PRODUCTION ||
      processingStatus === AllOrderStatus.PACKED) &&
    (order.isLabelAttached || isPrimaryShipment)

  const handleCancelByStatus = async () => {
    actionsCancelModal.setOpen({
      step: "1_form_reason",
      listOrderId: [order.orderId],
      status: processingStatus,
      callbackWhenSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [staffGetOrder.service.typeName, staffGetOrder.name],
        })
      },
    })
  }

  const mutationMarkFulfill = useMutationPod(staffMarkFulfilled, {
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [staffGetOrder.service.typeName, staffGetOrder.name],
      })
      if (res.successOrderIds.length > 0) {
        toast({
          description: "Successfully marked order as fulfilled",
          title: "Mark fulfilled",
        })
      } else {
        toast({
          title: "Mark fulfilled",
          description: "Failed to mark order as fulfilled",
        })
      }
    },
    onError: (error) => {
      toast({
        title: "Mark fulfilled",
        description: error.rawMessage,
      })
    },
  })

  const handleMarkFulfill = async () => {
    setOpenConfirm({
      type: "error",
      title: "Mark fulfilled",
      description: (
        <div>
          Are you sure you want to mark this order as fulfilled?
          <div className="mt-2 font-bold text-red-500">
            This action cannot be undone.
          </div>
        </div>
      ),
      onConfirm: async () => {
        await mutationMarkFulfill.mutateAsync({
          orderIds: [order.orderId],
        })
        onClose()
      },
    })
  }

  const callbackHistory = useRouterState({
    select: (state) => state.location.state,
  })

  const OrderAdmin = new Order_Admin({
    ...order,
    shippingFee: order.orderShippingFee,
    total: order.orderTotal,
    subtotal: order.orderSubtotal,
  })

  const refetchOnHoldAndResumeOrder = () => {
    onCloseOnHold()
    queryClient.invalidateQueries({
      queryKey: [staffGetOrder.service.typeName, staffGetOrder.name],
    })
  }

  const mutationOnHoldOrder = useMutationPod(staffHoldOrder, {
    onSuccess: (res) => {
      refetchOnHoldAndResumeOrder()
      const successCount = res.successOrderIds?.length ?? 0
      const failedCount = res.failedOrders?.length ?? 0

      if (successCount > 0) {
        toast({
          variant: "success",
          title: "On hold",
          description:
            "Please wait a moment while the system updates the status from OMS. This may take a short time.",
        })
      } else if (failedCount > 0) {
        toast({
          variant: "error",
          title: "On hold",
          description: res.failedOrders?.[0]?.message,
        })
      }
    },
    onError: (err) => {
      toast({
        variant: "error",
        title: "On hold failed",
        description: err.rawMessage,
      })
    },
  })

  const handleSubmitOnHold = async (values: OnHoldOrdersType) => {
    await mutationOnHoldOrder.mutateAsync({
      ...values,
      orderIds: [order.orderId],
    })
  }

  const handleOnHold = () => {
    setOpenOnHold({
      onHoldType: OnHoldType.HOLD,
      onSave: handleSubmitOnHold,
      title: "Reason for on-hold",
      description:
        "Please select a valid reason to proceed with putting the order on hold.",
    })
  }

  const mutationResumeOnHoldOrder = useMutationPod(staffResumeOrderOnHold, {
    onSuccess: (res) => {
      refetchOnHoldAndResumeOrder()
      const successCount = res.successOrderIds?.length ?? 0
      const failedCount = res.failedOrders?.length ?? 0

      if (successCount > 0) {
        toast({
          variant: "success",
          title: "Resume order on-hold",
          description:
            "Please wait a moment while the system updates the status from OMS. This may take a short time.",
        })
      } else if (failedCount > 0) {
        toast({
          variant: "error",
          title: "Resume order on-hold",
          description: res.failedOrders?.[0]?.message,
        })
      }
    },
    onError: (err) => {
      toast({
        variant: "error",
        title: "Resume order on-hold failed",
        description: err.rawMessage,
      })
    },
  })

  const handleSubmitResumeOrderOnHold = async (values: OnHoldOrdersType) => {
    await mutationResumeOnHoldOrder.mutateAsync({
      ...values,
      orderIds: [order.orderId],
    })
  }

  const handleResumeOnHold = () => {
    setOpenOnHold({
      onHoldType: OnHoldType.RESUME,
      onSave: handleSubmitResumeOrderOnHold,
      title: "Reason for resume on-hold",
      description:
        "Please select a valid reason to proceed with resuming the order on hold.",
    })
  }

  return (
    <>
      <div className="body-small mb-4">
        <Link
          to={callbackHistory.href || "/order/sale-orders"}
          className="inline-flex items-center gap-2"
        >
          <Button variant={"outline"} size={"icon"}>
            <ArrowLeftIcon size={14} />
          </Button>
          Back to list
        </Link>
      </div>
      <PageHeader>
        <PageHeader.Title>
          <div className="flex flex-wrap justify-between items-center gap-3 text-nowrap">
            <div className="flex items-center gap-3">
              <span className="heading-3 text-foreground">Order Details</span>

              <Badge
                variant={mappingColor(
                  AllOrderStatusColorsMapping,
                  processingStatus,
                )}
              >
                {AllOrderStatusLabel[processingStatus]}
              </Badge>
            </div>
          </div>
        </PageHeader.Title>
        <PageHeader.Action>
          {!hideCancelButton && (
            <div className="flex items-center gap-2">
              {disabledCancel && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-5 h-5" />
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
              <Button
                className="flex items-center gap-2 text-white"
                onClick={handleCancelByStatus}
                disabled={disabledCancel}
                variant={"destructive"}
                size={"sm"}
              >
                <XCircleIcon size={16} />
                <span>Cancel order</span>
              </Button>
            </div>
          )}
          {hasOnHold.includes(processingStatus) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    className="flex items-center gap-2 text-white cursor-pointer"
                    size={"sm"}
                    onClick={handleOnHold}
                    disabled={disabledOnHold}
                  >
                    <CirclePause size={16} />
                    <span>On Hold</span>
                  </Button>
                </div>
              </TooltipTrigger>
              {disabledOnHold && (
                <TooltipContent>
                  <div>
                    {order.isProcessingOnHold && (
                      <p>This order is already being processed for on-hold.</p>
                    )}
                    {order.isMarkFulfilled && (
                      <p>
                        Cannot put order on hold because it has been marked as
                        fulfilled.
                      </p>
                    )}
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          )}
          {hasResumeOnHold.includes(processingStatus) && (
            <Button
              className="flex items-center gap-2 text-white cursor-pointer"
              size={"sm"}
              onClick={handleResumeOnHold}
              disabled={disabledResumeOnHold}
            >
              <CirclePlay size={16} />
              <span>Resume</span>
            </Button>
          )}
          {showMarkFulfillButton && (
            <Button
              className="flex items-center gap-2 text-white cursor-pointer"
              size={"sm"}
              onClick={handleMarkFulfill}
            >
              <TruckIcon size={16} />
              <span>Mark Fulfill</span>
            </Button>
          )}
          {(!disabledRefundFull ||
            !disabledBasePriceRefund ||
            !disabledShippingFeeRefund ||
            !disabledCustomRefund) && (
            <DropdownActions
              disabledRefundFull={disabledRefundFull}
              disabledBasePriceRefund={disabledBasePriceRefund}
              disabledShippingFeeRefund={disabledShippingFeeRefund}
              disabledCustomRefund={disabledCustomRefund}
              dropdownOpen={openDropdownRefund}
              setDropdownOpen={setOpenDropdownRefund}
              disabledCancel={hideCancelButton}
              status={processingStatus}
              selectedOrders={[OrderAdmin]}
            />
          )}
        </PageHeader.Action>
      </PageHeader>

      {order.status == AllOrderStatus.CANCELLED && (
        <div className="text-foreground">
          <p>Cancel reason: {order.cancelReason?.displayName}</p>
          {order.cancelReason?.customReason && (
            <p>Detail: {order.cancelReason.customReason}</p>
          )}
        </div>
      )}
    </>
  )
}
