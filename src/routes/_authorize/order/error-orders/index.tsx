import { AllOrderSearchSchema } from "@/schemas/schemas/all-orders.ts"
import { PageHeader } from "@gearment/ui3"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import AllOrdersProvider from "./-all-orders-context.tsx"
import Filter from "./-component/filter/filter.tsx"
import TableAllOrder from "./-component/table/table.tsx"

export const Route = createFileRoute("/_authorize/order/error-orders/")({
  validateSearch: zodValidator(AllOrderSearchSchema),
  search: {
    middlewares: [stripSearchParams(AllOrderSearchSchema.parse({}))],
  },
  beforeLoad: () => ({
    breadcrumb: [
      {
        link: "#",
        name: "Error orders",
        search: undefined,
      },
    ],
  }),
  component: () => (
    <AllOrdersProvider>
      <Index />
    </AllOrdersProvider>
  ),
})

function Index() {
  return (
    <>
      <PageHeader>
        <PageHeader.Title>Error orders</PageHeader.Title>
      </PageHeader>
      <Filter />
      <TableAllOrder />
    </>
  )
}
