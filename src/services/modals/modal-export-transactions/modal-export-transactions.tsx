// modal-export-transactions.tsx
import { formatNumber, formatTextMany } from "@gearment/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import {
  EXPORT_CATEGORY,
  EXPORT_MODAL_CONTENT,
  ExportTransactionsSchema,
  ExportTransactionsType,
  ExportType,
  useExportTransactions,
} from "./modal-export-transactions"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  RadioGroup,
  RadioGroupItem,
} from "@gearment/ui3"

import { Alert, AlertDescription, Button } from "@gearment/ui3"

export const ModalExportTransactions = () => {
  const { open, onClose, onSave, allRecordsLength, filteredLength, type } =
    useExportTransactions()

  const modalContent = EXPORT_MODAL_CONTENT[type]

  const form = useForm<ExportTransactionsType>({
    defaultValues: {
      exportType: ExportType.ALL_RECORDS,
    },
    resolver: zodResolver(ExportTransactionsSchema),
  })

  const loading = form.formState.isSubmitting

  const EXPORT_OPTIONS = [
    {
      value: ExportType.ALL_RECORDS,
      text: modalContent.allRecordsLabel,
      description: (
        <>
          {modalContent.allRecordsDescription}{" "}
          {type === EXPORT_CATEGORY.TRANSACTION && (
            <>
              <strong>
                • {formatNumber(allRecordsLength)}{" "}
                {formatTextMany(type, allRecordsLength, false)}
              </strong>{" "}
              selected.
            </>
          )}
        </>
      ),
    },
    {
      value: ExportType.FILTERED_RECORDS,
      text: modalContent.filteredRecordsLabel,
      description: (
        <>
          {modalContent.filteredRecordsDescription}{" "}
          {type === EXPORT_CATEGORY.TRANSACTION && (
            <>
              <strong>
                • {formatNumber(filteredLength)}{" "}
                {formatTextMany(type, filteredLength, false)}
              </strong>{" "}
              selected.
            </>
          )}
        </>
      ),
    },
  ]

  const handleSubmit = async (values: ExportTransactionsType) => {
    try {
      if (onSave.constructor.name === "AsyncFunction") {
        await onSave(values)
      } else {
        onSave(values)
      }
    } finally {
      if (onSave.constructor.name === "AsyncFunction") {
        /* empty */
      }
    }
  }
  useEffect(() => {
    console.log("open : ", open)
  }, [open])
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{modalContent.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Controller
            name="exportType"
            control={form.control}
            render={({ field }) => (
              <RadioGroup
                className="mb-4"
                value={field.value.toString()}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <div className="space-y-6">
                  {EXPORT_OPTIONS.map((option) => (
                    <label
                      className="flex gap-2.5 cursor-pointer"
                      key={option.value.toString()}
                    >
                      <RadioGroupItem value={option.value.toString()} />
                      <div className="flex-1">
                        <p className=" body-medium font-semibold">
                          {option.text}
                        </p>
                        <p className="body-small">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            )}
          />
          <Alert className="mb-1.5">
            <AlertDescription>
              Please note: Large export files may take more time to generate and
              will be sent to your email when ready.
            </AlertDescription>
          </Alert>

          <DialogFooter>
            <div className="flex justify-end gap-3 mt-[24px]">
              <Button className="shadow " variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} loading={loading}>
                Export XLSX
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
