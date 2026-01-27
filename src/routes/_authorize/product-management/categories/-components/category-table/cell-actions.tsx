import { GMProductCategory_Admin_Short } from "@/services/connect-rpc/types"
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
  Edit,
  EllipsisVerticalIcon,
  EyeIcon,
} from "lucide-react"
import { useState } from "react"

export function CellActions(
  props: CellContext<GMProductCategory_Admin_Short, any>,
) {
  const { categoryCode, isActive } = props.row.original
  const [openDropdown, setOpenDropdown] = useState(false)
  const navigate = useNavigate({})
  const location = useLocation()

  const handleViewCategory = () => {
    navigate({
      to: "/product-management/categories/$categoryId",
      params: { categoryId: categoryCode },
      state: location,
    })
  }

  const handleEditCategory = () => {
    // TODO: implement edit category
    console.log("edit category", props.row.original)
  }

  const handleDisableCategory = () => {
    // TODO: implement disable category
    console.log("disable category", props.row.original)
  }

  const handleEnableCategory = () => {
    // TODO: implement enable category
    console.log("enable category", props.row.original)
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <EllipsisVerticalIcon size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={handleViewCategory}>
            <EyeIcon size={14} /> View category
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEditCategory}>
            <Edit size={14} /> Edit category
          </DropdownMenuItem>
          {isActive ? (
            <DropdownMenuItem
              className="text-error-foreground focus:text-error-foreground cursor-pointer"
              onClick={handleDisableCategory}
            >
              <CircleXIcon size={14} className="text-error-foreground" />{" "}
              Disable category
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="text-success-foreground focus:text-success-foreground cursor-pointer"
              onClick={handleEnableCategory}
            >
              <CircleCheckIcon size={14} className="text-success-foreground" />{" "}
              Enable category
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
