import { GMProductPrintTypeStatus } from "@/services/connect-rpc/types"
import { Button } from "@gearment/ui3"
import {
  CircleCheckIcon,
  CircleXIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"
import { usePrintTypeDetail } from "../-print-type-detail-context"

export function HeaderActions() {
  const { printTypeDetail } = usePrintTypeDetail()

  const { status, isProtected, usageProductCount } = printTypeDetail

  const hasDisable =
    status === GMProductPrintTypeStatus.GM_PRODUCT_PRINT_TYPE_STATUS_ACTIVE &&
    !isProtected

  const hasEnable =
    status === GMProductPrintTypeStatus.GM_PRODUCT_PRINT_TYPE_STATUS_INACTIVE &&
    !isProtected

  const hasDelete = usageProductCount === BigInt(0) && !isProtected

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" className="w-[134px]">
        <PencilIcon />
        Edit print type
      </Button>
      {hasDisable && (
        <Button
          variant="outline"
          className="w-[134px] text-warning-foreground hover:text-warning-foreground"
        >
          <CircleXIcon />
          Disable
        </Button>
      )}
      {hasEnable && (
        <Button
          variant="outline"
          className="w-[134px] text-success-foreground hover:text-success-foreground"
        >
          <CircleCheckIcon />
          Enable
        </Button>
      )}
      {hasDelete && (
        <Button
          variant="destructive"
          className="w-[134px] text-destructive-foreground hover:text-destructive-foreground"
        >
          <Trash2Icon />
          Delete
        </Button>
      )}
    </div>
  )
}
