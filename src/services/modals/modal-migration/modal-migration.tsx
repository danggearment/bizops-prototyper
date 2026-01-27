import {
  Button,
  ComboboxMulti,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  SelectDateRange,
  TextareaField,
} from "@gearment/ui3"
import { useEffect, useRef, useState } from "react"
import { useMigrationModal } from "./modal-migration-store"

import { MigrationDataTypeOptions } from "@/constants/migration"
import { Migration_DataType } from "@/services/connect-rpc/types"
import { appTimezone } from "@/utils/format-date.ts"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@gearment/ui3"
import { zodResolver } from "@hookform/resolvers/zod"
import { endOfDay, startOfDay, subDays } from "date-fns"
import dayjs from "dayjs"
import { useForm } from "react-hook-form"
import { z } from "zod"

const MigrationSchema = z.object({
  dataTypes: z
    .array(z.nativeEnum(Migration_DataType))
    .min(1, "Migration data types is required"),
  cusIds: z.string().min(1, "Customer IDs is required"),
  time: z.object({
    rangeFrom: z.string().optional(),
    rangeTo: z.string().optional(),
  }),
})

export type MigrationType = z.infer<typeof MigrationSchema>

const MAX_CUS_IDS_LENGTH = 1000

export function ModalMigration() {
  const { open, onClose, onCreate } = useMigrationModal((state) => ({
    open: state.open,
    onClose: state.onClose,
    onCreate: state.onCreate,
  }))
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const defaultFrom = startOfDay(subDays(new Date(), 30))
  const defaultTo = endOfDay(subDays(new Date(), 1))

  const form = useForm<MigrationType>({
    defaultValues: {
      dataTypes: [],
      cusIds: "",
      time: {
        rangeFrom: defaultFrom.toISOString(),
        rangeTo: defaultTo.toISOString(),
      },
    },
    resolver: zodResolver(MigrationSchema),
  })

  const onSubmit = async (values: MigrationType) => {
    setLoading(true)
    try {
      await onCreate(values)
    } finally {
      setLoading(false)
    }
  }

  const countText = (text: string) => {
    const items = text.split(/[\n,]/).filter((item) => item.trim())
    return items.length
  }

  const handleInputChange = (value: string) => {
    const filteredValue = value.replace(/[^0-9\n\s,]/g, "")
    return filteredValue
  }

  useEffect(() => {
    if (open) {
      form.reset()
    }
  }, [open])

  const watchedCusIds = form.watch("cusIds")
  const countNumber = countText(watchedCusIds || "")
  const hasError = countNumber > MAX_CUS_IDS_LENGTH

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Migration Job</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to create a migration job? This action will
          start the migration process for the selected customer data.
        </DialogDescription>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="cusIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer IDs</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <TextareaField
                        rows={10}
                        {...field}
                        ref={textareaRef}
                        value={field.value}
                        onChange={(e) => {
                          const filteredValue = handleInputChange(
                            e.target.value,
                          )
                          field.onChange(filteredValue)
                        }}
                        error={
                          hasError
                            ? "Max length is " + MAX_CUS_IDS_LENGTH
                            : undefined
                        }
                        className="min-h-[180px] max-h-[262px]"
                        placeholder="Enter customer IDs (numbers only) separated by new lines (↵) or commas (,). Each ID will be treated as a separate customer."
                      />
                      <div
                        className={`text-right text-foreground text-sm ${hasError ? "text-error" : ""}`}
                      >{`${countNumber}/${MAX_CUS_IDS_LENGTH}`}</div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dataTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data types</FormLabel>
                  <FormControl>
                    <ComboboxMulti
                      value={field.value.map((item) => item.toString())}
                      onChange={(values) => {
                        field.onChange(values.map((value) => Number(value)))
                      }}
                      className="max-w-[462px]"
                      placeholder="Select type"
                      options={MigrationDataTypeOptions}
                      modal
                      portal={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date Range</FormLabel>
                  <FormControl>
                    <SelectDateRange
                      from={
                        field.value?.rangeFrom
                          ? dayjs(field.value.rangeFrom).startOf("D").toDate()
                          : undefined
                      }
                      to={
                        field.value?.rangeTo
                          ? dayjs(field.value.rangeTo).endOf("D").toDate()
                          : undefined
                      }
                      onChange={(value) => {
                        field.onChange({
                          rangeFrom: dayjs(value?.from)
                            .startOf("D")
                            .toISOString(),
                          rangeTo: dayjs(value?.to).endOf("D").toISOString(),
                        })
                      }}
                      timezone={appTimezone.getTimezone()}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={loading}
                  loading={loading}
                >
                  Migrate
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
