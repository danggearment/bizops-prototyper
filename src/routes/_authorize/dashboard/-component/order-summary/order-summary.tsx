import OrderCard from "@/routes/_authorize/dashboard/-component/order-summary/order-cart.tsx"
import { useQueryPod } from "@/services/connect-rpc/transport.tsx"
import { Order_OrderStatus } from "@/services/connect-rpc/types"
import { staffCountOrderStatus } from "@gearment/nextapi/api/pod/v1/admin_api-OrderAdminAPI_connectquery.ts"

export default function OrderSummary() {
  const { data } = useQueryPod(
    staffCountOrderStatus,
    {
      filter: {
        processingStatuses: [Order_OrderStatus.ALL],
      },
    },
    {
      select: (data) => data.data,
    },
  )

  const countAllOrders = data?.find(
    (record) => record.status === Order_OrderStatus.ALL,
  )

  const countAwaitingFulFillment = data?.find(
    (record) => record.status === Order_OrderStatus.AWAITING_FULFILLMENT,
  )

  const countInproductionOrders = data?.find(
    (record) => record.status === Order_OrderStatus.IN_PRODUCTION,
  )
  const orders = [
    {
      label: "Total orders",
      count: Number(countAllOrders?.count || 0),
    },
    {
      label: "New orders",
      count: Number(countAwaitingFulFillment?.count || 0),
    },
    {
      label: "In-production orders",
      count: Number(countInproductionOrders?.count || 0),
    },
  ]

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 mb-4">
      {orders.map((order, index) => (
        <OrderCard key={index} label={order.label} count={order.count} />
      ))}
    </div>
  )
}
