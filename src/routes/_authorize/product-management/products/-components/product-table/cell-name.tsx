import { GMProduct_Admin_Short } from "@/services/connect-rpc/types"
import { Link, useLocation } from "@tanstack/react-router"
import { CellContext } from "@tanstack/react-table"

export function CellName(props: CellContext<GMProduct_Admin_Short, any>) {
  const { row } = props
  const { productName, productSku } = row.original
  const location = useLocation()

  return (
    <div className="w-[300px] text-wrap">
      <Link
        to={"/product-management/products/$productId"}
        params={{ productId: productSku }}
        state={location}
        className="hover:text-primary hover:underline"
      >
        {productName}
      </Link>
    </div>
  )
}
