import { CatalogOption_Option } from "@/services/connect-rpc/types"
import { Tooltip, TooltipContent, TooltipTrigger } from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"

export default function CellMaterial(
  props: CellContext<CatalogOption_Option, any>,
) {
  const { previewImageUrl, name } = props.row.original
  if (!previewImageUrl) return null
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="w-[80px] flex items-center justify-center">
          <img
            src={previewImageUrl}
            alt={name}
            className="h-auto max-h-[32px] object-contain"
          />
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <img
          src={previewImageUrl}
          alt={name}
          className="h-auto max-h-[256px] object-contain bg-background"
        />
      </TooltipContent>
    </Tooltip>
  )
}
