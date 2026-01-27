import { Card, CardContent } from "@gearment/ui3"
import { DollarSign, Package, ShoppingCart, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { useClientDetailContext } from "../../-client-detail-context"

export default function StatsCards() {
  const { client } = useClientDetailContext()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{client.totalOrders}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold">{formatCurrency(client.totalSpent)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Order Value</p>
              <p className="text-2xl font-bold">{formatCurrency(client.averageOrderValue)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Order</p>
              <p className="text-2xl font-bold">
                {client.lastOrderDate
                  ? format(new Date(client.lastOrderDate), "MMM dd")
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
