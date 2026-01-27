import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  RadioGroup,
  RadioGroupItem,
  TextareaField,
} from "@gearment/ui3"
import { useMemo, useState } from "react"
import { useOnHoldOrderModal } from "./modal-on-hold-orders-store"

import { useQueryPod } from "@/services/connect-rpc/transport"
import { staffListOrderOnHoldReason } from "@gearment/nextapi/api/pod/v1/admin_api-OrderAdminAPI_connectquery"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@gearment/ui3"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { groupReasons } from "./-helper"

const MAX_NOTES_LENGTH = 500
const ROWS_NOTES = 4

const OnHoldOrdersSchema = z.object({
  reason: z
    .string()
    .min(1, "Notes is required")
    .max(
      MAX_NOTES_LENGTH,
      `Notes must be at most ${MAX_NOTES_LENGTH} characters`,
    )
    .optional()
    .or(z.literal("")),
  reasonId: z
    .string()
    .min(
      1,
      "Please provide valid reason (minimum 1 character) to proceed with putting the order On-Hold",
    ),
})

export type OnHoldOrdersType = z.infer<typeof OnHoldOrdersSchema>

export function ModalOnHoldOrders() {
  const { open, onSave, onClose, title, description, onHoldType } =
    useOnHoldOrderModal((state) => ({
      open: state.open,
      onSave: state.onSave,
      onClose: state.onClose,
      title: state.title,
      description: state.description,
      onHoldType: state.onHoldType,
    }))

  const [loading, setLoading] = useState(false)

  const { data } = useQueryPod(
    staffListOrderOnHoldReason,
    {
      onHoldType: onHoldType,
    },
    {
      enabled: !!open,
      select: (data) => {
        return {
          reasons: data.reasons,
          categories: data.categories,
        }
      },
    },
  )

  const form = useForm<OnHoldOrdersType>({
    resolver: zodResolver(OnHoldOrdersSchema),
    mode: "onChange",
    defaultValues: {
      reason: "",
      reasonId: "",
    },
  })

  const watchReasonId = form.watch("reasonId")
  const watchReason = form.watch("reason")

  const groupedReasons = useMemo(() => {
    if (!data?.reasons || !data?.categories) return []
    return groupReasons(data.reasons, data.categories)
  }, [data])

  const selectedReason = useMemo(() => {
    if (!data?.reasons) return undefined
    return data.reasons.find((r) => r.reasonId === watchReasonId)
  }, [data, watchReasonId])

  const isNotesRequired = selectedReason?.isCustom

  const disabled =
    loading ||
    !form.formState.isValid ||
    !watchReasonId ||
    (isNotesRequired && !watchReason)

  const handleConfirm = async (values: OnHoldOrdersType) => {
    setLoading(true)
    try {
      if (onSave.constructor.name === "AsyncFunction") {
        await onSave({
          ...values,
          reason: values.reason || selectedReason?.displayName,
        })
      } else {
        onSave(values)
      }
    } finally {
      if (onSave.constructor.name === "AsyncFunction") {
        setLoading(false)
      }
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{description}</DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleConfirm)}>
            <div className="mb-4">
              <FormField
                control={form.control}
                name="reasonId"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormLabel className="text-md font-medium">
                      Reason
                    </FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2">
                        <RadioGroup
                          value={field.value.toString()}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          {groupedReasons.map((group) => (
                            <div key={group.group} className="mb-2">
                              <div className="font-medium mb-1">
                                {group.group}
                              </div>
                              <div className="flex flex-col gap-1 pl-2">
                                {group.reasons.map((reason) => (
                                  <label
                                    key={reason.reasonId}
                                    className="flex items-center gap-2 cursor-pointer"
                                  >
                                    <RadioGroupItem value={reason.reasonId} />
                                    <span className="text-foreground/70">
                                      {reason.displayName}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </FormControl>
                    {formState.errors.reasonId && (
                      <div className="text-destructive text-xs mt-1">
                        {formState.errors.reasonId.message}
                      </div>
                    )}
                  </FormItem>
                )}
              />
            </div>
            {isNotesRequired && (
              <FormField
                control={form.control}
                name="reason"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormLabel className="text-md font-medium">
                      Notes <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <TextareaField
                        {...field}
                        placeholder="Enter your reason"
                        minLength={1}
                        rows={ROWS_NOTES}
                        maxLength={MAX_NOTES_LENGTH}
                        error={formState.errors.reason?.message}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            <DialogFooter>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={disabled}
                  className="cursor-pointer"
                  loading={loading}
                  type="submit"
                >
                  Confirm
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
