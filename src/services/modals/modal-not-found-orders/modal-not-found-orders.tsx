import {
  Button,
  ButtonIconCopy,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  toast,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { formatTextMany } from "@gearment/utils"
import { CopyIcon } from "lucide-react"
import { useNotFoundOrders } from "./modal-not-found-orders-store"

export function ModalNotFoundOrders() {
  const { open, notFoundOrders, actions } = useNotFoundOrders()

  const handleClose = () => {
    actions.onClose()
  }

  const handleCopyAll = () => {
    navigator.clipboard.writeText(notFoundOrders.join(", "))
    toast({
      title: "Copied",
      description: "All orders have been copied to clipboard",
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Orders not found
            <span className="text-muted-foreground/80 text-sm">
              ({formatTextMany("order", notFoundOrders.length)})
            </span>
          </DialogTitle>
          <p className="text-muted-foreground/80 text-sm">
            The following orders could not be found in the system. Click to copy
            individual orders or copy all at once.
          </p>
        </DialogHeader>
        <div className="flex justify-end">
          <div>
            <span className="relative">
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="outline" size="sm" onClick={handleCopyAll}>
                    <CopyIcon size={16} /> Copy all orders
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="text-sm">
                    Copy all orders separated by comma (,)
                  </span>
                </TooltipContent>
              </Tooltip>
            </span>
          </div>
        </div>
        <div className="rounded-md border p-2 max-h-[260px] overflow-y-auto">
          <ul className="space-y-2">
            {notFoundOrders.map((order) => (
              <li
                key={order}
                className="p-3 rounded-md bg-gray-100/70 flex justify-between items-center"
              >
                <span className="text-foreground">{order}</span>
                <ButtonIconCopy size="sm" copyValue={order} />
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
