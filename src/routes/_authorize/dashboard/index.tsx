import OrderChart from "@/routes/_authorize/dashboard/-component/order-chart/order-chart"
import OrderSummary from "@/routes/_authorize/dashboard/-component/order-summary/order-summary"
import { AreaChartSearchSchema } from "@/schemas/schemas/area-chart"
import { PageHeader } from "@gearment/ui3"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"

export const Route = createFileRoute("/_authorize/dashboard/")({
  validateSearch: zodValidator(AreaChartSearchSchema),
  search: {
    middlewares: [stripSearchParams(AreaChartSearchSchema.parse({}))],
  },
  beforeLoad: () => {
    return {
      breadcrumbs: [
        {
          text: "Homepage",
          link: "/dashboard",
        },
      ],
    }
  },
  component: Index,
})

function Index() {
  return (
    <>
      <PageHeader>
        <PageHeader.Title>Homepage</PageHeader.Title>
      </PageHeader>
      <OrderSummary />
      <OrderChart />
    </>
  )
}
