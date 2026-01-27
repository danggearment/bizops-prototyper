import { Button, cn } from "@gearment/ui3"
import { useState } from "react"
import { useNotificationModal } from "./modal-notification-store"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@gearment/ui3"

export function ModalNotification() {
  const {
    open,
    onConfirm,
    title,
    description,
    OK = "OK",
    onClose,
    className,
  } = useNotificationModal((state) => ({
    open: state.open,
    onClose: state.onClose,
    title: state.title,
    description: state.description,
    onConfirm: state.onConfirm,
    OK: state.OK,
    className: state.className,
  }))
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title ?? "Confirm?"}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{description}</DialogDescription>

        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button
              size={"sm"}
              disabled={loading}
              loading={loading}
              variant={"outline"}
              className={cn("relative")}
              onClick={handleConfirm}
            >
              {OK}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
