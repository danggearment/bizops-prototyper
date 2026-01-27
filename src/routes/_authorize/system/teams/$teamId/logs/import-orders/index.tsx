import LayoutTeam from "@/components/layout-team/"
import { LogsImportOrdersSearchSchema } from "@/schemas/schemas/logs-import-orders"
import { PageHeader } from "@gearment/ui3"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import TableImportOrders from "./-components/table"

export const Route = createFileRoute(
  "/_authorize/system/teams/$teamId/logs/import-orders/",
)({
  validateSearch: zodValidator(LogsImportOrdersSearchSchema),
  search: {
    middlewares: [stripSearchParams(LogsImportOrdersSearchSchema.parse({}))],
  },
  component: RouteComponent,
  staticData: {
    breadcrumb: [
      {
        name: "System",
        link: "#",
      },
      {
        name: "Teams",
        link: "#",
      },
      {
        name: "Import orders",
        link: "/system/teams/$teamId/logs/import-orders/",
      },
    ],
  },
})

function RouteComponent() {
  return (
    <LayoutTeam>
      <PageHeader>
        <PageHeader.Title>Import orders</PageHeader.Title>
      </PageHeader>

      <TableImportOrders />
    </LayoutTeam>
  )
}
