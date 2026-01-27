import { CatalogOption_Option } from "@/services/connect-rpc/types"
import {
  ButtonIconCopy,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"

export default function CellCode(
  props: CellContext<CatalogOption_Option, any>,
) {
  const { code } = props.row.original
  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger>
          <div className="max-w-[150px] text-foreground-dark truncate text-left">
            {code}
          </div>
        </TooltipTrigger>
        <TooltipContent>{code}</TooltipContent>
      </Tooltip>
      <ButtonIconCopy copyValue={code} size="sm" />
    </div>
  )
}
