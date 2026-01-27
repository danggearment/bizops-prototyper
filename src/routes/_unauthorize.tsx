import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"
import makeRequest from "@/api/axios"

const completeInvite = async (teamId: string) => {
  return makeRequest.post(
    `/api.iam.v1.TeamAPI/UserCompleteTeamMember`,
    {
      teamId,
    },
    {},
  )
}

export const Route = createFileRoute("/_unauthorize")({
  beforeLoad: async ({ context, location }) => {
    try {
      if (location.pathname === "/complete-invite") {
        const { teamId }: any = location.search
        await completeInvite(teamId)
      }
      if (context.auth.user) {
        throw redirect({
          to: "/",
        })
      }
    } catch (error) {
      if (context.auth.user) {
        throw redirect({
          to: "/",
        })
      }
    }
  },
  component: Index,
})

function Index() {
  return <Outlet />
}
