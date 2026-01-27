import ShortText from "@/components/common/short-text"
import { DEFAULT_EMPTY_VALUE } from "@/constants/order"
import { OrderDraft_Admin } from "@/services/connect-rpc/types"
import { ButtonIconCopy, cn } from "@gearment/ui3"
import { Link, useLocation } from "@tanstack/react-router"
import { Row } from "@tanstack/react-table"
import {
  CreatedDuplicated,
  CreatedMethod,
  NotesOrder,
} from "../../../-component/tooltip-order"

interface Props {
  row: Row<OrderDraft_Admin>
  orderId: string
}

export default function CellOrder({ row, orderId }: Props) {
  const { storeName, referenceId } = row.original
  const location = useLocation()
  return (
    <div className="space-y-1">
      <div className={cn("text-base font-medium flex gap-1 items-center")}>
        <Link
          to="/order/draft-orders/$orderId"
          params={{
            orderId: orderId || "",
          }}
          state={{
            ...location,
          }}
        >
          {orderId}
        </Link>
        {orderId && <ButtonIconCopy size="sm" copyValue={orderId} />}
      </div>
      <div className="body-small mb-1 flex items-center gap-1 text-foreground/50">
        <span>{storeName ? `${storeName}` : DEFAULT_EMPTY_VALUE}</span>
      </div>
      <div className="body-small mb-1 flex items-center gap-1 text-foreground/50">
        <span>Ref ID: </span>
        <ShortText text={referenceId} startLength={4} endLength={8} allowCopy />
      </div>
      <div className="flex items-center gap-2">
        <CreatedMethod
          createdMethod={row.original.createdMethod}
          isLabelAttached={row.original.isLabelAttached}
        />
        <CreatedDuplicated originOrderId={row.original.originOrderId} />
        <NotesOrder notes={row.original.notes} />
      </div>
    </div>
  )
}
