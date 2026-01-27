import { GMProductCategory_Admin_Short } from "@/services/connect-rpc/types"
import { Link, useLocation } from "@tanstack/react-router"
import { CellContext } from "@tanstack/react-table"

export default function CellName(
  props: CellContext<GMProductCategory_Admin_Short, any>,
) {
  const { categoryName, categoryCode } = props.row.original
  const location = useLocation()
  return (
    <div className="w-[140px]">
      <Link
        to={`/product-management/categories/$categoryId`}
        className="hover:text-primary hover:underline"
        params={{ categoryId: categoryCode }}
        state={location}
      >
        {categoryName}
      </Link>
    </div>
  )
}
