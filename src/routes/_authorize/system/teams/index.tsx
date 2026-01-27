import { TeamSearchSchema } from "@/schemas/schemas/team.ts"
import { Button, PageHeader } from "@gearment/ui3"
import {
  createFileRoute,
  Link,
  stripSearchParams,
  useLocation,
} from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { ArrowLeftIcon, PlusIcon } from "lucide-react"
import TableTeam from "./-component/table-team/table-team"

export const Route = createFileRoute("/_authorize/system/teams/")({
  validateSearch: zodValidator(TeamSearchSchema),
  search: {
    middlewares: [stripSearchParams(TeamSearchSchema.parse({}))],
  },
  beforeLoad: () => ({
    breadcrumb: [
      {
        link: "#",
        name: "System",
        search: undefined,
      },
      {
        link: "/system/teams",
        name: "Teams",
        search: undefined,
      },
    ],
  }),
  component: Index,
})

function Index() {
  const location = useLocation()

  const hasTierManagementState = location.state?.href?.includes(
    "/global-configuration/tier-management",
  )

  return (
    <>
      <div className="space-y-2">
        {hasTierManagementState && (
          <Link
            to={location.state.href}
            className={
              "flex items-center gap-2  hover:text-secondary-foreground"
            }
          >
            <Button variant="outline" size="icon">
              <ArrowLeftIcon size={20} />
            </Button>
            <span>Back to Tier Management</span>
          </Link>
        )}
      </div>
      <PageHeader>
        <PageHeader.Title>Team list</PageHeader.Title>
        <PageHeader.Action>
          <Button className="gap-2">
            <PlusIcon />
            Add new team
          </Button>
        </PageHeader.Action>
      </PageHeader>

      <TableTeam />
    </>
  )
}
