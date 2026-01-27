import { useNotificationModal } from "@/services/modals/modal-notification"
import { Button, ButtonIconCopy, toast } from "@gearment/ui3"
import { Link, useLocation } from "@tanstack/react-router"
import { CopyIcon } from "lucide-react"

export default function CellTxn({ txnIds }: { txnIds: string[] }) {
  const location = useLocation()
  const [setOpen, onClose] = useNotificationModal((state) => [
    state.setOpen,
    state.onClose,
  ])
  const viewMore = txnIds.length > 2

  const handleCopyAll = () => {
    navigator.clipboard.writeText(txnIds.join(", "))
    toast({
      title: "Copied",
      description: "All transactions have been copied to clipboard",
    })
  }

  const handleViewMore = () => {
    setOpen({
      onConfirm: () => {
        onClose()
      },
      title: "All transactions",
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
            {txnIds.map((txnId) => (
              <li
                key={txnId}
                className="flex items-center gap-1 border p-2 justify-between rounded-lg mb-2"
              >
                <span>{txnId}</span>
                <ButtonIconCopy size="sm" copyValue={txnId} />
              </li>
            ))}
          </ul>
        </div>
      ),
    })
  }

  if (txnIds.length === 0) {
    return <span className="text-muted-foreground">--</span>
  }

  return (
    <div>
      <ul className="space-y-1">
        {txnIds.slice(0, viewMore ? 2 : txnIds.length).map((txnId) => (
          <li key={txnId} className="flex items-center gap-1">
            <Link
              to="/finance/transactions/$transactionId"
              params={{ transactionId: txnId }}
              className="hover:text-primary"
              state={{
                ...location,
              }}
            >
              {txnId}
            </Link>
            <ButtonIconCopy size="sm" copyValue={txnId} />
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
          +{txnIds.length - 2} transactions
        </Button>
      )}
    </div>
  )
}
