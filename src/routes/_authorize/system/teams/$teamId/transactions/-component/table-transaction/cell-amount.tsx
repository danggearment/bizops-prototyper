import { formatPrice, getPrice } from "@/utils/format-currency"
import { Money } from "@gearment/nextapi/common/type/v1/money_pb"
import { Badge } from "@gearment/ui3"

interface Props {
  amount?: Money
}
function CellAmount({ amount }: Props) {
  return (
    <Badge
      className="text-sm px-3 py-1 w-fit"
      variant={getPrice(amount) < 0 ? "error" : "success"}
    >
      {formatPrice(amount)}
    </Badge>
  )
}

export default CellAmount
