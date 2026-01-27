import {
  OrderDraftStatus,
  OrderDraftStatusLabel,
} from "@/constants/order-draft-status"
import { BizIcons } from "@gearment/ui3"
import { formatNumber } from "@gearment/utils"
import { useSearch } from "@tanstack/react-router"
import { useMemo } from "react"
import { useOrderDraft } from "./-all-orders-context.tsx"

export default function useTabs() {
  const { ordersCount } = useOrderDraft()
  const search = useSearch({
    from: "/_authorize/order/draft-orders/",
  })
  const tabs = useMemo(() => {
    const tabs = [
      {
        key: OrderDraftStatus.ALL,
        text: OrderDraftStatusLabel[OrderDraftStatus.ALL],
        icon: <BizIcons.All solid={search.status === OrderDraftStatus.ALL} />,
      },
      {
        key: OrderDraftStatus.DRAFT,
        text: OrderDraftStatusLabel[OrderDraftStatus.DRAFT],
        icon: (
          <BizIcons.Order solid={search.status === OrderDraftStatus.DRAFT} />
        ),
      },
      {
        key: OrderDraftStatus.AWAITING_CHECKOUT,
        text: OrderDraftStatusLabel[OrderDraftStatus.AWAITING_CHECKOUT],
        icon: (
          <BizIcons.OnHold
            solid={search.status === OrderDraftStatus.AWAITING_CHECKOUT}
          />
        ),
      },
      {
        key: OrderDraftStatus.ARCHIVED,
        text: OrderDraftStatusLabel[OrderDraftStatus.ARCHIVED],
        icon: (
          <BizIcons.Cancelled
            solid={search.status === OrderDraftStatus.ARCHIVED}
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
  }, [ordersCount, search.status])

  return tabs
}
