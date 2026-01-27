import { AllOrderSearchOrdersSchema } from "@/schemas/schemas/all-orders"
import { PageHeader } from "@gearment/ui3"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import AllOrdersProvider from "./-all-orders-context"
import InputSearchAllOrders from "./-components/search-orders"
import Table from "./-components/table/table"

export const Route = createFileRoute("/_authorize/order/all-orders/")({
  validateSearch: zodValidator(AllOrderSearchOrdersSchema),
  search: {
    middlewares: [stripSearchParams(AllOrderSearchOrdersSchema.parse({}))],
  },
  component: () => (
    <AllOrdersProvider>
      <Index />
    </AllOrdersProvider>
  ),
  beforeLoad: () => ({
    breadcrumb: [
      {
        link: "/orders/all",
        name: "All orders",
        search: AllOrderSearchOrdersSchema.parse({}),
      },
    ],
  }),
})

function Index() {
  return (
    <>
      <PageHeader>
        <PageHeader.Title>All orders</PageHeader.Title>
      </PageHeader>

      <div className="space-y-4">
        <InputSearchAllOrders />
        <Table />
      </div>
    </>
  )
}
