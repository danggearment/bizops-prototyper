import { AllOrderRefundStatusLabel } from "@/constants/all-orders-status"
import {
  AllOrderRefundStatusColorsMapping,
  mappingColor,
} from "@/constants/map-color"
import { useListPaymentMethod } from "@/data-center/finances/use-query"
import { Money, Order_OrderRefundStatus } from "@/services/connect-rpc/types"
import { formatPrice } from "@/utils"
import { Badge, BizIcons } from "@gearment/ui3"
import { Link, useLocation } from "@tanstack/react-router"
import { CheckCircleIcon, ChevronRight, WalletIcon } from "lucide-react"
import { useMemo } from "react"

interface Props {
  isCheckedOut: boolean
  totalUnit: number
  totalAmount?: Money
  shippingFee?: Money
  subTotal?: Money
  handleFee?: Money
  taxFee?: Money
  giftMessageFee?: Money
  surchargeFee?: Money
  rushFee?: Money
  extraFee?: Money
  discountFee?: Money
  refundStatus: Order_OrderRefundStatus
  refundTransactionIds?: string[]
  paymentMethodCode?: string
  txnId?: string
}

const defaultValue = "--"

export default function PaymentInformation({
  isCheckedOut,
  totalUnit,
  totalAmount,
  shippingFee,
  subTotal,
  handleFee,
  taxFee,
  giftMessageFee,
  surchargeFee,
  rushFee,
  extraFee,
  discountFee,
  refundStatus,
  refundTransactionIds,
  paymentMethodCode,
  txnId,
}: Props) {
  const { listPaymentMethod } = useListPaymentMethod()
  const location = useLocation()

  const paymentMethod = useMemo(() => {
    return listPaymentMethod?.find((p) => p.methodCode === paymentMethodCode)
  }, [listPaymentMethod, paymentMethodCode])
  const FirstColumn = [
    {
      name: (
        <div className="flex items-center gap-2 h-full">
          <WalletIcon size={16} />
          Payment method
        </div>
      ),
      value: paymentMethodCode ? (
        <img src={paymentMethod?.iconUrl || ""} className="h-[24px] w-auto" />
      ) : (
        <span>{defaultValue}</span>
      ),
    },
    {
      name: (
        <div className="flex items-center gap-2 h-full">
          <CheckCircleIcon size={16} color={isCheckedOut ? "green" : "gray"} />
          Payment status
        </div>
      ),
      value: (
        <Badge variant={isCheckedOut ? "success" : "default"}>
          {isCheckedOut ? "Paid" : "Unpaid"}
        </Badge>
      ),
    },
    {
      name: (
        <div className="flex items-center gap-2">
          <BizIcons.Refund className="w-4 h-4 [&>path]:stroke-gray-600" />
          Refund status
        </div>
      ),
      value:
        refundStatus !== Order_OrderRefundStatus.UNKNOWN ? (
          <Badge
            variant={mappingColor(
              AllOrderRefundStatusColorsMapping,
              refundStatus,
            )}
          >
            {AllOrderRefundStatusLabel[refundStatus]}
          </Badge>
        ) : (
          <span>{defaultValue}</span>
        ),
    },
    {
      name: "Transaction ID",
      value: (
        <div>
          {txnId ? (
            <Link
              key={txnId}
              to={`/finance/transactions/$transactionId`}
              params={{ transactionId: txnId }}
              state={{
                ...location,
              }}
              className="text-primary flex items-center"
            >
              <ChevronRight size={14} /> {txnId}
            </Link>
          ) : (
            defaultValue
          )}
        </div>
      ),
    },
    {
      name: "Refund transaction",
      value: (
        <div>
          {refundTransactionIds?.length === 0 && defaultValue}
          {refundTransactionIds?.map((id) => (
            <div key={id} className="flex items-center gap-2">
              <Link
                to={`/finance/transactions/$transactionId`}
                params={{ transactionId: id }}
                state={{
                  ...location,
                }}
                className="text-primary flex items-center"
              >
                <ChevronRight size={14} />
                {id}
              </Link>
            </div>
          ))}
        </div>
      ),
    },
  ]

  const SecondColumn = [
    {
      name: <div>Total amount</div>,
      value: (
        <span className="font-bold text-foreground">
          {formatPrice(totalAmount) || defaultValue}
        </span>
      ),
    },
    {
      name: "Total unit",
      value: <span>{totalUnit || defaultValue}</span>,
    },
    {
      name: "Subtotal",
      value: <span>{formatPrice(subTotal) || defaultValue}</span>,
    },
    {
      name: "Shipping fee",
      value: <span>{formatPrice(shippingFee) || defaultValue}</span>,
    },

    {
      name: "Handle fee",
      value: <span>{formatPrice(handleFee) || defaultValue}</span>,
    },
    {
      name: "Tax fee",
      value: <span>{formatPrice(taxFee) || defaultValue}</span>,
    },
    {
      name: "Gift message fee",
      value: <span>{formatPrice(giftMessageFee) || defaultValue}</span>,
    },
    {
      name: "Surcharge fee",
      value: <span>{formatPrice(surchargeFee) || defaultValue}</span>,
    },
    {
      name: "Rush order fee",
      value: <span>{formatPrice(rushFee) || defaultValue}</span>,
    },
    {
      name: "Extra fee",
      value: <span>{formatPrice(extraFee) || defaultValue}</span>,
    },
    {
      name: "Discount",
      value: <span>{formatPrice(discountFee) || defaultValue}</span>,
    },
  ]

  return (
    <div className="p-4 rounded-xl bg-background h-full">
      <h3 className="heading-3 mb-4 flex items-center gap-2">
        Payment Information
      </h3>
      <div className="border-b pb-2 space-y-2">
        {FirstColumn.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-2 gap-2 items-center h-full"
          >
            <p className="text-gray-600 h-full">{item.name}</p>
            <p>{item.value}</p>
          </div>
        ))}
      </div>
      <div className="py-2">
        <h5 className="heading-5 mb-2">Payment details</h5>
        <div className="">
          <div className="col-span-1 space-y-2">
            {SecondColumn.map((item, index) => (
              <div key={index} className="grid grid-cols-2 gap-2">
                <p className="text-gray-600">{item.name}</p>
                <p>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
