import StatusIndicator from "@/components/common/status-indicator"
import { AllOrder_Message, AllOrder_Type } from "@/services/connect-rpc/types"
import { ButtonIconCopy } from "@gearment/ui3"
import { Link, useLocation } from "@tanstack/react-router"
import { Row } from "@tanstack/react-table"
import { ZapIcon } from "lucide-react"
import { useMemo } from "react"
import { CreatedMethod } from "../../../-component/tooltip-order"

interface Props {
  row: Row<AllOrder_Message>
}

export default function CellOrder({ row }: Props) {
  const { orderId, type, storeName, platformRef, isRush } = row.original
  const location = useLocation()

  const redirectUrl = useMemo(() => {
    switch (type) {
      case AllOrder_Type.SALE:
        return "/order/$orderId"
      case AllOrder_Type.DRAFT:
        return "/order/draft-orders/$orderId"
      case AllOrder_Type.ERROR:
        return "/order/$orderId"
      default:
        return "/order/$orderId"
    }
  }, [type])

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1 font-medium">
        <Link
          to={redirectUrl}
          params={{
            orderId: orderId || "",
          }}
          state={{ ...location }}
        >
          {orderId}
        </Link>
        {orderId && <ButtonIconCopy size="sm" copyValue={orderId} />}
      </div>
      <div className="body-small mb-1 flex items-center gap-1 text-foreground/50">
        <span>{storeName ? `${storeName}` : "--"}</span>
      </div>
      <div className="body-small mb-1 flex items-center gap-1 text-foreground/50">
        <span>Ref ID: {platformRef ? `${platformRef}` : "--"}</span>
        {platformRef && <ButtonIconCopy size="sm" copyValue={platformRef} />}
      </div>
      <div className="flex items-center gap-2">
        <CreatedMethod
          createdMethod={row.original.createdMethod}
          isLabelAttached={row.original.isLabelAttached}
        />

        {isRush && (
          <StatusIndicator
            isVerified={isRush}
            icon={
              <ZapIcon
                size={14}
                className="stroke-orange-600 fill-orange-600"
              />
            }
            verifiedText="Rush order"
            unverifiedText="Normal order"
          />
        )}
      </div>
    </div>
  )
}
