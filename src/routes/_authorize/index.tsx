import { AreaChartSearchSchema } from "@/schemas/schemas/area-chart"
import { PageHeader } from "@gearment/ui3"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_authorize/")({
  beforeLoad: () => {
    return redirect({
      to: "/dashboard",
      search: AreaChartSearchSchema.parse({}),
    })
  },
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <PageHeader>
      <PageHeader.Title>Welcome to Dashboard</PageHeader.Title>
    </PageHeader>
  )
}
