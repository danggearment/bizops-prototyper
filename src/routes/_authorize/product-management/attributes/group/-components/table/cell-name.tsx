import { GMAttribute_Admin_Short } from "@/services/connect-rpc/types"
import { ButtonIconCopy } from "@gearment/ui3"
import { Link, useLocation } from "@tanstack/react-router"
import { CellContext } from "@tanstack/react-table"

export default function CellName(
  props: CellContext<GMAttribute_Admin_Short, any>,
) {
  const { attrKey, attrName } = props.row.original

  const location = useLocation()
  return (
    <div className="flex items-center gap-1">
      <Link
        to="/product-management/attributes/group/$groupId"
        params={{ groupId: attrKey }}
        state={location}
        className="hover:text-primary hover:underline"
      >
        {attrName}
      </Link>
      <ButtonIconCopy copyValue={attrName} size="sm" />
    </div>
  )
}
