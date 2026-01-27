import { Team_Member } from "@/services/connect-rpc/types"
import TableTeamMembers from "./table-team-members"

interface Props {
  teamMembers: Team_Member[]
}

function TeamMembers({ teamMembers }: Props) {
  return <TableTeamMembers teamMembers={teamMembers} />
}

export default TeamMembers
