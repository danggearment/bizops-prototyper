import { ButtonIconCopy } from "@gearment/ui3"
import { Link } from "@tanstack/react-router"

interface Props {
  teamId: string
  teamName: string
  customId: string
}

export default function CellTeam({ teamId, teamName, customId }: Props) {
  return (
    <div>
      <p className="font-semibold">{teamName}</p>
      <div className="flex space-x-1">
        <Link
          className="body-extra-small"
          to="/global-configuration/pricing-management/$customId"
          params={{ customId }}
        >
          {customId}
        </Link>
        <ButtonIconCopy copyValue={teamId} size="sm" />
      </div>
    </div>
  )
}
