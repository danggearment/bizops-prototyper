import { AttributeLibrarySchema } from "@/schemas/schemas/attributes"
import { ModalAttributeValue } from "@/services/modals/modal-attribute-value"
import { PageHeader } from "@gearment/ui3"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { AttributeLibraryProvider } from "./-attribute-library-context"
import LibraryAnalytics from "./-components/library-analytics"
import LibraryFilter from "./-components/library-filter"
import LibraryTable from "./-components/table/library-table"

export const Route = createFileRoute(
  "/_authorize/product-management/attributes/library/",
)({
  staticData: {
    breadcrumb: [
      {
        name: "Product management",
        link: "/product-management",
      },
      {
        name: "Attributes library",
        link: "/product-management/attributes/library",
      },
    ],
  },
  validateSearch: zodValidator(AttributeLibrarySchema),
  search: {
    middlewares: [stripSearchParams(AttributeLibrarySchema.parse({}))],
  },
  component: () => (
    <AttributeLibraryProvider>
      <Index />
    </AttributeLibraryProvider>
  ),
})

function Index() {
  return (
    <>
      <PageHeader>
        <div>
          <PageHeader.Title>Attributes library</PageHeader.Title>
          <PageHeader.Description>
            Manage all attributes in the system
          </PageHeader.Description>
        </div>
      </PageHeader>
      <div className="space-y-4">
        <LibraryAnalytics />
        <LibraryFilter />
        <LibraryTable />
      </div>
      <ModalAttributeValue />
    </>
  )
}
