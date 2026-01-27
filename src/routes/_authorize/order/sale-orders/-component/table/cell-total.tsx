import { formatPrice } from "@/utils"
import { Money } from "@/services/connect-rpc/types"
interface Props {
  total: Money
}
export default function CellTotal({ total }: Props) {
  return (
    <span className="  text-right block">
      {formatPrice(total) === "$0.00" ? "--" : formatPrice(total)}
    </span>
  )
}
