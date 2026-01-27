import { PrintTypeDetailSearchSchema } from "@/schemas/schemas/prints"
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
import { ProductUsedPrintType } from "./-components/product-used-print-type"
import { TypeInformation } from "./-components/type-information"
import { PrintTypeDetailProvider } from "./-print-type-detail-context"

export const Route = createFileRoute(
  "/_authorize/product-management/prints/type/$typeId/",
)({
  beforeLoad: async ({ params: { typeId } }) => {
    return {
      breadcrumb: [
        {
          name: "Product management",
          link: "/product-management",
        },
        {
          name: "Print type",
          link: "/product-management/prints/type",
        },
        {
          name: typeId,
          link: "/product-management/prints/type/$typeId",
        },
      ],
    }
  },
  validateSearch: zodValidator(PrintTypeDetailSearchSchema),
  search: {
    middlewares: [stripSearchParams(PrintTypeDetailSearchSchema.parse({}))],
  },
  component: () => (
    <PrintTypeDetailProvider>
      <Index />
    </PrintTypeDetailProvider>
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
              to={callbackHistory.href || "/product-management/prints/type"}
              className="inline-flex items-center gap-2"
            >
              <Button variant="outline" size="icon" className="p-0">
                <ArrowLeftIcon size={14} />
              </Button>
            </Link>
            <div>
              <PageHeader.Title>Print type details</PageHeader.Title>
              <PageHeader.Description>
                View and manage print type information
              </PageHeader.Description>
            </div>
          </div>
          <HeaderActions />
        </div>
      </PageHeader>
      <div className="space-y-4 mb-4">
        <TypeInformation />
        <ProductUsedPrintType />
      </div>
    </>
  )
}
