import { useQueryIam } from "@/services/connect-rpc/transport"
import { staffGetTeamDetail } from "@gearment/nextapi/api/iam/v1/user_admin-UserAccountAdminAPI_connectquery"

export const useTeamDetailQuery = ({ teamId }: { teamId: string }) => {
  const { data } = useQueryIam(
    staffGetTeamDetail,
    {
      teamId: teamId,
    },
    {
      enabled: !!teamId,
    },
  )
  return data
}
