import { SellerPricingSearchSchema } from "@/schemas/schemas/seller-pricing"
import { PageHeader } from "@gearment/ui3"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import FilterSellerPricing from "./-components/filter/filter"
import SummaryCards from "./-components/summary-cards/summary-cards"
import TableSellerPricing from "./-components/table/table"
import { SellerPricingProvider } from "./-seller-pricing-context"

export const Route = createFileRoute(
  "/_authorize/global-configuration/seller-pricing-engine/",
)({
  staticData: {
    breadcrumb: [
      {
        name: "Seller Pricing Engine",
        link: "/global-configuration/seller-pricing-engine",
      },
    ],
  },
  component: () => (
    <SellerPricingProvider>
      <Index />
    </SellerPricingProvider>
  ),
  validateSearch: zodValidator(SellerPricingSearchSchema),
  search: {
    middlewares: [stripSearchParams(SellerPricingSearchSchema.parse({}))],
  },
})

function Index() {
  return (
    <>
      <PageHeader>
        <div>
          <PageHeader.Title>Seller Pricing Engine</PageHeader.Title>
          <PageHeader.Description>
            Manage RSP-based pricing and tier discounts for products and
            variants.
          </PageHeader.Description>
        </div>
      </PageHeader>

      <SummaryCards />
      <FilterSellerPricing />
      <TableSellerPricing />
    </>
  )
}
