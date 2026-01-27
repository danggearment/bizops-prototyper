import { CatalogOption_Option } from "@/services/connect-rpc/types"
import {
  ButtonIconCopy,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"

export default function CellName(
  props: CellContext<CatalogOption_Option, any>,
) {
  const { name } = props.row.original
  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger>
          <div className="max-w-[150px] text-foreground-dark truncate text-left">
            {name}
          </div>
        </TooltipTrigger>
        <TooltipContent>{name}</TooltipContent>
      </Tooltip>
      <ButtonIconCopy copyValue={name} size="sm" />
    </div>
  )
}
