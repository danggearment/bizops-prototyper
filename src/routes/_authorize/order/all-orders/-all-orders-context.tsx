import { useQueryPod } from "@/services/connect-rpc/transport"
import { AllOrder_Message } from "@/services/connect-rpc/types"
import { staffSearchMultiTypeOrder } from "@gearment/nextapi/api/pod/v1/admin_api-OrderAdminAPI_connectquery"
import { useSearch } from "@tanstack/react-router"
import { createContext, useContext } from "react"

interface AllOrdersContext {
  orders: AllOrder_Message[]
  notFoundOrders: string[]
  loading: boolean
}

const AllOrdersContext = createContext<AllOrdersContext>({
  orders: [],
  notFoundOrders: [],
  loading: false,
})

interface Props {
  children: React.ReactNode
}

export default function AllOrdersProvider({ children }: Props) {
  const search = useSearch({
    from: "/_authorize/order/all-orders/",
  })

  const { data: rawOrders = { data: [], noOrdersFound: false }, isLoading } =
    useQueryPod(
      staffSearchMultiTypeOrder,
      {
        orderIds: search.orderIds,
        types: search.type ? [search.type] : undefined,
      },
      {
        enabled: !!search.orderIds?.length,
      },
    )

  const orders: AllOrder_Message[] = []
  const notFoundOrders: string[] = []

  for (const order of rawOrders?.data || []) {
    if (order.data.case === "found") {
      orders.push(order.data.value)
    } else if (order.data.case === "notFound") {
      notFoundOrders.push(order.data.value)
    }
  }

  const loading = isLoading

  return (
    <AllOrdersContext.Provider
      value={{
        orders,
        notFoundOrders,
        loading,
      }}
    >
      {children}
    </AllOrdersContext.Provider>
  )
}

export const useAllOrders = () => {
  const context = useContext(AllOrdersContext)
  if (!context) {
    throw new Error("No content provided")
  }

  return context
}
