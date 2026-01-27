import { PrintTypeSearchSchema } from "@/schemas/schemas/prints"
import { Button, PageHeader } from "@gearment/ui3"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { PlusIcon } from "lucide-react"
import { TypeAnalytics } from "./-components/type-analytics"
import { TypeFilter } from "./-components/type-filter"
import { TypeTable } from "./-components/type-table/type-table"
import { PrintTypeProvider } from "./-print-type-context"

export const Route = createFileRoute(
  "/_authorize/product-management/prints/type/",
)({
  staticData: {
    breadcrumb: [
      {
        name: "Product management",
        link: "/product-management",
      },
      {
        name: "Print type",
        link: "/product-management/prints/type",
      },
    ],
  },
  validateSearch: zodValidator(PrintTypeSearchSchema),
  search: {
    middlewares: [stripSearchParams(PrintTypeSearchSchema.parse({}))],
  },
  component: () => (
    <PrintTypeProvider>
      <Index />
    </PrintTypeProvider>
  ),
})

function Index() {
  return (
    <>
      <PageHeader>
        <div>
          <PageHeader.Title>Print type management</PageHeader.Title>
          <PageHeader.Description>
            Manage print types and their technical specifications
          </PageHeader.Description>
        </div>
        <PageHeader.Action>
          <Button className="cursor-pointer w-40">
            <PlusIcon /> Add print type
          </Button>
        </PageHeader.Action>
      </PageHeader>
      <div className="mb-4">
        <TypeAnalytics />
      </div>
      <TypeFilter />
      <TypeTable />
    </>
  )
}
