import {
  REFUND_ALLOW_SHIPPED_CANCELLED,
  REFUND_FULL_TOOLTIP,
} from "@/constants/payment"
import { useMutationPod } from "@/services/connect-rpc/transport"
import { OnHoldType } from "@/services/connect-rpc/types"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import {
  OnHoldOrdersType,
  useOnHoldOrderModal,
} from "@/services/modals/modal-on-hold-orders"
import { useReasonCancelOrdersModal } from "@/services/modals/modal-reason-cancel-orders"
import { useRefundOrder } from "@/services/modals/modal-refund-order/modal-refund-order-store"
import { queryClient } from "@/services/react-query"
import {
  staffCountOrderStatus,
  staffHoldOrder,
  staffListOrder,
  staffMarkFulfilled,
  staffResumeOrderOnHold,
} from "@gearment/nextapi/api/pod/v1/admin_api-OrderAdminAPI_connectquery"
import {
  Order_Admin,
  Order_OrderStatus,
} from "@gearment/nextapi/api/pod/v1/order_pb"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  toast,
} from "@gearment/ui3"
import {
  BanknoteArrowDown,
  ChevronDownIcon,
  EllipsisVerticalIcon,
  InfoIcon,
} from "lucide-react"

export const CancelDropdownItem = ({
  disabledCancel,
  setDropdownOpen,
  orderIds,
  status,
}: {
  disabledCancel: boolean
  setDropdownOpen: (open: boolean) => void
  orderIds: string[]
  status: Order_OrderStatus
}) => {
  const actionsCancelModal = useReasonCancelOrdersModal(
    (state) => state.actions,
  )

  const callbackSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: [staffListOrder.service.typeName, staffListOrder.name],
    })
    queryClient.invalidateQueries({
      queryKey: [
        staffCountOrderStatus.service.typeName,
        staffCountOrderStatus.name,
      ],
    })
    actionsCancelModal.onClose()
  }

  const handleCancelByStatus = async () => {
    actionsCancelModal.setOpen({
      step: "1_form_reason",
      listOrderId: orderIds,
      status: status,
      callbackWhenSuccess: callbackSuccess,
    })
  }

  return (
    <DropdownMenuItem
      disabled={disabledCancel}
      onClick={() => {
        setDropdownOpen(false)
        handleCancelByStatus()
      }}
    >
      <span className="text-destructive">Cancel</span>
    </DropdownMenuItem>
  )
}

