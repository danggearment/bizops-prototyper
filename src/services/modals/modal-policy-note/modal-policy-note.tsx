import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  TextareaField,
} from "@gearment/ui3"
import { useEffect, useState } from "react"
import { usePolicyNoteModal } from "./modal-policy-note-store"

export function ModalPolicyNote() {
  const { open, onClose, title, initialValue, confirmText, onConfirm } =
    usePolicyNoteModal()
  const [policyNote, setPolicyNote] = useState("")
  const [loading, setLoading] = useState(false)

  const MIN_CHARACTERS = 5
  const MAX_CHARACTERS = 1000

  useEffect(() => {
    if (open) {
      setPolicyNote(initialValue)
    }
  }, [open, initialValue])

  const handleConfirm = async () => {
    if (
      policyNote.trim().length < MIN_CHARACTERS ||
      policyNote.trim().length > MAX_CHARACTERS
    )
      return

    const isAsync = onConfirm.constructor.name === "AsyncFunction"

    try {
      if (isAsync) {
        setLoading(true)
        await onConfirm(policyNote.trim())
      } else {
        onConfirm(policyNote.trim())
      }
      onClose()
    } catch (error) {
      console.error("Error confirming policy note:", error)
    } finally {
      if (isAsync) {
        setLoading(false)
      }
    }
  }

  const handleClose = () => {
    onClose()
    setPolicyNote("")
  }

  const currentLength = policyNote.length
  const trimmedLength = policyNote.trim().length
  const isMinError = trimmedLength > 0 && trimmedLength < MIN_CHARACTERS
  const isMaxError = currentLength > MAX_CHARACTERS
  const isDisabled =
    trimmedLength < MIN_CHARACTERS || currentLength > MAX_CHARACTERS || loading

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <div className="font-medium">
              Policy Note<span className="text-red-500">*</span>
            </div>
            <div className="space-y-2">
              <TextareaField
                value={policyNote}
                onChange={(e) => setPolicyNote(e.target.value)}
                rows={6}
                placeholder="Enter policy note and any specific terms and conditions..."
                className={`w-full ${isMinError || isMaxError ? "border-red-500" : ""}`}
              />
              <div className="flex justify-between items-center text-sm">
                <div
                  className={`${isMinError ? "text-red-500" : "text-gray-500"}`}
                >
                  {isMinError
                    ? `Minimum ${MIN_CHARACTERS} characters required`
                    : ""}
                </div>
                <div
                  className={`${isMaxError ? "text-red-500" : "text-gray-500"}`}
                >
                  {currentLength}/{MAX_CHARACTERS}
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              disabled={isDisabled}
              loading={loading}
              onClick={handleConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
