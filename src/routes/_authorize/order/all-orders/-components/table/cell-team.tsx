import CellTeam from "@/components/common/cell-team/cell-team"
import { AllOrder_Message } from "@/services/connect-rpc/types"
import { Row } from "@tanstack/react-table"

interface Props {
  row: Row<AllOrder_Message>
}
export default function CellTeamComponent({ row }: Props) {
  const { teamId, teamName, ownerEmail } = row.original
  return (
    <div className="space-y-1">
      <CellTeam
        teamId={teamId}
        teamName={teamName}
        teamOwnerEmail={ownerEmail}
      />
      {/* TODO: Add created after merge backend */}
      {/* {createdBy && (
        <div className="">
          Created by:{" "}
          <Link to={"/system/teams"} params={{ teamId: createdBy.userId }}>
            {createdBy.userId || "--"}
          </Link>
        </div>
      )} */}
    </div>
  )
}
