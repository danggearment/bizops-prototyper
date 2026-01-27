import { GMProduct_Admin_Variant_Short } from "@/services/connect-rpc/types"
import { Badge, Tooltip, TooltipContent, TooltipTrigger } from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"

export default function CellStock(
  props: CellContext<GMProduct_Admin_Variant_Short, any>,
) {
  const stock = props.row.original.stockQuantity

  let color: "success" | "error" | "warning" | "default" | "info" = "success"
  let tooltip = undefined

  if (Number(stock) === 0) {
    color = "error"
    tooltip = "Out of stock"
  } else if (Number(stock) <= 10) {
    color = "warning"
    tooltip = "Low stock"
  }

  const stockDisplay = (
    <Badge variant={color} isIcon={false}>
      {stock}
    </Badge>
  )

  return tooltip ? (
    <Tooltip>
      <TooltipTrigger>{stockDisplay}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  ) : (
    stockDisplay
  )
}
