import { PaymentLogsSearchSchema } from "@/schemas/schemas/payment-logs"
import { PageHeader } from "@gearment/ui3"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import Export from "./-components/export/export"
import Filter from "./-components/filter"
import Table from "./-components/table/table"

export const Route = createFileRoute("/_authorize/logs/payment-logs/")({
  validateSearch: zodValidator(PaymentLogsSearchSchema),
  search: {
    middlewares: [stripSearchParams(PaymentLogsSearchSchema.parse({}))],
  },
  component: RouteComponent,
  staticData: {
    breadcrumb: [
      {
        name: "Logs",
        link: "#",
      },
      {
        name: "Payment logs",
        link: "/logs/payment-logs",
      },
    ],
  },
})

function RouteComponent() {
  return (
    <div>
      <PageHeader>
        <PageHeader.Title>Payment logs</PageHeader.Title>
        <PageHeader.Action>
          <Export />
        </PageHeader.Action>
      </PageHeader>
      <Filter />
      <Table />
    </div>
  )
}
