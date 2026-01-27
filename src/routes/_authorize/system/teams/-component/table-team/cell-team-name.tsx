import StatusIndicator from "@/components/common/status-indicator"
import { Team_Detail } from "@/services/connect-rpc/types"
import { ButtonIconCopy, cn } from "@gearment/ui3"
import { Link, useLocation } from "@tanstack/react-router"
import { CellContext } from "@tanstack/react-table"
import { ZapIcon } from "lucide-react"
import { ReactNode } from "react"

interface Props extends CellContext<Team_Detail, any> {
  children?: ReactNode
}

export default function CellTeamName(props: Props) {
  const { children } = props
  const isRushOrder = props.row.original.isRushOrder
  const teamId = props.row.original.teamId
  const teamName = props.row.original.teamName
  const location = useLocation()

  return (
    <div>
      <div className="flex items-center gap-2">
        <Link
          to="/system/teams/$teamId/details"
          params={{ teamId: teamId }}
          state={{
            ...location,
          }}
          className="text-base flex gap-1 items-center"
        >
          <span id={teamId} className="whitespace-nowrap hover:text-primary">
            {teamName}
          </span>
        </Link>
        {isRushOrder && (
          <StatusIndicator
            isVerified={isRushOrder}
            icon={
              <ZapIcon
                size={14}
                className={cn(
                  isRushOrder
                    ? "fill-orange-600 stroke-orange-600"
                    : "stroke-gray-500",
                )}
              />
            }
            verifiedText="Rush team"
            unverifiedText="Normal team"
          />
        )}
      </div>
      <div className={"body-sm flex items-center gap-1 text-foreground/50"}>
        <span>{teamId}</span>
        <ButtonIconCopy copyValue={teamId} size="sm" />
      </div>
      {children}
    </div>
  )
}
