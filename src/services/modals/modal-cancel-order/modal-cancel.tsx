import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@gearment/ui3"
import { useState } from "react"
import { useModalCancelOrder } from "./modal-cancel-store"

export function ModalCancelOrder() {
  const {
    open,
    onClose,
    onConfirm,
    title,
    description,
    type,
    cancelText,
    confirmText,
    callbackOnClose,
  } = useModalCancelOrder()

  const [loading, setLoading] = useState(false)
  const handleConfirm = async () => {
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
  const handleClose = () => {
    onClose()
    if (callbackOnClose) {
      callbackOnClose()
    }
  }
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="mb-4">
          <DialogTitle className="text-center">
            {title ?? "Confirm?"}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>{description && description}</DialogDescription>

        <DialogFooter>
          <div className="grid grid-cols-2 gap-2 w-full">
            <Button
              className="w-full"
              onClick={handleClose}
              variant="outline"
              size={"sm"}
            >
              {cancelText || "Cancel"}
            </Button>
            <Button
              size={"sm"}
              disabled={loading}
              loading={loading}
              className={cn(
                "relative w-full",
                type === "error" ? "bg-destructive border-destructive" : "",
              )}
              onClick={handleConfirm}
            >
              {confirmText || "Confirm"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
