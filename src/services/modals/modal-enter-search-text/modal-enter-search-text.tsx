import {
  TextareaField,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { InfoIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useEnterSearchText } from "./modal-enter-search-text-store"

import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@gearment/ui3"

export function ModalEnterSearchText() {
  const {
    open,
    actions,
    onConfirm,
    value: defaultValue,
    maxLength,
  } = useEnterSearchText()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState(defaultValue)

  const handleConfirm = async () => {
    const isAsync = onConfirm.constructor.name === "AsyncFunction"
    const text = value.replace(/[\s\n]+/g, ",").replace(/,+$/, "") || ""

    try {
      if (isAsync) {
        setLoading(true)
        await onConfirm(text)
      } else {
        onConfirm(text)
      }
    } finally {
      if (isAsync) {
        setLoading(false)
      }
    }
  }

  const countText = (text: string) => {
    const lines = text.split("\n").filter((line) => line.trim())
    const items = lines
      .join(",")
      .split(",")
      .filter((item) => item.trim())
    return items.length
  }

  const handleClose = () => {
    actions.onClose()
  }
  const handleFormat = (text: string) => {
    return text
      .split(/[,\s]+/)
      .filter(Boolean)
      .join("\n")
  }

  useEffect(() => {
    if (open) {
      textareaRef.current?.focus()
      setValue(handleFormat(defaultValue))
    }
  }, [open])

  const countNumber = countText(handleFormat(value || ""))
  const hasError = countNumber > maxLength

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Search box</span>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <InfoIcon size={16} />
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="max-w-[250px] font-normal text-wrap"
              >
                <div>
                  Enter multiple search terms separated by commas (,), spaces (
                  ), or new lines (↵). Each term will be treated as a separate
                  search item.
                </div>
              </TooltipContent>
            </Tooltip>
          </DialogTitle>
        </DialogHeader>
        <div>
          <TextareaField
            ref={textareaRef}
            rows={10}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
            }}
            placeholder={`Enter multiple search terms separated by commas (,), spaces ( ), or new lines (↵). Each term will be treated as a separate search item.`}
            error={hasError ? "Max length is " + maxLength : undefined}
          />
          <div className="flex justify-end items-center">
            <div
              className={`text-right text-foreground text-sm font-normal ${hasError ? "text-error" : ""}`}
            >{`${countNumber}/${maxLength}`}</div>
          </div>
        </div>
        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="shadow"
              onClick={handleClose}
            >
              Cancel
            </Button>

            <Button
              size="sm"
              disabled={loading || hasError}
              loading={loading}
              className={cn("relative")}
              onClick={handleConfirm}
            >
              Search
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
