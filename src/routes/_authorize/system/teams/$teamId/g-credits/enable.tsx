import LayoutTeam from "@/components/layout-team"
import { Button } from "@gearment/ui3"
import { createFileRoute, Link, useParams } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import EnableForm from "./-components/enable-form"

export const Route = createFileRoute(
  "/_authorize/system/teams/$teamId/g-credits/enable",
)({
  component: RouteComponent,
  staticData: {
    breadcrumb: [
      {
        name: "G-Credit",
        link: "/system/teams/$teamId/g-credits",
      },
      {
        name: "Enable",
        link: "/system/teams/$teamId/g-credits/enable",
      },
    ],
  },
})

function RouteComponent() {
  const params = useParams({
    from: "/_authorize/system/teams/$teamId/g-credits/enable",
  })
  const teamId = params.teamId
  return (
    <LayoutTeam>
      <Link
        to="/system/teams/$teamId/g-credits"
        params={{
          teamId,
        }}
        className="mb-4 flex items-center gap-2"
      >
        <Button size={"icon"} variant={"outline"}>
          <ArrowLeft />
        </Button>
      </Link>
      <EnableForm />
    </LayoutTeam>
  )
}
