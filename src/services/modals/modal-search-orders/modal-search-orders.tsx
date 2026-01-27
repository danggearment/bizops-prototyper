import { AllOrder_Type } from "@/services/connect-rpc/types"
import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  RadioGroup,
  RadioGroupItem,
  TextareaField,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { InfoIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useSearchOrders } from "./modal-search-orders-store"

const ORDER_TYPE_LABELS: Record<string, string> = {
  [AllOrder_Type.SALE]: "Sale",
  [AllOrder_Type.DRAFT]: "Draft",
  [AllOrder_Type.ERROR]: "Error",
  [AllOrder_Type.ALL]: "All",
}

export function ModalSearchOrders() {
  const {
    open,
    actions,
    onConfirm,
    value: defaultValue,
    maxLength,
    errorMessage,
    type,
    setType,
  } = useSearchOrders()

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState(defaultValue)

  const handleConfirm = async () => {
    const isAsync = onConfirm.constructor.name === "AsyncFunction"
    const text =
      value
        .replace(/[\s\n]+/g, ",")
        .replace(/,{2,}/g, ",") // remove multiple consecutive commas to a single comma
        .replace(/,+$/, "") || ""
    try {
      if (isAsync) {
        setLoading(true)
        await onConfirm(text, type)
      } else {
        onConfirm(text, type)
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
      setType(type)
    }
  }, [open])

  const countNumber = countText(handleFormat(value || ""))
  const hasError = countNumber > maxLength

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Search orders</span>
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
        <div className="space-y-4">
          <div className="space-y-2">
            <RadioGroup
              value={type.toString()}
              onValueChange={(v) => setType(Number(v) as AllOrder_Type)}
              className="flex gap-6"
            >
              {[
                AllOrder_Type.ALL,
                AllOrder_Type.SALE,
                AllOrder_Type.DRAFT,
                AllOrder_Type.ERROR,
              ].map((type) => (
                <div key={type} className="flex items-center gap-2">
                  <RadioGroupItem
                    value={type.toString()}
                    id={`order-type-${type}`}
                  />
                  <label htmlFor={`order-type-${type}`}>
                    {ORDER_TYPE_LABELS[type] || type}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div>
            <TextareaField
              ref={textareaRef}
              rows={10}
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
              }}
              placeholder={`Enter multiple search terms separated by commas (,), spaces ( ), or new lines (↵). Each term will be treated as a separate search item.`}
              error={
                hasError
                  ? errorMessage
                    ? errorMessage
                    : "Max length is " + maxLength
                  : undefined
              }
            />
            <div className="flex justify-end items-center">
              <div
                className={`text-right text-foreground text-sm font-normal ${hasError ? "text-error" : ""}`}
              >{`${countNumber}/${maxLength}`}</div>
            </div>
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
