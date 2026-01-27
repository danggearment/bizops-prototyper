import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@gearment/ui3"
import {
  Archive,
  EllipsisVerticalIcon,
  PencilIcon,
  Printer,
} from "lucide-react"

export function ProductActions() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" className="w-[134px]">
        <PencilIcon />
        Edit product
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            Actions <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <Printer />
            Print surfaces
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-destructive hover:text-destructive">
            <Archive className="text-destructive" />
            Archive product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
