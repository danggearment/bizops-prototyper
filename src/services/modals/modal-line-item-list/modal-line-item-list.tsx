import {
  Button,
  cn,
  DataTable,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@gearment/ui3"
import { useState } from "react"
import { useLineItemListModal } from "./modal-line-item-list-store"

export function ModalLineItemList() {
  const {
    open,
    onClose,
    onConfirm,
    title,
    description,
    dataTable,
    className,
    closeText,
  } = useLineItemListModal((state) => ({
    open: state.open,
    onClose: state.onClose,
    title: state.title,
    description: state.description,
    dataTable: state.dataTable,
    className: state.className,
    closeText: state.closeText,
    onConfirm: state.onConfirm,
  }))

  const [loading, setLoading] = useState(false)

  const handleClose = async () => {
    try {
      if (onConfirm.constructor.name === "AsyncFunction") {
        setLoading(true)
        await onConfirm()
      } else {
        onConfirm()
      }
    } finally {
      if (onConfirm.constructor.name === "AsyncFunction") {
        setLoading(false)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={cn("w-full sm:max-w-fit", className)}>
        <DialogHeader>
          <DialogTitle>{title ?? ""}</DialogTitle>
          <DialogDescription>
            {description && <p className="body-small">{description}</p>}
          </DialogDescription>
          <div className="max-h-[600px] w-full overflow-auto">
            <DataTable
              className="rounded-b-none text-base w-full"
              loading={loading}
              table={dataTable}
            />
          </div>
        </DialogHeader>
        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button
              disabled={loading}
              loading={loading}
              className="shadow"
              onClick={handleClose}
              variant="ghost"
              size={"sm"}
            >
              {closeText || "Close"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