export const OnHoldDropdownItem = ({
  orderIds,
  setDropdownOpen,
  disabledOnHold,
}: {
  orderIds: string[]
  setDropdownOpen: (open: boolean) => void
  disabledOnHold: boolean
}) => {
  const { setOpen, onClose } = useOnHoldOrderModal((state) => ({
    setOpen: state.setOpen,
    onClose: state.onClose,
  }))

  const mutation = useMutationPod(staffHoldOrder, {
    onSuccess: (res) => {
      onClose()
      queryClient.invalidateQueries({
        queryKey: [
          staffCountOrderStatus.service.typeName,
          staffCountOrderStatus.name,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [staffListOrder.service.typeName, staffListOrder.name],
      })
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
    await mutation.mutateAsync({
      ...values,
      orderIds: orderIds,
    })
  }

  const handleOpenOnHold = () => {
    setOpen({
      onHoldType: OnHoldType.HOLD,
      onSave: handleSubmitOnHold,
      title: "Reason for on-hold",
      description:
        "Please select a valid reason to proceed with putting the order on hold.",
    })
  }
  return (
    <DropdownMenuItem
      onClick={() => {
        setDropdownOpen(false)
        handleOpenOnHold()
      }}
      disabled={disabledOnHold}
    >
      <span className="text-primary-text">On Hold</span>
    </DropdownMenuItem>
  )
}

export const MarkFulfillDropdownItem = ({
  orderIds,
  setDropdownOpen,
  disableMarkFulfillButton,
}: {
  orderIds: string[]
  setDropdownOpen: (open: boolean) => void
  disableMarkFulfillButton: boolean
}) => {
  const [setOpenConfirm, onClose] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])

  const mutationMarkFulfill = useMutationPod(staffMarkFulfilled, {
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [staffListOrder.service.typeName, staffListOrder.name],
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
      title: "Mark Fulfilled",
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
          orderIds: orderIds,
        })
        onClose()
      },
    })
  }

  return (
    <DropdownMenuItem
      onClick={() => {
        setDropdownOpen(false)
        handleMarkFulfill()
      }}
      disabled={disableMarkFulfillButton}
    >
      Mark Fulfill
    </DropdownMenuItem>
  )
}
export const ResumeOnHoldDropdownItem = ({
  orderIds,
  setDropdownOpen,
  disabledResumeOnHold,
}: {
  orderIds: string[]
  setDropdownOpen: (open: boolean) => void
  disabledResumeOnHold: boolean
}) => {
  const { setOpen, onClose } = useOnHoldOrderModal((state) => ({
    setOpen: state.setOpen,
    onClose: state.onClose,
  }))

  const mutation = useMutationPod(staffResumeOrderOnHold, {
    onSuccess: (res) => {
      onClose()
      queryClient.invalidateQueries({
        queryKey: [
          staffCountOrderStatus.service.typeName,
          staffCountOrderStatus.name,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [staffListOrder.service.typeName, staffListOrder.name],
      })
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
    await mutation.mutateAsync({
      ...values,
      orderIds: orderIds,
    })
  }

  const handleOpenOnHold = () => {
    setOpen({
      onHoldType: OnHoldType.RESUME,
      onSave: handleSubmitResumeOrderOnHold,
      title: "Reason for resume order on-hold",
      description:
        "Please select a valid reason to proceed with resume order on-hold.",
    })
  }
  return (
    <DropdownMenuItem
      onClick={() => {
        setDropdownOpen(false)
        handleOpenOnHold()
      }}
      disabled={disabledResumeOnHold}
    >
      <span className="text-primary-text">Resume</span>
    </DropdownMenuItem>
  )
}

interface Props {
  disabledRefundFull: boolean
  disabledCancel: boolean
  status: Order_OrderStatus
  dropdownOpen: boolean
  setDropdownOpen: (open: boolean) => void
  children?: React.ReactNode
  as?: "button" | "icon"
  callbackSuccess?: () => void
  selectedOrders: Order_Admin[]
  disabledShippingFeeRefund?: boolean
  disabledBasePriceRefund?: boolean
  disabledCustomRefund?: boolean
}

export default function DropdownActions({
  disabledRefundFull,
  disabledShippingFeeRefund,
  disabledBasePriceRefund,
  disabledCustomRefund,
  dropdownOpen,
  setDropdownOpen,
  selectedOrders,
  children,
  as = "button",
  callbackSuccess,
}: Props) {
  const actions = useRefundOrder((state) => state.actions)

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        {as === "button" ? (
          <Button
            variant="outline"
            onClick={() => setDropdownOpen(true)}
            size={"sm"}
          >
            <BanknoteArrowDown />
            Refund
            <ChevronDownIcon size={16} className="ml-auto" />
          </Button>
        ) : (
          <Button size="sm" variant="ghost">
            <EllipsisVerticalIcon size={16} />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="flex items-center justify-between gap-2">
          Refund
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon size={14} />
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="w-[540px] py-[10px] body-small  whitespace-normal"
            >
              <ul className="list-disc list-inside text-left body-small">
                <li>{REFUND_FULL_TOOLTIP}</li>
                <li>{REFUND_ALLOW_SHIPPED_CANCELLED}</li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={disabledRefundFull}
            className="w-full"
            onClick={() => {
              setDropdownOpen(false)
              actions.onOpen("fully", selectedOrders, callbackSuccess)
            }}
          >
            Full refund
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={disabledBasePriceRefund}
            className="w-full"
            onClick={() => {
              setDropdownOpen(false)
              actions.onOpen("refundBasePrice", selectedOrders, callbackSuccess)
            }}
          >
            Refund base price
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={disabledShippingFeeRefund}
            className="w-full"
            onClick={() => {
              setDropdownOpen(false)
              actions.onOpen("fullShippingFee", selectedOrders, callbackSuccess)
            }}
          >
            Refund shipping fee
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={disabledCustomRefund}
            className="w-full"
            onClick={() => {
              setDropdownOpen(false)
              actions.onOpen("refundCustom", selectedOrders, callbackSuccess)
            }}
          >
            Refund custom
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {children && <DropdownMenuSeparator />}
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
