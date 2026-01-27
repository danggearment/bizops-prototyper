import {
  Badge,
  Button,
  ButtonIconCopy,
  DialogFooter,
  DialogTitle,
  InputMaskField,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gearment/ui3"
import { RefundType } from "../modal-refund-order-store"

import { AllOrderStatusLabel } from "@/constants/all-orders-status"
import {
  AllOrderStatusColorsMapping,
  mappingColor,
} from "@/constants/map-color"
import { RefundFormType } from "@/schemas/schemas/payment"
import { ApproveReason, Order_Admin } from "@/services/connect-rpc/types"
import { getNumberFromInputMask, getPrice } from "@/utils/format-currency"
import { formatCurrency } from "@gearment/utils"
import { Controller, useFormContext } from "react-hook-form"

interface Props {
  handleSubmit: () => void
  onBack: () => void
  onClose: () => void
  reasons: ApproveReason[]
  selectedOrders: Order_Admin[]
  refundType: RefundType
  loading: boolean
}
export default function RefundForm({
  selectedOrders,
  onBack,
  reasons,
  handleSubmit,
  refundType,
  loading,
}: Props) {
  const form = useFormContext<RefundFormType>()
  const { getValues, control, watch } = form
  const { reasonId, customReason, isOtherReason } = getValues()

  const customAmounts = watch("customAmounts") || {}

  const reason = isOtherReason
    ? customReason
    : reasons?.find((r) => r.approveReasonId === reasonId)?.reason

  const validateCustomAmounts = () => {
    if (refundType !== "refundCustom") return true

    const hasAnyAmount = selectedOrders.every((order) => {
      const amount = customAmounts[order.orderId] || ""
      return amount && getNumberFromInputMask(amount) > 0
    })

    if (!hasAnyAmount) {
      return false
    }

    for (const order of selectedOrders) {
      const customAmount = customAmounts[order.orderId] || ""
      const maxAmount = getPrice(order.total) - getPrice(order.totalRefunded)

      if (
        customAmount &&
        getNumberFromInputMask(customAmount) > 0 &&
        getNumberFromInputMask(customAmount) > maxAmount
      ) {
        return false
      }
    }
    return true
  }

  const refundAmount = (order: Order_Admin) => {
    switch (refundType) {
      case "fully":
        return getPrice(order.total)
      case "fullShippingFee":
        return getPrice(order.shippingFee)
      case "refundBasePrice":
        return getPrice(order.subtotal)
      case "refundCustom": {
        const customAmount = customAmounts[order.orderId] || ""
        return customAmount ? getNumberFromInputMask(customAmount) : 0
      }
    }
  }

  const disabled = loading || !validateCustomAmounts()
  return (
    <>
      <DialogTitle className="text-center">
        <h3 className="mb-2">Refund request confirmation</h3>
        <span className="text-sm bg-gray-100 px-2 py-1 rounded-md font-normal">
          {refundType === "fully" && "Full refund"}
          {refundType === "fullShippingFee" && "Refund shipping fee"}
          {refundType === "refundBasePrice" && "Refund base price"}
          {refundType === "refundCustom" && "Custom refund"}
        </span>
      </DialogTitle>

      <div className="mb-4 text-base">
        <h3 className="text-gray-600">The reason for refund</h3>
        <p className="text-base">{reason}</p>
      </div>

      <div className="max-h-[40vh] overflow-y-auto relative">
        <table className="table w-full caption-bottom text-sm relative ">
          <TableHeader className="sticky top-0 z-[1] bg-background ">
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Current order status</TableHead>
              <TableHead>Refund amount</TableHead>
              <TableHead>Total order value</TableHead>
              <TableHead>Remaining order value</TableHead>
              {refundType === "refundCustom" && (
                <>
                  <TableHead>Refundable amount</TableHead>
                  <TableHead>Already refunded</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="static z-0">
            {selectedOrders.map((order, index) => (
              <TableRow key={order.orderId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="flex items-center gap-2 ">
                  {order.orderId}{" "}
                  <ButtonIconCopy size={"sm"} copyValue={order.orderId} />{" "}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={mappingColor(
                      AllOrderStatusColorsMapping,
                      order.status,
                    )}
                  >
                    {AllOrderStatusLabel[order.status]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {refundType === "refundCustom" ? (
                    <Controller
                      name={`customAmounts.${order.orderId}`}
                      control={control}
                      render={({ field }) => (
                        <InputMaskField
                          placeholder="$0.00"
                          value={field.value || ""}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            field.onChange(e.target.value)
                          }}
                          className="w-32 bg-white dark:bg-dark-2"
                        />
                      )}
                    />
                  ) : (
                    formatCurrency(refundAmount(order))
                  )}
                </TableCell>
                <TableCell>{formatCurrency(getPrice(order.total))}</TableCell>
                <TableCell>
                  {formatCurrency(getPrice(order.total) - refundAmount(order))}
                </TableCell>
                {refundType === "refundCustom" && (
                  <>
                    <TableCell>
                      {formatCurrency(
                        getPrice(order.total) - getPrice(order.totalRefunded),
                      )}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(getPrice(order.totalRefunded))}
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </table>
      </div>
      <DialogFooter className="flex justify-between gap-3 grid grid-cols-2">
        <Button variant="outline" type="button" onClick={onBack}>
          Go back
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={disabled}
          loading={loading}
        >
          Confirm
        </Button>
      </DialogFooter>
    </>
  )
}
