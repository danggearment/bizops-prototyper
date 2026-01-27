import { handleHighlightRecord } from "@/routes/_authorize/order/-helper"
import { CreateRefundSchema, RefundFormType } from "@/schemas/schemas/payment"
import {
  useMutationPod,
  useQueryFinance,
} from "@/services/connect-rpc/transport"
import {
  ApproveReason,
  ApproveReasonType,
  Money,
  StaffRequestCustomRefundRequest_CustomRefundRequest,
} from "@/services/connect-rpc/types"
import { queryClient } from "@/services/react-query"
import { getDecimalPart, getNumberFromInputMask } from "@/utils/format-currency"
import { staffListApproveReason } from "@gearment/nextapi/api/payment/v1/payment_admin-PaymentAdminAPI_connectquery"
import {
  staffCountOrderStatus,
  staffListOrder,
  staffRequestBasePriceRefund,
  staffRequestCustomRefund,
  staffRequestFullyRefund,
  staffRequestShippingRefund,
} from "@gearment/nextapi/api/pod/v1/admin_api-OrderAdminAPI_connectquery"
import { Button, Dialog, DialogContent, toast } from "@gearment/ui3"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"
import RefundForm from "./components/refund-form"
import SelectReasonStep from "./components/refund-reason"
import { RefundStep, useRefundOrder } from "./modal-refund-order-store"

