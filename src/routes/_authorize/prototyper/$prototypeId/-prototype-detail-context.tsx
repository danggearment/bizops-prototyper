import { useParams } from "@tanstack/react-router"
import { createContext, useContext, type ReactNode } from "react"
import type { PrototypeType } from "../-components/table/columns"

const MOCK_PROTOTYPES: PrototypeType[] = [
  {
    id: "proto-001",
    moduleName: "Order Management",
    description:
      "Complete order management module with filtering, search, and bulk actions",
    status: "completed",
    createdAt: "2024-01-15T10:30:00Z",
    createdBy: "John Doe",
    files: [
      {
        path: "src/routes/_authorize/order-management/index.tsx",
        content: `import { PageHeader } from "@gearment/ui3"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { OrderManagementSearchSchema } from "@/schemas/schemas/order-management"
import OrderManagementProvider from "./-order-management-context"
import Filter from "./-components/filter/filter"
import Table from "./-components/table/table"

export const Route = createFileRoute("/_authorize/order-management/")({
  validateSearch: zodValidator(OrderManagementSearchSchema),
  search: {
    middlewares: [stripSearchParams(OrderManagementSearchSchema.parse({}))],
  },
  component: () => (
    <OrderManagementProvider>
      <Index />
    </OrderManagementProvider>
  ),
  beforeLoad: () => ({
    breadcrumb: [{ link: "/order-management", name: "Order Management" }],
  }),
})

function Index() {
  return (
    <>
      <PageHeader>
        <PageHeader.Title>Order Management</PageHeader.Title>
      </PageHeader>
      <div className="space-y-4">
        <Filter />
        <Table />
      </div>
    </>
  )
}`,
        type: "create",
      },
      {
        path: "src/routes/_authorize/order-management/-order-management-context.tsx",
        content: `import { createContext, useContext, type ReactNode } from "react"
import type { OrderType } from "./-components/table/columns"

const MOCK_DATA: OrderType[] = [
  { id: "ORD-001", customerName: "John Smith", status: "pending", total: 125.50, createdAt: "2024-01-15T10:30:00Z" },
  { id: "ORD-002", customerName: "Jane Doe", status: "completed", total: 299.99, createdAt: "2024-01-14T15:20:00Z" },
]

interface OrderManagementContextType {
  orders: OrderType[]
  loading: boolean
  total: number
}

const OrderManagementContext = createContext<OrderManagementContextType | null>(null)

export default function OrderManagementProvider({ children }: { children: ReactNode }) {
  // TODO: Replace with real API hooks from @gearment/nextapi
  const orders = MOCK_DATA
  const loading = false

  return (
    <OrderManagementContext.Provider value={{ orders, loading, total: orders.length }}>
      {children}
    </OrderManagementContext.Provider>
  )
}

export function useOrderManagementContext() {
  const ctx = useContext(OrderManagementContext)
  if (!ctx) throw new Error("useOrderManagementContext must be used within OrderManagementProvider")
  return ctx
}`,
        type: "create",
      },
    ],
    previewHtml: `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 p-8">
  <div class="max-w-7xl mx-auto space-y-4">
    <div class="bg-white rounded-lg p-4">
      <h1 class="text-2xl font-bold">Order Management</h1>
    </div>
    <div class="bg-white rounded-lg p-4">
      <input type="text" placeholder="Search orders..." class="w-full max-w-sm px-4 py-2 border rounded-lg" />
    </div>
    <div class="bg-white rounded-lg p-4">
      <table class="w-full">
        <thead>
          <tr class="border-b">
            <th class="text-left py-2">Order ID</th>
            <th class="text-left py-2">Customer</th>
            <th class="text-left py-2">Status</th>
            <th class="text-right py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b">
            <td class="py-2">ORD-001</td>
            <td class="py-2">John Smith</td>
            <td class="py-2"><span class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Pending</span></td>
            <td class="text-right py-2">$125.50</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>`,
    explanation:
      "Complete order management prototype with table, filters, and mock data",
  },
]

interface PrototypeDetailContextType {
  prototype: PrototypeType | null
  loading: boolean
}

const PrototypeDetailContext = createContext<PrototypeDetailContextType | null>(
  null,
)

export default function PrototypeDetailProvider({
  children,
}: {
  children: ReactNode
}) {
  const params = useParams({ from: "/_authorize/prototyper/$prototypeId/" })

  // TODO: Replace with real API hook from @gearment/nextapi
  const prototype =
    MOCK_PROTOTYPES.find((p) => p.id === params.prototypeId) || null
  const loading = false

  return (
    <PrototypeDetailContext.Provider value={{ prototype, loading }}>
      {children}
    </PrototypeDetailContext.Provider>
  )
}

export function usePrototypeDetail() {
  const ctx = useContext(PrototypeDetailContext)
  if (!ctx)
    throw new Error(
      "usePrototypeDetail must be used within PrototypeDetailProvider",
    )
  return ctx
}
