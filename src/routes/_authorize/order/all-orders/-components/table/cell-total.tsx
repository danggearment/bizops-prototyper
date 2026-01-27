import { Money } from "@/services/connect-rpc/types"
import { formatPrice } from "@/utils"
interface Props {
  total?: Money
}
export default function CellTotal({ total }: Props) {
  if (!total) {
    return <span className="text-right block">--</span>
  }
  return (
    <span className="text-right block">
      {formatPrice(total) === "$0.00" ? "--" : formatPrice(total)}
    </span>
  )
}