export default function ModalRefundOrder() {
  const {
    open,
    refundType,
    currentStep,
    selectedOrders,
    actions,
    callbackSuccess,
  } = useRefundOrder()

  const { data: refundReasonData } = useQueryFinance(
    staffListApproveReason,
    {
      type: ApproveReasonType.REFUND,
    },
    {
      select: (data) => data,
    },
  )

  const otherReasonId = useMemo(
    () =>
      refundReasonData?.data?.find((r) => r.isCustom)?.approveReasonId || "",
    [refundReasonData],
  )
  const [loading, setLoading] = useState(false)

  const { categories, reasonsByCategoryId, reasons } = useMemo(() => {
    const reasonsByCategoryId = new Map<string, ApproveReason[]>()

    const categories = refundReasonData?.categories || []
    categories.forEach((category) => {
      reasonsByCategoryId.set(category.categoryId, [])
    })

    if (refundReasonData?.data) {
      refundReasonData.data.forEach((reason) => {
        if (!reason.isCustom) {
          const categoryReasons = reasonsByCategoryId.get(reason.categoryId)
          if (categoryReasons) {
            categoryReasons.push(reason)
          }
        }
      })
    }

    return {
      categories,
      reasonsByCategoryId,
      reasons: refundReasonData?.data,
    }
  }, [refundReasonData])

  const form = useForm<RefundFormType>({
    resolver: zodResolver(CreateRefundSchema),
    defaultValues: {
      reasonId: "",
      reason: "",
      customReason: "",
      isOtherReason: false,
      customAmounts: {},
    },
  })

  const handleCloseModal = () => {
    actions.reset()
    actions.onClose()
    form.reset()
    actions.setSelectedOrders([])
    callbackSuccess && callbackSuccess()
  }

  const handleSuccess = (res: any) => {
    actions.setSelectedOrders([])
    queryClient.invalidateQueries({
      queryKey: [staffListOrder.service.typeName, staffListOrder.name],
    })
    queryClient.invalidateQueries({
      queryKey: [
        staffCountOrderStatus.service.typeName,
        staffCountOrderStatus.name,
      ],
    })

    const successCount = res.successOrderIds?.length || 0
    const failedCount = res.failedOrderIds?.length || 0

    if (failedCount > 0) {
      const { dismiss } = toast({
        toastLimit: 2,
        variant: "destructive",
        title: "Refund request failed",
        description: `Refund failed for ${failedCount} orders: System error occurred. Please try again later.`,
        action: (
          <div className="flex gap-3">
            <Button
              className="p-0 h-auto text-red-dark body-small font-semibold"
              size="sm"
              variant="link"
              onClick={() => {
                handleHighlightRecord(res.failedOrderRefund, false)
                dismiss()
              }}
            >
              View orders
            </Button>
            <Button
              onClick={() => {
                dismiss()
              }}
              className="p-0 h-auto text-sm text-white"
              size="sm"
              variant="link"
            >
              Dismiss
            </Button>
          </div>
        ),
      })
    }

    if (successCount > 0) {
      const { dismiss } = toast({
        toastLimit: 2,
        title: "Refund request",
        description: `You have successfully processed a full refund for ${successCount} orders.`,
        action: (
          <div className="flex gap-3">
            <Button
              className="p-0 h-auto text-green-700 body-small font-semibold"
              size="sm"
              variant="link"
              onClick={() => {
                handleHighlightRecord(res.successOrderRefund, true)
                dismiss()
              }}
            >
              View orders
            </Button>
            <Button
              onClick={() => {
                dismiss()
              }}
              className="p-0 h-auto text-sm text-muted-foreground"
              size="sm"
              variant="link"
            >
              Dismiss
            </Button>
          </div>
        ),
      })
    }
    handleCloseModal()
    callbackSuccess && callbackSuccess()
  }
  const mutationFullyRefund = useMutationPod(staffRequestFullyRefund, {
    onSuccess: (res) => {
      handleSuccess(res)
    },
    onError: (err) => {
      toast({
        variant: "error",
        title: "Refund request failed",
        description: err.rawMessage,
      })
    },
  })

  const mutationShippingFeeRefund = useMutationPod(staffRequestShippingRefund, {
    onSuccess: (res) => {
      handleSuccess(res)
    },
    onError: (err) => {
      toast({
        variant: "error",
        title: "Shipping fee refund request failed",
        description: err.rawMessage,
      })
    },
  })

  const mutationRefundBasePrice = useMutationPod(staffRequestBasePriceRefund, {
    onSuccess: (res) => {
      handleSuccess(res)
    },
    onError: (err) => {
      toast({
        variant: "error",
        title: "Base price refund request failed",
        description: err.rawMessage,
      })
    },
  })

  const mutationCustomRefund = useMutationPod(staffRequestCustomRefund, {
    onSuccess: (res) => {
      handleSuccess(res)
    },
    onError: (err) => {
      toast({
        variant: "error",
        title: "Base price refund request failed",
        description: err.rawMessage,
      })
    },
  })

  const orderIds = selectedOrders.map((order) => order.orderId)

  const fullyRefundSubmit = async ({
    reasonId,
    reason,
  }: {
    reasonId: string
    reason?: string
  }) => {
    await mutationFullyRefund.mutateAsync({
      orderIds: orderIds,
      reasonId: reasonId,
      reason: reason,
    })
  }

  const fullShippingFeeRefundSubmit = async ({
    reasonId,
    reason,
  }: {
    reasonId: string
    reason?: string
  }) => {
    await mutationShippingFeeRefund.mutateAsync({
      orderIds: orderIds,
      reasonId: reasonId,
      reason: reason,
    })
  }

  const refundBasePriceRefundSubmit = async ({
    reasonId,
    reason,
  }: {
    reasonId: string
    reason?: string
  }) => {
    await mutationRefundBasePrice.mutateAsync({
      orderIds: orderIds,
      reasonId: reasonId,
      reason: reason,
    })
  }

  const customRefundSubmit = async ({
    reasonId,
    reason,
    customAmounts,
  }: {
    reasonId: string
    reason?: string
    customAmounts: Record<string, string>
  }) => {
    const requestCustomRefund: StaffRequestCustomRefundRequest_CustomRefundRequest[] =
      []

    for (const [key, value] of Object.entries(customAmounts)) {
      if (value && getNumberFromInputMask(value) > 0) {
        const numberAmount = getNumberFromInputMask(value)
        const hasDecimalPart = numberAmount.toString().includes(".")
        const amount = new Money({
          units: BigInt(parseInt(numberAmount.toString())),
          nanos: hasDecimalPart ? getDecimalPart(numberAmount) : 0,
        })

        requestCustomRefund.push(
          new StaffRequestCustomRefundRequest_CustomRefundRequest({
            orderId: key,
            amount: amount,
          }),
        )
      }
    }

    await mutationCustomRefund.mutateAsync({
      requests: requestCustomRefund,
      reasonId: reasonId,
      reason: reason,
    })
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const { reasonId, customReason, isOtherReason, customAmounts } =
        form.getValues()
      const reason = isOtherReason
        ? customReason
        : reasons?.find((r) => r.approveReasonId === reasonId)?.reason

      if (refundType === "fully") {
        await fullyRefundSubmit({ reasonId, reason })
      }
      if (refundType === "fullShippingFee") {
        await fullShippingFeeRefundSubmit({ reasonId, reason })
      }
      if (refundType === "refundBasePrice") {
        await refundBasePriceRefundSubmit({ reasonId, reason })
      }
      if (refundType === "refundCustom") {
        await customRefundSubmit({
          reasonId,
          reason,
          customAmounts: customAmounts || {},
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-[1024px] max-h-[80vh] overflow-y-auto">
        <FormProvider {...form}>
          {currentStep === RefundStep.SelectReason && (
            <SelectReasonStep
              onNext={actions.nextStep}
              otherReasonId={otherReasonId}
              categories={categories}
              reasonsByCategoryId={reasonsByCategoryId}
            />
          )}
          {currentStep === RefundStep.RefundDetails && (
            <RefundForm
              selectedOrders={selectedOrders}
              onBack={actions.prevStep}
              onClose={handleCloseModal}
              reasons={reasons || []}
              refundType={refundType}
              handleSubmit={handleSubmit}
              loading={loading}
            />
          )}
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
