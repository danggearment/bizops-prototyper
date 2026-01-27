import {
  GMProduct_Admin_Short,
  ProductStatus,
} from "@/services/connect-rpc/types"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"
import {
  ArchiveIcon,
  CircleCheckIcon,
  CircleXIcon,
  EditIcon,
  EllipsisVerticalIcon,
} from "lucide-react"
import { useMemo, useState } from "react"

export default function CellActions(
  props: CellContext<GMProduct_Admin_Short, unknown>,
) {
  const { status } = props.row.original

  const [openDropdown, setOpenDropdown] = useState(false)

  const { hasArchive, hasInactive, hasActive } = useMemo(() => {
    return {
      hasArchive: [ProductStatus.DRAFT, ProductStatus.UNKNOWN].includes(status),
      hasInactive: [ProductStatus.ACTIVE, ProductStatus.UNKNOWN].includes(
        status,
      ),
      hasActive: [ProductStatus.INACTIVE, ProductStatus.UNKNOWN].includes(
        status,
      ),
    }
  }, [status])

  return (
    <div className="flex justify-end">
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button className="cursor-pointer" variant="ghost" size="sm">
            <EllipsisVerticalIcon size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <EditIcon size={14} /> Edit product
          </DropdownMenuItem>
          {hasActive && (
            <DropdownMenuItem className="cursor-pointer">
              <CircleCheckIcon size={14} className="text-success-foreground" />
              <span className="text-success-foreground">Mark as active</span>
            </DropdownMenuItem>
          )}
          {hasInactive && (
            <DropdownMenuItem className="cursor-pointer">
              <CircleXIcon size={14} className="text-warning-foreground" />
              <span className="text-warning-foreground">Mark as inactive</span>
            </DropdownMenuItem>
          )}
          {hasArchive && (
            <DropdownMenuItem className="cursor-pointer">
              <ArchiveIcon size={14} className="text-error-foreground" />
              <span className="text-error-foreground">Archive</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
