import { ExportTransactionsSchema } from "@/schemas/schemas/export-transactions"
import { PageHeader } from "@gearment/ui3"
import { createFileRoute } from "@tanstack/react-router"
import Filter from "./-components/filter/filter"
import Table from "./-components/table/table"
import ExportTransactionsProvider from "./-export-transactions-context"

export const Route = createFileRoute("/_authorize/logs/export-transactions/")({
  component: RouteComponent,
  validateSearch: (search) => ExportTransactionsSchema.parse(search),
})

function RouteComponent() {
  return (
    <ExportTransactionsProvider>
      <PageHeader>
        <PageHeader.Title>Export transactions</PageHeader.Title>
      </PageHeader>
      <Filter />
      <Table />
    </ExportTransactionsProvider>
  )
}
