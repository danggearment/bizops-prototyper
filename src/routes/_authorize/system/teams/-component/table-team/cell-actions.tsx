import { UpdateTeamTierSearchSchema } from "@/schemas/schemas/global-configuration"
import { Team_Detail } from "@/services/connect-rpc/types"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import { Tooltip, TooltipContent, TooltipTrigger } from "@gearment/ui3"
import { Link, useLocation } from "@tanstack/react-router"
import { CellContext } from "@tanstack/react-table"
import { GemIcon, SettingsIcon, Trash2Icon } from "lucide-react"

interface Props extends CellContext<Team_Detail, any> {}

export default function CellActions({ row }: Props) {
  const teamId = row.original.teamId
  const tierId = row.original.tierId
  const location = useLocation()
  const locationState = {
    key: location.state.key,
    href: location.href,
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
  }

  const [setOpen, onClose] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])

  const handleDelete = async () => {
    setOpen({
      title: "Delete team",
      description: `Are you sure you want to delete this team`,
      onConfirm: async () => {
        onClose()
      },
    })
  }

  return (
    <div className="flex justify-end gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to="/system/teams/$teamId/general"
            params={{ teamId }}
            state={locationState}
          >
            <SettingsIcon size={16} />
          </Link>
        </TooltipTrigger>
        <TooltipContent>Config</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to="/global-configuration/tier-management/update-team-tier"
            search={(search) =>
              UpdateTeamTierSearchSchema.parse({
                ...search,
                teamIds: [teamId],
                newTier: tierId,
              })
            }
            state={location}
          >
            <GemIcon size={16} className="text-yellow-500" />
          </Link>
        </TooltipTrigger>
        <TooltipContent>Manage tier</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button className="text-destructive" onClick={handleDelete}>
            <Trash2Icon size={16} />
          </button>
        </TooltipTrigger>
        <TooltipContent>Delete</TooltipContent>
      </Tooltip>
    </div>
  )
}
