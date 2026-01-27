import { GMProduct_TeamProductDetail_Variant } from "@/services/connect-rpc/types"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"
import { EllipsisVerticalIcon } from "lucide-react"
import { useState } from "react"

export default function CellActions(
  _: CellContext<GMProduct_TeamProductDetail_Variant, any>,
) {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false)

  return (
    <div className="flex justify-end">
      <DropdownMenu open={openDropdown} onOpenChange={setOpenDropdown}>
        <DropdownMenuTrigger asChild>
          <Button className="cursor-pointer" variant="ghost" size={"sm"}>
            <EllipsisVerticalIcon size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit variant</DropdownMenuItem>
          <DropdownMenuItem>Mark as inactive</DropdownMenuItem>
          <DropdownMenuItem>Delete variant</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
