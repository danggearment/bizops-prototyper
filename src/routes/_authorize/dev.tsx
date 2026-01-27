import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_authorize/dev")({
  beforeLoad: async () => {
    const dev = localStorage.getItem("dev")
    if (!dev) {
      throw redirect({
        to: "/dashboard",
      })
    }
  },
  component: RouteComponent,
})
function RouteComponent() {
  return <Outlet />
}
