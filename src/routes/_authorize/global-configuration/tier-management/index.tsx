import { TierManagementSearchSchema } from "@/schemas/schemas/global-configuration"
import { Button, PageHeader } from "@gearment/ui3"
import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { Plus, ScrollText, SettingsIcon } from "lucide-react"
import PriceTier from "./-components/price-tier/price-tier"
import { PriceTierProvider } from "./-components/price-tier/price-tier-context"
import { TierAnalytics } from "./-components/tier-analytics"

export const Route = createFileRoute(
  "/_authorize/global-configuration/tier-management/",
)({
  component: () => (
    <PriceTierProvider>
      <Index />
    </PriceTierProvider>
  ),
  validateSearch: zodValidator(TierManagementSearchSchema),
  search: {
    middlewares: [stripSearchParams(TierManagementSearchSchema.parse({}))],
  },
  staticData: {
    breadcrumb: [
      {
        name: "Global configuration",
        link: "#",
      },
      {
        name: "Tier management",
        link: "/global-configuration/tier-management",
      },
    ],
  },
})

function Index() {
  const navigate = useNavigate({
    from: "/global-configuration/tier-management",
  })
  return (
    <>
      <PageHeader>
        <div>
          <PageHeader.Title>Tier management</PageHeader.Title>
          <PageHeader.Description>
            Manage pricing tiers and team assignments for FBM and FBA
            fulfillments
          </PageHeader.Description>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
              navigate({
                to: "/system/teams",
              })
            }}
          >
            <SettingsIcon />
            Manage teams
          </Button>

          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
              navigate({
                to: "/global-configuration/tier-management/tier-update-logs",
              })
            }}
          >
            <ScrollText />
            View tier update logs
          </Button>

          <Button
            className="cursor-pointer"
            onClick={() => {
              navigate({
                to: "/global-configuration/tier-management/update-team-tier",
              })
            }}
          >
            <Plus />
            Update team tier(s)
          </Button>
        </div>
      </PageHeader>
      <TierAnalytics />
      <PriceTier />
    </>
  )
}
