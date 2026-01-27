import { AllOrder_Message } from "@/services/connect-rpc/types"
import { ButtonIconCopy } from "@gearment/ui3"
import { Link, useLocation } from "@tanstack/react-router"
import { Row } from "@tanstack/react-table"

interface Props {
  row: Row<AllOrder_Message>
}

export default function CellFfm({ row }: Props) {
  const { fulfillmentOrderIds } = row.original
  const location = useLocation()

  return (
    <div className="body-small space-y-1 text-foreground/50">
      {!!fulfillmentOrderIds &&
        fulfillmentOrderIds.map((order) => (
          <div
            key={order.fulfillmentOrderId}
            className="flex items-center gap-1"
          >
            <Link
              to={
                import.meta.env.VITE_CRM_URL +
                "/acp/?site=order&act=show&id=" +
                (order.fulfillmentOrderId.split("-")[1]
                  ? order.fulfillmentOrderId.split("-")[1]
                  : order.fulfillmentOrderId) // Split TW-xxxxxx
              }
              target="_blank"
              rel="noreferrer"
              state={{ ...location }}
            >
              {order.fulfillmentOrderId}
            </Link>
            {order.fulfillmentOrderId && (
              <ButtonIconCopy size="sm" copyValue={order.fulfillmentOrderId} />
            )}
          </div>
        ))}
    </div>
  )
}
