import TableOtherTeams from "./table-other-teams"
import { StaffGetTeamDetailResponse_OtherTeam } from "@/services/connect-rpc/types"

interface Props {
  otherTeams: StaffGetTeamDetailResponse_OtherTeam[]
}

function OtherTeams({ otherTeams }: Props) {
  return <TableOtherTeams otherTeams={otherTeams} />
}

export default OtherTeams
