import { UpdateTeamTierLogsSearchSchema } from "@/schemas/schemas/global-configuration"
import { Button } from "@gearment/ui3"
import {
  createFileRoute,
  Link,
  stripSearchParams,
} from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { ArrowLeft } from "lucide-react"
import { UpdateTeamTierLog } from "./-components/logs/update-team-tier-log"

export const Route = createFileRoute(
  "/_authorize/global-configuration/tier-management/tier-update-logs",
)({
  component: RouteComponent,
  validateSearch: zodValidator(UpdateTeamTierLogsSearchSchema),
  search: {
    middlewares: [stripSearchParams(UpdateTeamTierLogsSearchSchema.parse({}))],
  },
  staticData: {
    breadcrumb: [
      {
        name: "Tier Management",
        link: "/global-configuration/tier-management",
      },
      {
        name: "Update Team Tier(s)",
        link: "/global-configuration/tier-management/tier-update-logs",
      },
    ],
  },
})

function RouteComponent() {
  return (
    <div>
      <Link
        to="/global-configuration/tier-management"
        className="mb-4 flex items-center gap-2"
      >
        <Button size={"icon"} variant={"outline"}>
          <ArrowLeft />
        </Button>
        Back to list
      </Link>
      <UpdateTeamTierLog />
    </div>
  )
}
