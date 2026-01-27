import {
  SyncCatalogFormData,
  SyncCatalogSchema,
} from "@/schemas/schemas/product"
import { useMutationMigration } from "@/services/connect-rpc/transport"
import { Migration_DataType } from "@/services/connect-rpc/types"
import { appTimezone, formatDateForCallApi } from "@/utils/format-date.ts"
import { staffCreateMigrationJob } from "@gearment/nextapi/api/migration/v1/migration-MigrationOperationAPI_connectquery"
import {
  Button,
  DateRangeDatePicker,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  SelectDateRange,
  toast,
} from "@gearment/ui3"
import { zodResolver } from "@hookform/resolvers/zod"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useSyncCatalogModal } from "./modal-sync-catalog-store"

export function SyncCatalogModal() {
  const {
    open,
    onConfirm,
    title,
    description,
    OK = "Submit",
    onClose,
  } = useSyncCatalogModal((state) => ({
    open: state.open,
    onClose: state.onClose,
    title: state.title,
    description: state.description,
    onConfirm: state.onConfirm,
    OK: state.OK,
  }))

  const [loading, setLoading] = useState(false)

  const form = useForm<SyncCatalogFormData>({
    defaultValues: {
      from: undefined,
      to: undefined,
    },
    resolver: zodResolver(SyncCatalogSchema),
  })

  const mutation = useMutationMigration(staffCreateMigrationJob, {
    onSuccess: () => {
      toast({
        title: "Sync catalog success",
        description: "Sync catalog successfully",
      })
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Sync catalog failed",
        description: err.rawMessage,
      })
    },
  })

  const onSubmit: SubmitHandler<SyncCatalogFormData> = async (data) => {
    try {
      setLoading(true)

      const startTime = formatDateForCallApi(data.from)
      const endTime = formatDateForCallApi(data.to, "endOfDay")

      await mutation.mutateAsync({
        cusIds: [0],
        dataTypes: [Migration_DataType.PLATFORM_CATALOG],
        rangeFrom: startTime,
        rangeTo: endTime,
      })

      await onConfirm()

      form.reset()
      onClose()
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit form. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSetDateRange = (dateRange: DateRangeDatePicker | undefined) => {
    if (dateRange && dateRange.from && dateRange.to) {
      form.setValue("from", dateRange.from)
      form.setValue("to", dateRange.to)
    } else {
      form.unregister("from")
      form.unregister("to")
    }
  }

  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title ?? "Sync catalog"}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{description}</DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Date Range</label>
              <div className="w-full">
                <SelectDateRange
                  from={
                    form.watch("from")
                      ? dayjs(form.watch("from")).startOf("D").toDate()
                      : undefined
                  }
                  to={
                    form.watch("to")
                      ? dayjs(form.watch("to")).endOf("D").toDate()
                      : undefined
                  }
                  onChange={handleSetDateRange}
                  timezone={appTimezone.getTimezone()}
                />
                {(form.formState.errors.from || form.formState.errors.to) && (
                  <p className="mt-1 text-sm text-red-500">
                    {form.formState.errors.from?.message}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                size={"sm"}
                variant={"secondary"}
                onClick={() => {
                  form.reset()
                  onClose()
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size={"sm"}
                disabled={loading}
                loading={loading}
                variant="default"
              >
                {OK}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
