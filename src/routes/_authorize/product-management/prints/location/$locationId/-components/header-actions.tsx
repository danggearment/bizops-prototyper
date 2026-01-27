import { GMPrintLocationStatus } from "@/services/connect-rpc/types"
import { Button } from "@gearment/ui3"
import {
  CircleCheckIcon,
  CircleXIcon,
  EditIcon,
  LayersIcon,
  Trash2Icon,
} from "lucide-react"
import { usePrintLocationDetail } from "../-print-location-detail-context"

export function HeaderActions() {
  const { printLocationDetail } = usePrintLocationDetail()

  const { status, isProtected, productUsageCount } = printLocationDetail

  const hasDeactivate =
    status === GMPrintLocationStatus.GM_PRINT_LOCATION_STATUS_ACTIVE &&
    !isProtected

  const hasActivate =
    status === GMPrintLocationStatus.GM_PRINT_LOCATION_STATUS_INACTIVE &&
    !isProtected

  const hasDelete = productUsageCount === BigInt(0) && !isProtected

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" className="w-[154px]">
        <LayersIcon />
        Templates
      </Button>
      <Button variant="outline" className="w-[154px]">
        <EditIcon />
        Edit print location
      </Button>
      {hasDeactivate && (
        <Button
          variant="outline"
          className="w-[154px] text-warning-foreground hover:text-warning-foreground"
        >
          <CircleXIcon />
          Deactivate
        </Button>
      )}
      {hasActivate && (
        <Button
          variant="outline"
          className="w-[154px] text-success-foreground hover:text-success-foreground"
        >
          <CircleCheckIcon />
          Activate
        </Button>
      )}
      {hasDelete && (
        <Button
          variant="destructive"
          className="w-[154px] text-destructive-foreground hover:text-destructive-foreground"
        >
          <Trash2Icon />
          Delete
        </Button>
      )}
    </div>
  )
}
