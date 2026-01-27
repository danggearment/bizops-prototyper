import {
  Button,
  CheckboxField,
  DialogFooter,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  RadioGroup,
  RadioGroupItem,
  TextareaField,
} from "@gearment/ui3"
import { Controller, useFormContext } from "react-hook-form"

import { RefundFormType } from "@/schemas/schemas/payment"
import { ApproveReason, ReasonCategory } from "@/services/connect-rpc/types"

interface SelectReasonStepProps {
  onNext: () => void
  categories: ReasonCategory[]
  reasonsByCategoryId: Map<string, ApproveReason[]>
  otherReasonId: string
}

export default function SelectReasonStep({
  onNext,
  categories,
  reasonsByCategoryId,
  otherReasonId,
}: SelectReasonStepProps) {
  const form = useFormContext<RefundFormType>()
  const { control, formState } = form

  const loading = formState.isSubmitting

  const checkAnotherReason = (value: boolean) => {
    if (value) {
      form.setValue("isOtherReason", true)
      form.setValue("reasonId", otherReasonId)
    } else {
      form.setValue("isOtherReason", false)
      form.setValue("reasonId", "")
    }
  }

  const handleSubmit = async () => {
    onNext()
  }

  const isAnotherReason = form.watch("isOtherReason")

  return (
    <>
      <DialogTitle className="space-y-4 text-center">
        <p>Reason for refund</p>
        <p className="body-small text-center text-foreground">
          Please provide a valid reason to proceed with the cancellation.
        </p>
      </DialogTitle>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Controller
            name="reasonId"
            control={control}
            render={({ field }) => (
              <>
                <RadioGroup
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value)
                    form.setValue("customReason", "")
                    form.setValue("isOtherReason", false)
                  }}
                >
                  {categories
                    .filter((category) => {
                      const reasons =
                        reasonsByCategoryId.get(category.categoryId) || []
                      return reasons.length > 0
                    })
                    .map((category, index) => {
                      const reasons =
                        reasonsByCategoryId.get(category.categoryId) || []
                      return (
                        <div key={category.categoryId}>
                          <div className="flex items-center">
                            <FormLabel className="mr-2">
                              {index + 1}. {category.categoryName}
                            </FormLabel>
                            <div className="flex-1 border-b"></div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 p-4">
                            {reasons.map((reason) => (
                              <label
                                className="flex gap-2.5 cursor-pointer body-small px-4 py-2 bg-gray-100 rounded-full items-center "
                                key={reason.approveReasonId}
                              >
                                <RadioGroupItem
                                  value={reason.approveReasonId}
                                />
                                <p>{reason.reason}</p>
                              </label>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                </RadioGroup>
                <div>
                  <FormField
                    control={control}
                    name="isOtherReason"
                    render={({ field }) => (
                      <FormItem className="flex gap-2 items-center mb-2">
                        <FormControl>
                          <CheckboxField
                            {...field}
                            value={otherReasonId}
                            checked={field.value}
                            onCheckedChange={(value: boolean) => {
                              checkAnotherReason(value)
                            }}
                          />
                        </FormControl>
                        <FormLabel>Other reason</FormLabel>
                      </FormItem>
                    )}
                  />
                  {isAnotherReason && (
                    <FormField
                      control={control}
                      name="customReason"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <TextareaField
                              placeholder="Let us know your reason..."
                              {...field}
                              onBlur={(e) =>
                                field.onChange(e.target.value.trim())
                              }
                              error={formState.errors.customReason?.message}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </>
            )}
          />
          {formState.errors.reasonId && (
            <p className="text-destructive text-sm py-1">
              {formState.errors.reasonId.message}
            </p>
          )}
          <DialogFooter className="mt-4">
            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              className="w-full"
            >
              Continue
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}
