import { UpdateTeamTierSearchSchema } from "@/schemas/schemas/global-configuration"
import { Button } from "@gearment/ui3"
import {
  createFileRoute,
  Link,
  stripSearchParams,
  useRouterState,
} from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { ArrowLeft } from "lucide-react"
import UpdateTeamTier from "./-components/update-team-tier"

export const Route = createFileRoute(
  "/_authorize/global-configuration/tier-management/update-team-tier",
)({
  component: RouteComponent,
  validateSearch: zodValidator(UpdateTeamTierSearchSchema),
  search: {
    middlewares: [stripSearchParams(UpdateTeamTierSearchSchema.parse({}))],
  },
  staticData: {
    breadcrumb: [
      {
        name: "Tier management",
        link: "/global-configuration/tier-management",
      },
      {
        name: "Update team tier(s)",
        link: "/global-configuration/tier-management/update-team-tier",
      },
    ],
  },
})

function RouteComponent() {
  const callbackHistory = useRouterState({
    select: (state) => state.location.state,
  })

  return (
    <div>
      <Link
        to={callbackHistory.href || "/global-configuration/tier-management"}
        className="mb-4 flex items-center gap-2"
      >
        <Button size={"icon"} variant={"outline"}>
          <ArrowLeft />
        </Button>
        Back to list
      </Link>
      <UpdateTeamTier />
    </div>
  )
}
