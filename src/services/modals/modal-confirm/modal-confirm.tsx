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
import { useConfirmModal } from "./modal-confirm-store"

export function ConfirmModal() {
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
  } = useConfirmModal()

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title ?? "Confirm?"}</DialogTitle>
          <DialogDescription>
            {description && <p className="body-small">{description}</p>}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button
              className="shadow"
              onClick={handleClose}
              variant="ghost"
              size={"sm"}
            >
              {cancelText || "Cancel"}
            </Button>
            <Button
              size={"sm"}
              disabled={loading}
              loading={loading}
              variant={type === "error" ? "destructive" : "default"}
              className={cn("relative")}
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
