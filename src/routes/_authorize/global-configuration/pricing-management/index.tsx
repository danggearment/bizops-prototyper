import { ListPricingRuleSchema } from "@/schemas/schemas/pricing"
import { Button, PageHeader } from "@gearment/ui3"
import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { Plus } from "lucide-react"
import FilterPricingRule from "./-components/filter/filter"
import TablePricingRule from "./-components/table/table"
import PriceCustomTabs from "./-components/tabs/tabs"
import { PricingRuleProvider } from "./-pricing-rule-context"

export const Route = createFileRoute(
  "/_authorize/global-configuration/pricing-management/",
)({
  staticData: {
    breadcrumb: [
      {
        name: "Pricing management",
        link: "/global-configuration/pricing-management",
      },
    ],
  },
  component: () => (
    <PricingRuleProvider>
      <Index />
    </PricingRuleProvider>
  ),
  validateSearch: zodValidator(ListPricingRuleSchema),
  search: {
    middlewares: [stripSearchParams(ListPricingRuleSchema.parse({}))],
  },
})

function Index() {
  const navigate = useNavigate({
    from: "/global-configuration/pricing-management",
  })

  return (
    <>
      <PageHeader>
        <div>
          <PageHeader.Title>Customized pricing</PageHeader.Title>
          <PageHeader.Description>
            Manage team-specific pricing rules
          </PageHeader.Description>
        </div>
        <div className="space-x-2">
          <Button
            className="cursor-pointer"
            onClick={() =>
              navigate({
                to: "/global-configuration/pricing-management/create-pricing-rule",
              })
            }
          >
            <Plus />
            Create new rule
          </Button>
        </div>
      </PageHeader>
      <FilterPricingRule />
      <PriceCustomTabs>
        <TablePricingRule />
      </PriceCustomTabs>
    </>
  )
}
