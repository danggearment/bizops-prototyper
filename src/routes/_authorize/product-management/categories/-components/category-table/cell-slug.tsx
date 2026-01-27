import { GMProductCategory_Admin_Short } from "@/services/connect-rpc/types"
import { Tooltip, TooltipContent, TooltipTrigger } from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"

export function CellSlug(
  props: CellContext<GMProductCategory_Admin_Short, any>,
) {
  const { categoryCode } = props.row.original
  return (
    <div className="w-[140px]">
      <Tooltip>
        <TooltipTrigger>
          <div className="w-[140px] text-foreground-dark truncate text-left">
            {categoryCode}
          </div>
        </TooltipTrigger>
        <TooltipContent>{categoryCode}</TooltipContent>
      </Tooltip>
    </div>
  )
}
