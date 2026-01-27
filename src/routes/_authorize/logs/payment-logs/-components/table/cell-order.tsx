import { useNotificationModal } from "@/services/modals/modal-notification"
import { Button, ButtonIconCopy, toast } from "@gearment/ui3"
import { Link, useLocation } from "@tanstack/react-router"
import { CopyIcon } from "lucide-react"

export default function CellOrder({ orderIds }: { orderIds: string[] }) {
  const [setOpen, onClose] = useNotificationModal((state) => [
    state.setOpen,
    state.onClose,
  ])
  const location = useLocation()

  const viewMore = orderIds.length > 2

  const handleCopyAll = () => {
    navigator.clipboard.writeText(orderIds.join(", "))
    toast({
      title: "Copied",
      description: "All orders have been copied to clipboard",
    })
  }

  const handleViewMore = () => {
    setOpen({
      onConfirm: () => {
        onClose()
      },
      title: "All orders",
      OK: "Close",
      description: (
        <div className="text-foreground">
          <div className="flex justify-end mb-4">
            <Button size="sm" variant="outline" onClick={handleCopyAll}>
              <CopyIcon size={14} />
              Copy all
            </Button>
          </div>
          <ul className="space-y-1 max-h-[500px] overflow-y-auto">
            {orderIds.map((orderId) => (
              <li
                key={orderId}
                className="flex items-center gap-1 mb-2 border p-2 justify-between rounded-lg"
              >
                <span>{orderId}</span>
                <ButtonIconCopy size="sm" copyValue={orderId} />
              </li>
            ))}
          </ul>
        </div>
      ),
    })
  }
  return (
    <div>
      <ul className="space-y-1">
        {orderIds.slice(0, viewMore ? 2 : orderIds.length).map((orderId) => (
          <li key={orderId} className="flex items-center gap-1">
            <Link
              to={`/order/$orderId`}
              params={{ orderId }}
              state={{
                ...location,
              }}
            >
              <span>{orderId}</span>
            </Link>
            <ButtonIconCopy size="sm" copyValue={orderId} />
          </li>
        ))}
      </ul>
      {viewMore && (
        <Button
          onClick={handleViewMore}
          variant="link"
          size="sm"
          className="p-0"
        >
          +{orderIds.length - 2} orders
        </Button>
      )}
    </div>
  )
}
