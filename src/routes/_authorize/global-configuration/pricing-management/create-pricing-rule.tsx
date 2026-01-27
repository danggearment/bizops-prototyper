import { Button } from "@gearment/ui3"
import { createFileRoute, Link, useRouterState } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import FormCreatePricingRule from "./-components/form-create/form-create-pricing-rule"
import { PricingRuleProvider } from "./-pricing-rule-context"

export const Route = createFileRoute(
  "/_authorize/global-configuration/pricing-management/create-pricing-rule",
)({
  component: () => (
    <PricingRuleProvider>
      <Index />
    </PricingRuleProvider>
  ),
  staticData: {
    breadcrumb: [
      {
        name: "Pricing management",
        link: "/global-configuration/pricing-management",
      },
      {
        name: "Create pricing rule",
        link: "/global-configuration/pricing-management/create-pricing-rule",
      },
    ],
  },
})

function Index() {
  const callbackHistory = useRouterState({
    select: (state) => state.location.state,
  })

  return (
    <div className="pb-6">
      <Link
        to={callbackHistory.href || "/global-configuration/pricing-management"}
        className="mb-4 flex items-center gap-2"
      >
        <Button size={"icon"} variant={"outline"}>
          <ArrowLeft />
        </Button>
        <div>
          <h3 className="heading-3">Create pricing rule</h3>
          <p className="text-sm">Set up a new customized pricing rule</p>
        </div>
      </Link>
      <FormCreatePricingRule
        defaultValues={{
          teamId: "",
          dateRange: {
            from: undefined as unknown as Date,
            to: undefined as unknown as Date,
          },
          internalNote: "",
          customPriceId: undefined,
        }}
      />
    </div>
  )
}
