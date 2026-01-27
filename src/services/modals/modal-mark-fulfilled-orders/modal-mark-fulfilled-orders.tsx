import { AllOrderStatus } from "@/constants/all-orders-status"
import { handleHighlightRecord } from "@/routes/_authorize/order/-helper"
import { AllOrderSearchSchema } from "@/schemas/schemas/all-orders"
import { useMutationPod, useQueryPod } from "@/services/connect-rpc/transport"
import { queryClient } from "@/services/react-query"
import {
  staffListOrder,
  staffMarkFulfilled,
  staffPreCheckMarkFulfilled,
} from "@gearment/nextapi/api/pod/v1/admin_api-OrderAdminAPI_connectquery"
import {
  BoxEmpty,
  Button,
  ButtonIconCopy,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  LoadingCircle,
  toast,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { formatTextMany } from "@gearment/utils"
import { useNavigate } from "@tanstack/react-router"
import { Check, CircleCheck, CircleCheckBig, CircleX, X } from "lucide-react"
import { useMarkFulfilledOrderModal } from "./modal-mark-fulfilled-orders-store"

export function ModalMarkFulfilledOrders() {
  const { open, onSave, onClose, orderIds } = useMarkFulfilledOrderModal(
    (state) => ({
      open: state.open,
      onSave: state.onSave,
      onClose: state.onClose,
      orderIds: state.orderIds,
    }),
  )
  const navigate = useNavigate()
  const { data, isLoading } = useQueryPod(
    staffPreCheckMarkFulfilled,
    {
      orderIds,
    },
    {
      enabled: open,
    },
  )

  const mutationMarkFulfill = useMutationPod(staffMarkFulfilled, {
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [staffListOrder.service.typeName, staffListOrder.name],
      })
      const { dismiss } = toast({
        variant: "success",
        description: `Successfully marked order as fulfilled with ${res.successOrderIds.length} orders`,
        title: "Mark fulfilled",
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
                    status: AllOrderStatus.IN_PRODUCTION,
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
    },
    onError: (error) => {
      toast({
        title: "Mark fulfilled",
        description: error.rawMessage,
      })
    },
  })

  const handleMarkFulfilled = async () => {
    await mutationMarkFulfill.mutateAsync({
      orderIds: orderIds,
    })
    onSave()
  }

  const formatCopyOrderIds = (orderIds: string[]) => {
    return orderIds.join("\n")
  }
  const isDisabled = !data?.successOrderIds?.length

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex justify-center items-center py-8">
            <LoadingCircle />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Bulk Mark Orders as Fulfilled (Max: 100 orders)
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="space-y-2">
            <p>You selected {formatTextMany("order", orderIds.length ?? 0)}</p>
            <span className="flex items-center gap-2">
              <Check color="green" className="w-4 h-4" />
              <p>
                {formatTextMany("order", data?.successOrderIds.length ?? 0)} are
                eligible for making as fulfilled
              </p>
            </span>
            <span className="flex items-center gap-2">
              <X color="red" className="w-4 h-4" />
              <p>
                {formatTextMany("order", data?.failedOrders?.length ?? 0)} are
                not eligible due to following reasons
              </p>
            </span>
          </div>
        </DialogDescription>

        <div>
          <span className="flex items-center gap-2">
            <CircleCheckBig color="green" className="w-4 h-4" />
            <p className="font-bold">Eligible orders</p>
            <ButtonIconCopy
              size="sm"
              copyValue={formatCopyOrderIds(data?.successOrderIds ?? [])}
            />
          </span>
          {data?.successOrderIds?.length &&
          data?.successOrderIds?.length > 0 ? (
            <div className="max-h-60 overflow-y-auto border rounded-md p-2">
              <ul className="space-y-2">
                {data?.successOrderIds.map((orderId) => (
                  <li key={orderId} className="text-base">
                    <span className="flex items-center gap-2">
                      <CircleCheck color="green" className="w-4 h-4" />
                      <p>{orderId}</p>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <BoxEmpty title="No eligible orders" description="" />
          )}
        </div>
        <div>
          <span className="flex items-center gap-2">
            <CircleX color="red" className="w-4 h-4" />
            <p className="font-bold">Non-eligible orders</p>
            <ButtonIconCopy
              size="sm"
              copyValue={formatCopyOrderIds(
                data?.failedOrders?.map((order) => order.orderId) ?? [],
              )}
            />
          </span>
          {data?.failedOrders?.length && data?.failedOrders?.length > 0 ? (
            <div className="max-h-60 overflow-y-auto border rounded-md p-2">
              <ul className="space-y-2">
                {data?.failedOrders.map((order) => (
                  <li key={order.orderId} className="text-base">
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="flex items-center gap-2">
                          <CircleX color="red" className="w-4 h-4" />
                          <p>{order.orderId}</p>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="text-sm px-3 py-2 rounded-md"
                      >
                        <span>{order.message}</span>
                      </TooltipContent>
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <BoxEmpty title="No non-eligible orders" description="" />
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleMarkFulfilled} disabled={isDisabled}>
            Confirm fulfill{" "}
            {formatTextMany("order", data?.successOrderIds.length ?? 0)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
