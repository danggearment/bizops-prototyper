import { AttributeLibraryDetailSchema } from "@/schemas/schemas/attributes"
import { ModalAttributeValue } from "@/services/modals/modal-attribute-value"
import { Button } from "@gearment/ui3"
import {
  createFileRoute,
  Link,
  stripSearchParams,
  useRouterState,
} from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { ArrowLeftIcon } from "lucide-react"
import { AttributeLibraryDetailProvider } from "./-attribute-library-detail-context"
import { LibraryHeaderActions } from "./-component/header-actions"
import { LibraryInformation } from "./-component/library-information"
import { ProductUsedLibrary } from "./-component/product-used-library"

export const Route = createFileRoute(
  "/_authorize/product-management/attributes/library/$libraryId/",
)({
  beforeLoad: async ({ params: { libraryId } }) => {
    return {
      breadcrumb: [
        {
          name: "Product management",
          link: "/product-management",
        },
        {
          name: "Attributes library",
          link: "/product-management/attributes/library",
        },
        {
          name: libraryId,
          link: "/product-management/attributes/library/$libraryId",
        },
      ],
    }
  },
  validateSearch: zodValidator(AttributeLibraryDetailSchema),
  search: {
    middlewares: [stripSearchParams(AttributeLibraryDetailSchema.parse({}))],
  },
  component: () => (
    <AttributeLibraryDetailProvider>
      <Index />
    </AttributeLibraryDetailProvider>
  ),
})

function Index() {
  const callbackHistory = useRouterState({
    select: (state) => state.location.state,
  })

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="body-small mb-4">
          <Link
            to={
              callbackHistory.href || "/product-management/attributes/library"
            }
            className="inline-flex items-center gap-2"
          >
            <Button variant="outline" size="icon" className="p-0">
              <ArrowLeftIcon size={14} />
            </Button>
            <span>Back to attributes library</span>
          </Link>
        </div>
        <LibraryHeaderActions />
      </div>
      <div className="space-y-4">
        <LibraryInformation />
        <ProductUsedLibrary />
      </div>
      <ModalAttributeValue />
    </>
  )
}
