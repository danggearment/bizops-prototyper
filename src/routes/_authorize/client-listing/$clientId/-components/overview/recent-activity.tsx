import { Card, CardContent, CardHeader, CardTitle } from "@gearment/ui3"
import { format } from "date-fns"
import { useClientDetailContext } from "../../-client-detail-context"

export default function RecentActivity() {
  const { client } = useClientDetailContext()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  // Combine and sort recent orders and payments
  const recentOrders = client.orders.slice(0, 3).map((order) => ({
    type: "order" as const,
    id: order.id,
    title: `Order ${order.orderNumber}`,
    description: `${order.items} items - ${formatCurrency(order.total)}`,
    status: order.status,
    date: order.createdAt,
  }))

  const recentPayments = client.payments.slice(0, 3).map((payment) => ({
    type: "payment" as const,
    id: payment.id,
    title: `Payment ${payment.transactionId}`,
    description: formatCurrency(payment.amount),
    status: payment.status,
    date: payment.createdAt,
  }))

  const activities = [...recentOrders, ...recentPayments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div
                className={`h-2 w-2 rounded-full mt-2 ${
                  activity.type === "order" ? "bg-blue-500" : "bg-green-500"
                }`}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">
                  {activity.description}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {format(new Date(activity.date), "MMM dd, HH:mm")}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
