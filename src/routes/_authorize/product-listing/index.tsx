import { PageHeader } from "@gearment/ui3"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { ProductListingSearchSchema } from "@/schemas/schemas/product-listing"
import ProductListingProvider from "./-product-listing-context"
import ProductFilter from "./-components/filter/filter"
import Table from "./-components/table/table"

export const Route = createFileRoute("/_authorize/product-listing/")({
  validateSearch: zodValidator(ProductListingSearchSchema),
  search: {
    middlewares: [stripSearchParams(ProductListingSearchSchema.parse({}))],
  },
  component: () => (
    <ProductListingProvider>
      <Index />
    </ProductListingProvider>
  ),
  beforeLoad: () => ({
    breadcrumb: [{ link: "/product-listing", name: "Product Listing" }],
  }),
})

function Index() {
  return (
    <>
      <PageHeader>
        <PageHeader.Title>Product Listing</PageHeader.Title>
      </PageHeader>
      <div className="space-y-4">
        <ProductFilter />
        <Table />
      </div>
    </>
  )
}