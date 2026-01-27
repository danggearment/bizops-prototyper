import { CatalogOption_Option } from "@/services/connect-rpc/types"
import { Input } from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"

export default function CellColor(
  props: CellContext<CatalogOption_Option, any>,
) {
  const { values } = props.row.original
  const hexColor = values?.[0]?.value ? `#${values[0].value}` : ""
  return (
    <Input
      type="color"
      value={hexColor}
      className="p-0 shadow-none border-none cursor-pointer h-10"
      readOnly
      onChange={() => {}}
    />
  )
}
