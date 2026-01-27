import { GMProductPrintType_Admin_Short } from "@/services/connect-rpc/types"
import { Link, useLocation } from "@tanstack/react-router"
import { CellContext } from "@tanstack/react-table"
import { ShieldCheck } from "lucide-react"

export function CellName(
  props: CellContext<GMProductPrintType_Admin_Short, unknown>,
) {
  const { name, isProtected, code } = props.row.original

  const location = useLocation()

  return (
    <div className="flex items-center gap-2">
      <Link
        to="/product-management/prints/type/$typeId"
        params={{ typeId: code }}
        state={location}
        className="hover:text-primary hover:underline"
      >
        {name}
      </Link>
      {isProtected && (
        <div className="text-xs bg-success-foreground/10 px-2 py-1 rounded-full flex items-center gap-1 text-success-foreground">
          <ShieldCheck className="size-3.5 text-success-foreground" />
          Protected
        </div>
      )}
    </div>
  )
}
