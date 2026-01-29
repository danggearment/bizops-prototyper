import { SellerProduct } from "@/schemas/schemas/seller-pricing"
import { Checkbox } from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"

interface Props extends CellContext<SellerProduct, unknown> {
  checked: boolean
  disabled: boolean
  onCheckedChange: () => void
}

export default function CellSelect({
  checked,
  disabled,
  onCheckedChange,
}: Props) {
  return (
    <Checkbox
      checked={checked}
      disabled={disabled}
      onCheckedChange={onCheckedChange}
      aria-label="Select row"
    />
  )
}
