import { formatPrice, getPrice } from "@/utils/format-currency"
import { Money } from "@gearment/nextapi/common/type/v1/money_pb"
import { Badge } from "@gearment/ui3"

interface Props {
  amount?: Money
}
function CellAmount({ amount }: Props) {
  return (
    <div className="flex">
      <Badge
        className="text-sm "
        variant={getPrice(amount) < 0 ? "error" : "success"}
      >
        {formatPrice(amount)}
      </Badge>
    </div>
  )
}

export default CellAmount
