import { PageHeader } from "@gearment/ui3"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { PrototyperSearchSchema } from "@/schemas/schemas/prototyper"
import PrototyperProvider from "./-prototyper-context"
import Filter from "./-components/filter/filter"
import Table from "./-components/table/table"

export const Route = createFileRoute("/_authorize/prototyper/")({
  validateSearch: zodValidator(PrototyperSearchSchema),
  search: {
    middlewares: [stripSearchParams(PrototyperSearchSchema.parse({}))],
  },
  component: () => (
    <PrototyperProvider>
      <Index />
    </PrototyperProvider>
  ),
  beforeLoad: () => ({
    breadcrumb: [{ link: "/prototyper", name: "Prototyper" }],
  }),
})

function Index() {
  return (
    <>
      <PageHeader>
        <PageHeader.Title>Prototyper</PageHeader.Title>
      </PageHeader>
      <div className="space-y-4">
        <Filter />
        <Table />
      </div>
    </>
  )
}
