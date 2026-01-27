import { ProductVariantsSearchSchema } from "@/schemas/schemas/product"
import { PageHeader } from "@gearment/ui3"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import VariantAnalytics from "./-components/variant-analytics"
import VariantFilter from "./-components/variant-filter"
import VariantTable from "./-components/variant-table/table"
import { VariantManagementProvider } from "./-variant-management-context"

export const Route = createFileRoute(
  "/_authorize/product-management/variants/",
)({
  component: () => (
    <VariantManagementProvider>
      <Index />
    </VariantManagementProvider>
  ),
  staticData: {
    breadcrumb: [
      {
        name: "Product management",
        link: "/product-management",
      },
      {
        name: "Variants",
        link: "/product-management/variants",
      },
    ],
  },
  validateSearch: zodValidator(ProductVariantsSearchSchema),
  search: {
    middlewares: [stripSearchParams(ProductVariantsSearchSchema.parse({}))],
  },
})

function Index() {
  return (
    <>
      <PageHeader>
        <div className="flex flex-col space-y-2">
          <PageHeader.Title>Variant management</PageHeader.Title>
          <PageHeader.Description>
            Manage all product variants, pricing, and inventory across your
            catalog.
          </PageHeader.Description>
        </div>
      </PageHeader>
      <div className="space-y-4">
        <VariantAnalytics />
        <div>
          <VariantFilter />
          <VariantTable />
        </div>
      </div>
      {/* <ModalViewProductVariants /> */}
    </>
  )
}
