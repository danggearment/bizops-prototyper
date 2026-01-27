import { ProductSearchSchema } from "@/schemas/schemas/product"
import ModalViewProductVariants from "@/services/modals/modal-view-product-variants/modal-view-product-variants"
import { PageHeader } from "@gearment/ui3"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import ProductAnalytics from "./-components/product-analytics"
import ProductFilter from "./-components/product-filter"
import ProductTable from "./-components/product-table/table"
import { ProductManagementProvider } from "./-product-management-context"

export const Route = createFileRoute(
  "/_authorize/product-management/products/",
)({
  staticData: {
    breadcrumb: [
      {
        name: "Product management",
        link: "/product-management",
      },
      {
        name: "Products",
        link: "/product-management/products",
      },
    ],
  },
  validateSearch: zodValidator(ProductSearchSchema),
  search: {
    middlewares: [stripSearchParams(ProductSearchSchema.parse({}))],
  },
  component: () => (
    <ProductManagementProvider>
      <Index />
    </ProductManagementProvider>
  ),
})

function Index() {
  return (
    <>
      <PageHeader>
        <div className="flex flex-col space-y-2">
          <PageHeader.Title>Products management</PageHeader.Title>
          <PageHeader.Description>
            Manage products, variants.
          </PageHeader.Description>
        </div>
      </PageHeader>
      <div className="space-y-4">
        <ProductAnalytics />
        <div>
          <ProductFilter />
          <ProductTable />
        </div>
      </div>
      <ModalViewProductVariants />
    </>
  )
}
