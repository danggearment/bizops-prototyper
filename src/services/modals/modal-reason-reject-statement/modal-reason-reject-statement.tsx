import {
  ReasonRejectStatement,
  ReasonRejectStatementSchema,
} from "@/schemas/schemas/payment"
import { useQueryFinance } from "@/services/connect-rpc/transport"
import { RejectReason, RejectReasonType } from "@/services/connect-rpc/types"
import { staffListRejectReason } from "@gearment/nextapi/api/payment/v1/payment_admin-PaymentAdminAPI_connectquery"
import {
  Button,
  CheckboxField,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  RadioGroup,
  RadioGroupItem,
  TextareaField,
} from "@gearment/ui3"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useMemo, useState } from "react"
import { Controller, Form, useForm } from "react-hook-form"
import { useRejectReasonStatementModal } from "./modal-reason-reject-statement-store"

export const ModalReasonRejectStatement = () => {
  const { open, onClose, onConfirm } = useRejectReasonStatementModal()
  const [customReason, setCustomReason] = useState<RejectReason>()

  const form = useForm<ReasonRejectStatement>({
    resolver: zodResolver(ReasonRejectStatementSchema),
    mode: "onChange",
  })

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.reset()
      form.clearErrors()
    }
  }, [open, form])

  const { data: dataRejectReason } = useQueryFinance(
    staffListRejectReason,
    {
      type: RejectReasonType.CREDIT_STATEMENT,
    },
    {
      enabled: open,
    },
  )

  const reasonList = useMemo(() => {
    if (!dataRejectReason?.data) return []
    const { categories = [], data = [] } = dataRejectReason
    const grouped = data.reduce<Record<string, typeof data>>((acc, reason) => {
      if (reason.isCustom) {
        setCustomReason(reason)
        return acc
      }
      ;(acc[reason.categoryId] ||= []).push(reason)
      return acc
    }, {})

    return categories.reduce<
      {
        category_id: string
        category_name: string
        reasons: typeof data
        order: number
      }[]
    >((acc, cat) => {
      const catReasons = grouped[cat.categoryId] ?? []
      if (catReasons.length > 0) {
        acc.push({
          category_id: cat.categoryId,
          category_name: cat.categoryName,
          reasons: catReasons,
          order: acc.length + 1,
        })
      }
      return acc
    }, [])
  }, [dataRejectReason])

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = async (values: ReasonRejectStatement) => {
    if (values.reasonId === customReason?.rejectReasonId) {
      if (!values.customReason || values.customReason.trim().length < 5) {
        form.setError("customReason", {
          type: "manual",
          message: "Custom reason must be at least 5 characters long.",
        })
        return
      }
    }
    onConfirm(values)
  }

  const reasonId = form.watch("reasonId")

  useEffect(() => {
    if (reasonId === customReason?.rejectReasonId) {
      form.trigger("customReason")
    } else {
      form.clearErrors("customReason")
    }
  }, [reasonId, customReason?.rejectReasonId, form])

  const handleChangeReason = (value: string) => {
    const findReason = dataRejectReason?.data?.find(
      (reason) => reason.rejectReasonId === value,
    )

    if (value === customReason?.rejectReasonId) {
      form.setValue("customReason", undefined)
    } else {
      form.setValue("customReason", findReason?.reason)
    }
  }

  return (
    <Dialog modal open={open} onOpenChange={handleClose}>
      <DialogContent className="min-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-center gap-2 text-xl">
            Reason for rejection
            <p className="text-sm text-gray-500 font-normal">
              Please provide a valid reason to proceed with rejecting the
              payment approval
            </p>
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <FormField
            control={form.control}
            name="reasonId"
            render={({ field }) => (
              <div>
                <RadioGroup
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value)
                    handleChangeReason(value)
                  }}
                  className="space-y-4 mb-4"
                >
                  {reasonList.map((reason) => (
                    <div key={reason.category_id}>
                      <div className="flex items-center pb-[10px]">
                        <span className="mr-2">
                          {reason.order}. {reason.category_name}
                        </span>
                        <div className="flex-1 border-b"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {reason.reasons.map((option) => (
                          <label
                            className="flex gap-2.5 cursor-pointer px-4 py-2 bg-gray-100 rounded-full items-center "
                            key={option.rejectReasonId}
                          >
                            <RadioGroupItem value={option.rejectReasonId} />
                            <p>{option.reason}</p>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </RadioGroup>
                <div>
                  <label
                    htmlFor={customReason?.rejectReasonId}
                    className="flex gap-2.5 py-3 items-center"
                    key={customReason?.rejectReasonId}
                  >
                    <CheckboxField
                      {...field}
                      name={field.name}
                      id={customReason?.rejectReasonId}
                      checked={field.value == customReason?.rejectReasonId}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange(customReason?.rejectReasonId)
                          handleChangeReason(customReason?.rejectReasonId || "")
                        } else {
                          field.onChange("")
                          form.setValue("customReason", undefined)
                        }
                      }}
                      value={customReason?.rejectReasonId}
                    />
                    <p>{customReason?.reason}</p>
                  </label>
                </div>
              </div>
            )}
          />

          {reasonId === customReason?.rejectReasonId && (
            <Controller
              control={form.control}
              name="customReason"
              render={({ field }) => {
                return (
                  <TextareaField
                    placeholder="Let us know your reason... (minimum 5 characters)"
                    {...field}
                    onBlur={(e) => field.onChange(e.target.value.trim())}
                    error={form.formState.errors.customReason?.message}
                  />
                )
              }}
            />
          )}

          <DialogFooter className="flex gap-4 mt-6">
            <Button onClick={handleClose} className="flex-1 bg-gray-400">
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(handleSubmit)}
              className="flex-1"
            >
              Confirm
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
