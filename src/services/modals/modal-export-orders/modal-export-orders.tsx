// modal-export-orders.tsx
import { formatNumber, formatTextMany } from "@gearment/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  RadioGroup,
  RadioGroupItem,
} from "@gearment/ui3"

import { useQueryPod } from "@/services/connect-rpc/transport"
import {
  staffCountOrderForExport,
  staffCountOrderLineItemForExport,
} from "@gearment/nextapi/api/pod/v1/admin_api-OrderAdminAPI_connectquery"
import { Alert, AlertDescription, Button } from "@gearment/ui3"
import { useMemo } from "react"
import {
  EXPORT_CATEGORY,
  EXPORT_MODAL_CONTENT,
  ExportOrderSchema,
  ExportOrdersType,
  ExportType,
  useExportOrders,
} from "./modal-export-orders"

export const ModalExportOrders = () => {
  const { open, onClose, filter, type, onSave } = useExportOrders()

  const modalContent = EXPORT_MODAL_CONTENT[type]

  const { data: exportData } = useQueryPod(
    type === EXPORT_CATEGORY.ORDER
      ? staffCountOrderForExport
      : staffCountOrderLineItemForExport,
    {
      filter: filter.filter,
      search: filter.search,
    },
    {
      select: (data) => ({
        totalExport: data.total,
        totalExportFiltered: data.totalFiltered,
        enabled: open,
      }),
    },
  )

  const values = useMemo(() => {
    return {
      exportType:
        exportData?.totalExport !== exportData?.totalExportFiltered
          ? ExportType.FILTERED_RECORDS
          : ExportType.ALL_RECORDS,
    }
  }, [exportData])

  const form = useForm<ExportOrdersType>({
    values,
    resolver: zodResolver(ExportOrderSchema),
  })

  const loading = form.formState.isSubmitting

  const EXPORT_OPTIONS = [
    {
      value: ExportType.ALL_RECORDS,
      text: modalContent.allRecordsLabel,
      description: (
        <>
          {modalContent.allRecordsDescription}{" "}
          <>
            <strong>
              • {Number(exportData?.totalExport)}{" "}
              {formatTextMany(type, Number(exportData?.totalExport), false)}
            </strong>{" "}
            selected.
          </>
        </>
      ),
    },
    {
      value: ExportType.FILTERED_RECORDS,
      text: modalContent.filteredRecordsLabel,
      description: (
        <>
          {modalContent.filteredRecordsDescription}{" "}
          <>
            <strong>
              • {formatNumber(Number(exportData?.totalExportFiltered))}{" "}
              {formatTextMany(
                type,
                Number(exportData?.totalExportFiltered),
                false,
              )}
            </strong>{" "}
            selected.
          </>
        </>
      ),
    },
  ]

  const handleSubmit = async (values: ExportOrdersType) => {
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
          <Alert className="mb-1.5" variant="default">
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
                Export
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
