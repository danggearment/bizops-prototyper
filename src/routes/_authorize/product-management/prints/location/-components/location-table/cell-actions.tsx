import {
  GMPrintLocation_Admin_Short,
  GMPrintLocationStatus,
} from "@/services/connect-rpc/types"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@gearment/ui3"
import { useLocation, useNavigate } from "@tanstack/react-router"
import { CellContext } from "@tanstack/react-table"
import {
  CircleCheckIcon,
  CircleXIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  SquarePenIcon,
  Trash2Icon,
} from "lucide-react"
import { TooltipProtected } from "../../../-helpers"

type CellActionsProps = CellContext<GMPrintLocation_Admin_Short, unknown>

enum Actions {
  VIEW = "view",
  EDIT = "edit",
  DEACTIVATE = "deactivate",
  ACTIVATE = "activate",
  DELETE = "delete",
}

const TOOLTIP_TEXT_PROTECTED =
  "This action is protected due to system-wide dependencies."

export function CellActions(props: CellActionsProps) {
  const { isProtected, code, status } = props.row.original
  const location = useLocation()
  const navigate = useNavigate()

  const isActive =
    status === GMPrintLocationStatus.GM_PRINT_LOCATION_STATUS_ACTIVE
  const isInactive =
    status === GMPrintLocationStatus.GM_PRINT_LOCATION_STATUS_INACTIVE

  const handleAction = (action: Actions) => () => {
    switch (action) {
      case Actions.VIEW:
        navigate({
          to: "/product-management/prints/location/$locationId",
          params: { locationId: code },
          state: location,
        })
        break
      case Actions.EDIT:
        // TODO: implement edit print location
        console.log("edit print location", props.row.original)
        break
      case Actions.DEACTIVATE:
        if (isProtected) return
        // TODO: implement deactivate print location
        console.log("deactivate print location", props.row.original)
        break
      case Actions.ACTIVATE:
        if (isProtected) return
        // TODO: implement activate print location
        console.log("activate print location", props.row.original)
        break
      case Actions.DELETE:
        if (isProtected) return
        // TODO: implement delete print location
        console.log("delete print location", props.row.original)
        break
      default:
        break
    }
  }

  const menuOptions = [
    {
      id: Actions.VIEW,
      label: "View details",
      icon: <EyeIcon size={12} />,
      onClick: handleAction(Actions.VIEW),
      show: true,
    },
    {
      id: Actions.EDIT,
      label: "Edit print location",
      icon: <SquarePenIcon size={12} />,
      onClick: handleAction(Actions.EDIT),
      show: true,
    },
    {
      id: Actions.DEACTIVATE,
      label: "Deactivate print location",
      icon: <CircleXIcon size={12} className="text-warning-foreground" />,
      onClick: handleAction(Actions.DEACTIVATE),
      show: isActive,
      className:
        "cursor-pointer text-warning-foreground focus:text-warning-foreground hover:text-warning-foreground",
      tooltip: true,
    },
    {
      id: Actions.ACTIVATE,
      label: "Activate print location",
      icon: <CircleCheckIcon size={12} className="text-success-foreground" />,
      onClick: handleAction(Actions.ACTIVATE),
      show: isInactive,
      className:
        "cursor-pointer text-success-foreground focus:text-success-foreground hover:text-success-foreground",
      tooltip: true,
    },
    {
      id: Actions.DELETE,
      label: "Delete print location",
      icon: <Trash2Icon size={12} className="text-destructive" />,
      onClick: handleAction(Actions.DELETE),
      show: true,
      className:
        "cursor-pointer text-destructive focus:text-destructive hover:text-destructive",
      tooltip: true,
    },
  ]

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button className="cursor-pointer" variant="ghost" size="icon">
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {menuOptions
            .filter((option) => option.show)
            .map((option) =>
              option.tooltip ? (
                <DropdownMenuItem
                  key={option.id}
                  onClick={option.onClick}
                  className={option.className}
                >
                  <TooltipProtected
                    isProtected={isProtected}
                    tooltipText={TOOLTIP_TEXT_PROTECTED}
                  >
                    {option.icon}
                    {option.label}
                  </TooltipProtected>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  key={option.id}
                  onClick={option.onClick}
                  className={option.className}
                >
                  {option.icon}
                  {option.label}
                </DropdownMenuItem>
              ),
            )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
