import { CatalogOption_Option } from "@/services/connect-rpc/types"
import { ButtonIconCopy } from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"

export default function CellHexColor(
  props: CellContext<CatalogOption_Option, any>,
) {
  const { values } = props.row.original

  const hexColor = values?.[0]?.value ? `#${values[0].value}` : ""

  return (
    <div className="flex items-center gap-1">
      <span className="text-foreground-dark tabular-nums">{hexColor}</span>
      <ButtonIconCopy copyValue={hexColor} size="sm" />
    </div>
  )
}
