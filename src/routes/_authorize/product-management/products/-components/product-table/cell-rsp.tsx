import { GMProduct_Admin_Short } from "@/services/connect-rpc/types"
import { formatPrice, getPrice } from "@/utils"
import { CellContext } from "@tanstack/react-table"

export default function CellRSP(
  props: CellContext<GMProduct_Admin_Short, any>,
) {
  const { basePrice, minPrice, maxPrice } = props.row.original
  const min = minPrice || basePrice
  const max = maxPrice || basePrice

  const isSinglePrice =
    minPrice && maxPrice && getPrice(minPrice) === getPrice(maxPrice)
  const noMinMax = !minPrice && !maxPrice

  if (!minPrice && maxPrice && getPrice(maxPrice) === getPrice(basePrice)) {
    return <div>{formatPrice(basePrice)}</div>
  }
  if (!maxPrice && minPrice && getPrice(minPrice) === getPrice(basePrice)) {
    return <div>{formatPrice(basePrice)}</div>
  }

  if (isSinglePrice) {
    return <div>{formatPrice(minPrice)}</div>
  }
  if (noMinMax) {
    return <div>{formatPrice(basePrice)}</div>
  }
  return (
    <div>
      {formatPrice(min)}
      {" ~ "}
      {formatPrice(max)}
    </div>
  )
}
