import { useMutationIam } from "@/services/connect-rpc/transport"
import { staffGetTeamDetail } from "@gearment/nextapi/api/iam/v1/user_admin-UserAccountAdminAPI_connectquery"

export const useTeamDetailMutation = () => {
  const mutation = useMutationIam(staffGetTeamDetail)
  return mutation
}
