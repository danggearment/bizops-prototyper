import { PrintLocationSearchSchema } from "@/schemas/schemas/prints"
import { Button, PageHeader } from "@gearment/ui3"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { LayersIcon, PlusIcon } from "lucide-react"
import { LocationAnalytics } from "./-components/location-analytics"
import { LocationFilter } from "./-components/location-filter"
import { LocationTable } from "./-components/location-table/location-table"
import { PrintLocationProvider } from "./-print-location-context"

export const Route = createFileRoute(
  "/_authorize/product-management/prints/location/",
)({
  staticData: {
    breadcrumb: [
      {
        name: "Product management",
        link: "/product-management",
      },
      {
        name: "Print location",
        link: "/product-management/prints/location",
      },
    ],
  },
  validateSearch: zodValidator(PrintLocationSearchSchema),
  search: {
    middlewares: [stripSearchParams(PrintLocationSearchSchema.parse({}))],
  },
  component: () => (
    <PrintLocationProvider>
      <Index />
    </PrintLocationProvider>
  ),
})

function Index() {
  return (
    <>
      <PageHeader>
        <div>
          <PageHeader.Title>Print location management</PageHeader.Title>
          <PageHeader.Description>
            Configure print locations, technologies, and product assignments
          </PageHeader.Description>
        </div>
        <PageHeader.Action>
          <Button className="cursor-pointer w-40" variant="outline">
            <LayersIcon /> Templates
          </Button>
          <Button className="cursor-pointer w-40">
            <PlusIcon /> Add location
          </Button>
        </PageHeader.Action>
      </PageHeader>
      <div className="mb-4">
        <LocationAnalytics />
      </div>
      <LocationFilter />
      <LocationTable />
    </>
  )
}
