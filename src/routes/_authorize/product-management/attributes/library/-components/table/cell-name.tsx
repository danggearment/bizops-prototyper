import { GMAttribute_Admin_Value } from "@/services/connect-rpc/types"
import { ButtonIconCopy } from "@gearment/ui3"
import { Link, useLocation } from "@tanstack/react-router"
import { CellContext } from "@tanstack/react-table"

export default function CellName(
  props: CellContext<GMAttribute_Admin_Value, any>,
) {
  const { attrCode, attrValue } = props.row.original
  const location = useLocation()

  return (
    <div className="flex items-center gap-1">
      <Link
        to="/product-management/attributes/library/$libraryId"
        params={{ libraryId: attrCode }}
        state={location}
        className="hover:text-primary hover:underline"
      >
        {attrValue}
      </Link>
      <ButtonIconCopy copyValue={attrValue} size="sm" />
    </div>
  )
}
