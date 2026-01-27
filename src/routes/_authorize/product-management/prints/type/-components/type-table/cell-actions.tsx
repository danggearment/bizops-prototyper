import {
  GMProductPrintType_Admin_Short,
  GMProductPrintTypeStatus,
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

enum Actions {
  VIEW = "view",
  EDIT = "edit",
  DISABLE = "disable",
  ENABLE = "enable",
  DELETE = "delete",
}

const TOOLTIP_TEXT_PROTECTED =
  "This print type is protected and cannot be modified."

export function CellActions(
  props: CellContext<GMProductPrintType_Admin_Short, unknown>,
) {
  const { isProtected, code, usageProductCount } = props.row.original
  const location = useLocation()
  const navigate = useNavigate()

  const isDisable =
    props.row.original.status ===
    GMProductPrintTypeStatus.GM_PRODUCT_PRINT_TYPE_STATUS_ACTIVE

  const isEnable =
    props.row.original.status ===
    GMProductPrintTypeStatus.GM_PRODUCT_PRINT_TYPE_STATUS_INACTIVE

  const isDelete = usageProductCount === BigInt(0)

  const handleAction = (action: Actions) => () => {
    switch (action) {
      case Actions.VIEW:
        navigate({
          to: "/product-management/prints/type/$typeId",
          params: { typeId: code },
          state: location,
        })
        break
      case Actions.EDIT:
        // TODO: implement edit print type
        console.log("edit print location", props.row.original)
        break
      case Actions.DISABLE:
        if (isProtected) return
        // TODO: implement disable print type
        console.log("disable print type", props.row.original)
        break
      case Actions.ENABLE:
        if (isProtected) return
        // TODO: implement enable print type
        console.log("enable print type", props.row.original)
        break
      case Actions.DELETE:
        if (isProtected) return
        // TODO: implement delete print type
        console.log("delete print type", props.row.original)
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
      label: "Edit print type",
      icon: <SquarePenIcon size={12} />,
      onClick: handleAction(Actions.EDIT),
      show: true,
    },
    {
      id: Actions.DISABLE,
      label: "Disable print type",
      icon: <CircleXIcon size={12} className="text-warning-foreground" />,
      onClick: handleAction(Actions.DISABLE),
      show: isDisable,
      className:
        "cursor-pointer text-warning-foreground focus:text-warning-foreground hover:text-warning-foreground",
      tooltip: true,
    },
    {
      id: Actions.ENABLE,
      label: "Enable print type",
      icon: <CircleCheckIcon size={12} className="text-success-foreground" />,
      onClick: handleAction(Actions.ENABLE),
      show: isEnable,
      className:
        "cursor-pointer text-success-foreground focus:text-success-foreground hover:text-success-foreground",
      tooltip: true,
    },
    {
      id: Actions.DELETE,
      label: "Delete print type",
      icon: <Trash2Icon size={12} className="text-destructive" />,
      onClick: handleAction(Actions.DELETE),
      show: isDelete,
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
