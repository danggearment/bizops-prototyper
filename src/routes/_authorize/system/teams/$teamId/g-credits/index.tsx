import { createFileRoute } from "@tanstack/react-router"
import GCreditsEnable from "./-components/g-credits-enable"
import LayoutTeam from "@/components/layout-team"

export const Route = createFileRoute(
  "/_authorize/system/teams/$teamId/g-credits/",
)({
  component: RouteComponent,
  staticData: {
    breadcrumb: [
      {
        name: "System",
        link: "#",
      },
      {
        name: "Teams",
        link: "/system/teams",
      },
      {
        name: "G-Credits",
        link: "/system/teams/$teamId/g-credits",
      },
    ],
  },
})

function RouteComponent() {
  return (
    <LayoutTeam>
      <GCreditsEnable />
    </LayoutTeam>
  )
}
