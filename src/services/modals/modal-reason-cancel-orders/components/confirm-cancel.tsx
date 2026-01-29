import {
  AllOrderStatus,
  AllOrderStatusLabel,
} from "@/constants/all-orders-status"
import {
  AllOrderStatusColorsMapping,
  mappingColor,
} from "@/constants/map-color"
import { handleHighlightRecord } from "@/routes/_authorize/order/-helper"
import { AllOrderSearchSchema } from "@/schemas/schemas/all-orders"
import { useMutationPod } from "@/services/connect-rpc/transport"
import {
  Order_OrderStatus,
  OrderCancelReason,
} from "@/services/connect-rpc/types"
import { queryClient } from "@/services/react-query"
import {
  staffCancelMultiOrder,
  staffCountOrderStatus,
  staffListOrder,
} from "@gearment/nextapi/api/pod/v1/admin_api-OrderAdminAPI_connectquery"
import {
  Badge,
  Button,
  TextareaField,
  toast,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { useNavigate } from "@tanstack/react-router"
import { ChevronDownIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import {
  ReasonCancelOrdersType,
  useReasonCancelOrdersModal,
} from "../modal-reason-cancel-orders"

interface Props {
  reasonId: string
  customReason: string
  status: Order_OrderStatus
  listOrderId: string[]
  handleClose: () => void
  reasonList: OrderCancelReason[]
}
export default function ConfirmCancel({
  reasonId,
  customReason,
  status,
  listOrderId,
  handleClose,
  reasonList,
}: Props) {
  const listRef = useRef<HTMLUListElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)
  const navigate = useNavigate()
  const actionsCancelModal = useReasonCancelOrdersModal(
    (state) => state.actions,
  )
  const [callbackWhenSuccess] = useReasonCancelOrdersModal((state) => [
    state.callbackWhenSuccess,
  ])

  useEffect(() => {
    if (listRef.current) {
      const listHeight = listRef.current.scrollHeight
      setIsOverflowing(listHeight > 400) // Check if the list height exceeds 400px

      const handleScroll = () => {
        if (listRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = listRef.current
          setIsScrolledToBottom(scrollTop + clientHeight >= scrollHeight)
        }
      }

      listRef.current.addEventListener("scroll", handleScroll)
      return () => {
        if (listRef.current) {
          listRef.current.removeEventListener("scroll", handleScroll)
        }
      }
    }
  }, [listOrderId])

  const mutationCancel = useMutationPod(staffCancelMultiOrder, {
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [staffListOrder.service.typeName, staffListOrder.name],
      })
      queryClient.invalidateQueries({
        queryKey: [
          staffCountOrderStatus.service.typeName,
          staffCountOrderStatus.name,
        ],
      })
      callbackWhenSuccess?.()
      handleClose()
      if (res.successOrderIds.length > 0) {
        const { dismiss } = toast({
          variant: "success",
          title: "Cancel request success",
          description:
            "Please wait, OMS is processing your cancellation request.",
          action: (
            <div className="flex gap-3">
              <Button
                className="p-0 h-auto text-green-700 body-small font-semibold"
                size="sm"
                variant="link"
                onClick={() => {
                  navigate({
                    to: "/order/sale-orders",
                    search: AllOrderSearchSchema.parse({
                      status: AllOrderStatus.CANCELLED,
                    }),
                  })
                  setTimeout(() => {
                    handleHighlightRecord(res.successOrderIds, true)
                  }, 1000)
                  dismiss()
                }}
              >
                View orders
              </Button>
              <Button
                onClick={() => {
                  dismiss()
                }}
                className={"p-0 h-auto body-small text-secondary-text"}
                size="sm"
                variant="link"
              >
                Dismiss
              </Button>
            </div>
          ),
        })
      }

      if (res.failedOrders.length > 0) {
        toast({
          variant: "error",
          toastLimit: 2,
          title: "Cancel request failed",
          description: (
            <div>
              <div>{res.failedOrders.length} failed</div>
              {res.failedOrders.length > 0 && (
                <div className="mt-2">
                  <details className="group">
                    <summary className="cursor-pointer text-destructive underline hover:text-destructive/80 font-medium">
                      View reason failed
                    </summary>
                    <ul className="mt-2 list-disc list-inside text-destructive h-48 overflow-y-auto">
                      {res.failedOrders.map((fail) => (
                        <li key={fail.orderId}>
                          <span className="font-semibold tabular-nums">
                            {fail.orderId}:
                          </span>{" "}
                          <span className="capitalize"> {fail.message}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              )}
            </div>
          ),
        })
      }
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Cancel request failed",
        description: err.rawMessage,
      })
    },
  })

  const handleCancel = async () => {
    await mutationCancel.mutateAsync({
      orderIds: listOrderId,
      reasonId,
      customReason,
    })
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="relative">
          <label className="text-base font-semibold">Order ID</label>
          <ul
            ref={listRef}
            className="grid gap-2 overflow-y-auto max-h-[400px]"
          >
            {listOrderId.map((orderId) => (
              <li key={orderId} className="body-small">
                {orderId}
              </li>
            ))}
          </ul>
          <div className="absolute bottom-0 left-0 right-0 flex justify-center bg-gradient-to-t from-white to-transparent">
            <Tooltip defaultOpen>
              {isOverflowing && !isScrolledToBottom && (
                <>
                  <TooltipTrigger>
                    <ChevronDownIcon className="w-6 h-6" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Scroll for more</p>
                  </TooltipContent>
                </>
              )}
            </Tooltip>
          </div>
        </div>
        <div className="space-y-4">
          <div className="">
            <label className="text-base font-semibold block">Status</label>
            <Badge variant={mappingColor(AllOrderStatusColorsMapping, status)}>
              {AllOrderStatusLabel[status]}
            </Badge>
          </div>
        </div>
      </div>
      {reasonId !== "" && (
        <TextareaField
          rows={6}
          readOnly
          label={
            <label className="text-base font-semibold block">
              Cancel reason
            </label>
          }
          value={
            reasonId === ReasonCancelOrdersType.ANOTHER_REASON
              ? customReason
              : (reasonList.find((reason) => reason.reasonId === reasonId)
                  ?.displayName ?? "")
          }
        />
      )}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={() => {
            actionsCancelModal.setStep("1_form_reason")
          }}
        >
          Go back
        </Button>

        <Button
          loading={mutationCancel.isPending}
          disabled={mutationCancel.isPending}
          onClick={handleCancel}
        >
          Confirm
        </Button>
      </div>
    </div>
  )
}
