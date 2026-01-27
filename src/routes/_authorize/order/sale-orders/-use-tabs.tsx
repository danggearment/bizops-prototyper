import {
  AllOrderStatus,
  AllOrderStatusLabel,
} from "@/constants/all-orders-status"
import { BizIcons } from "@gearment/ui3"
import { formatNumber } from "@gearment/utils"
import { useSearch } from "@tanstack/react-router"
import { useMemo } from "react"
import { useAllOrder } from "./-all-orders-context.tsx"

export default function useTabs() {
  const { ordersCount } = useAllOrder()
  const search = useSearch({
    from: "/_authorize/order/sale-orders/",
  })
  const tabs = useMemo(() => {
    const tabs = [
      {
        key: AllOrderStatus.ALL,
        text: AllOrderStatusLabel[AllOrderStatus.ALL],
        icon: (
          <BizIcons.All
            solid={search.processingStatus === AllOrderStatus.ALL}
          />
        ),
      },
      {
        key: AllOrderStatus.AWAITING_PAYMENT,
        text: AllOrderStatusLabel[AllOrderStatus.AWAITING_PAYMENT],
        icon: (
          <BizIcons.Log
            solid={search.processingStatus === AllOrderStatus.AWAITING_PAYMENT}
          />
        ),
      },
      {
        key: AllOrderStatus.PAYMENT_FAILED,
        text: AllOrderStatusLabel[AllOrderStatus.PAYMENT_FAILED],
        icon: (
          <BizIcons.PaymentFailed
            solid={search.processingStatus === AllOrderStatus.PAYMENT_FAILED}
          />
        ),
      },
      {
        key: AllOrderStatus.AWAITING_FULFILLMENT,
        text: AllOrderStatusLabel[AllOrderStatus.AWAITING_FULFILLMENT],
        icon: (
          <BizIcons.AwaitingProduction
            solid={
              search.processingStatus === AllOrderStatus.AWAITING_FULFILLMENT
            }
          />
        ),
      },
      {
        key: AllOrderStatus.IN_PRODUCTION,
        text: AllOrderStatusLabel[AllOrderStatus.IN_PRODUCTION],
        icon: (
          <BizIcons.InProduction
            solid={search.processingStatus === AllOrderStatus.IN_PRODUCTION}
          />
        ),
      },
      {
        key: AllOrderStatus.ON_HOLD,
        text: AllOrderStatusLabel[AllOrderStatus.ON_HOLD],
        icon: (
          <BizIcons.OnHold
            solid={search.processingStatus === AllOrderStatus.ON_HOLD}
          />
        ),
      },
      {
        key: AllOrderStatus.PACKED,
        text: AllOrderStatusLabel[AllOrderStatus.PACKED],
        icon: (
          <BizIcons.Packed
            solid={search.processingStatus === AllOrderStatus.PACKED}
          />
        ),
      },
      {
        key: AllOrderStatus.SHIPPED,
        text: AllOrderStatusLabel[AllOrderStatus.SHIPPED],
        icon: (
          <BizIcons.Shipped
            solid={search.processingStatus === AllOrderStatus.SHIPPED}
          />
        ),
      },
      {
        key: AllOrderStatus.CANCELLED,
        text: AllOrderStatusLabel[AllOrderStatus.CANCELLED],
        icon: (
          <BizIcons.Cancelled
            solid={search.processingStatus === AllOrderStatus.CANCELLED}
          />
        ),
      },
    ]

    return tabs.map((t) => {
      const count = ordersCount.find((order) => order.status === t.key)?.count
      return {
        key: t.key,
        text: (
          <div className="flex items-center gap-2">
            {t.icon}
            <span>
              {t.text}
              {count ? ` (${formatNumber(Number(count))})` : ""}
            </span>
          </div>
        ),
      }
    })
  }, [ordersCount, search.processingStatus])

  return tabs
}
