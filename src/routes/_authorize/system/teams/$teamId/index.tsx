import { createFileRoute, Outlet } from "@tanstack/react-router"
import LayoutTeam from "@/components/layout-team"

export const Route = createFileRoute("/_authorize/system/teams/$teamId/")({
  component: Index,
})

function Index() {
  return (
    <LayoutTeam>
      <Outlet />
    </LayoutTeam>
  )
}
