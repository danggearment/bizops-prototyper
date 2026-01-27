import { GMProductCategory_Admin_Short } from "@/services/connect-rpc/types"
import { Tooltip, TooltipContent, TooltipTrigger } from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"

export function CellDescription(
  props: CellContext<GMProductCategory_Admin_Short, any>,
) {
  const { description } = props.row.original
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="w-[100px] text-foreground-dark truncate text-left">
          {description}
        </div>
      </TooltipTrigger>
      <TooltipContent>{description}</TooltipContent>
    </Tooltip>
  )
}
