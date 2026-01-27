import { PrintLocationDetailSearchSchema } from "@/schemas/schemas/prints"
import { Button, PageHeader } from "@gearment/ui3"
import {
  createFileRoute,
  Link,
  stripSearchParams,
  useRouterState,
} from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { ArrowLeftIcon } from "lucide-react"
import { HeaderActions } from "./-components/header-actions"
import { LocationInformation } from "./-components/location-information"
import { ProductUsedPrintLocation } from "./-components/product-used-print-location"
import { PrintLocationDetailProvider } from "./-print-location-detail-context"

export const Route = createFileRoute(
  "/_authorize/product-management/prints/location/$locationId/",
)({
  beforeLoad: async ({ params: { locationId } }) => {
    return {
      breadcrumb: [
        {
          name: "Product management",
          link: "/product-management",
        },
        {
          name: "Print location",
          link: "/product-management/prints/location",
        },
        {
          name: locationId,
          link: "/product-management/prints/location/$locationId",
        },
      ],
    }
  },
  validateSearch: zodValidator(PrintLocationDetailSearchSchema),
  search: {
    middlewares: [stripSearchParams(PrintLocationDetailSearchSchema.parse({}))],
  },
  component: () => (
    <PrintLocationDetailProvider>
      <Index />
    </PrintLocationDetailProvider>
  ),
})

function Index() {
  const callbackHistory = useRouterState({
    select: (state) => state.location.state,
  })

  return (
    <>
      <PageHeader>
        <div className="flex items-center justify-between w-full gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Link
              to={callbackHistory.href || "/product-management/prints/location"}
              className="inline-flex items-center gap-2"
            >
              <Button variant="outline" size="icon" className="p-0">
                <ArrowLeftIcon size={14} />
              </Button>
            </Link>
            <div>
              <PageHeader.Title>Print location details</PageHeader.Title>
              <PageHeader.Description>
                View and manage print location information
              </PageHeader.Description>
            </div>
          </div>
          <HeaderActions />
        </div>
      </PageHeader>
      <div className="space-y-4 mb-4">
        <LocationInformation />
        <ProductUsedPrintLocation />
      </div>
    </>
  )
}
