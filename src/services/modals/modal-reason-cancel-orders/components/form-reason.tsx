import {
  ReasonCancelOrders,
  ReasonCancelOrdersSchema,
} from "@/schemas/schemas/all-orders"
import {
  OrderCancelReason,
  StaffListOrderCancelReasonResponse,
} from "@/services/connect-rpc/types"
import {
  Button,
  CheckboxField,
  DialogFooter,
  Form,
  FormField,
  RadioGroup,
  RadioGroupItem,
  TextareaField,
} from "@gearment/ui3"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"

export const FormReason = ({
  handleSubmit,
  defaultValues,
  data,
}: {
  handleSubmit: (data: ReasonCancelOrders) => void
  defaultValues: ReasonCancelOrders
  data?: StaffListOrderCancelReasonResponse
}) => {
  const form = useForm<ReasonCancelOrders>({
    values: defaultValues,
    resolver: zodResolver(ReasonCancelOrdersSchema),
  })
  const [customReason, setCustomReason] = useState<OrderCancelReason>()
  const reasonList = useMemo(() => {
    if (!data) return []
    const { categories = [], reasons = [] } = data
    const grouped = reasons.reduce<Record<string, typeof reasons>>(
      (acc, reason) => {
        if (reason.isCustom) {
          setCustomReason(reason)
          return acc
        }
        ;(acc[reason.categoryId] ||= []).push(reason)
        return acc
      },
      {},
    )

    return categories.reduce<
      {
        category_id: string
        category_name: string
        reasons: typeof reasons
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
  }, [data])
  const reasonId = form.watch("reasonId")
  console.log(form.formState.errors)
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          name="reasonId"
          render={({ field }) => (
            <div>
              <RadioGroup
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value)
                  form.setValue("customReason", undefined)
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
                          key={option.reasonId}
                        >
                          <RadioGroupItem value={option.reasonId} />
                          <p>{option.displayName}</p>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </RadioGroup>
              <div>
                <label
                  htmlFor={customReason?.reasonId}
                  className="flex gap-2.5 py-3 items-center"
                  key={customReason?.reasonId}
                >
                  <CheckboxField
                    {...field}
                    name={field.name}
                    id={customReason?.reasonId}
                    checked={field.value == customReason?.reasonId}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        field.onChange(customReason?.reasonId)
                      } else {
                        field.onChange("")
                      }
                    }}
                    value={customReason?.reasonId}
                  />
                  <p>{customReason?.displayName}</p>
                </label>
              </div>
            </div>
          )}
        />

        {reasonId === customReason?.reasonId && (
          <Controller
            control={form.control}
            name="customReason"
            render={({ field }) => {
              return (
                <TextareaField
                  placeholder="Let us know your reason..."
                  {...field}
                  onBlur={(e) => field.onChange(e.target.value.trim())}
                  error={form.formState.errors.customReason?.message}
                />
              )
            }}
          />
        )}

        <DialogFooter>
          <Button type="submit" className="w-full mt-6">
            Continue
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
