import { useFieldArray, useFormContext } from "react-hook-form"

import {
  cn,
  FormControl,
  FormField,
  FormItem,
  LoadingCircle,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"

import Image from "@/components/common/image/image"
import { UpdateAutoApproveDepositConfigType } from "@/schemas/schemas/system-configuration"

import { useSystemConfiguration } from "../-system-configuration-context"

export function PaymentMethodConfiguration() {
  const { paymentMethodConfig, isLoadingPaymentMethod } =
    useSystemConfiguration()

  const { control } = useFormContext<UpdateAutoApproveDepositConfigType>()

  const { fields } = useFieldArray({
    control,
    name: "paymentMethods",
  })

  if (isLoadingPaymentMethod) {
    return (
      <div className="h-24 flex items-center justify-center">
        <LoadingCircle />
      </div>
    )
  }

  if (!paymentMethodConfig?.length) {
    return (
      <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
        No payment methods found.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {fields.map((field, index) => (
        <FormField
          key={field.id}
          control={control}
          name={`paymentMethods.${index}.enable`}
          render={({ field: { value, onChange } }) => {
            const method = paymentMethodConfig?.find(
              (method) => method.methodCode === field.methodCode,
            )
            if (!method) {
              return <></>
            }
            return (
              <FormItem>
                <FormControl>
                  <div
                    key={method.methodCode}
                    className="flex items-start justify-between gap-4 p-3 rounded-lg border border-border bg-secondary/10"
                  >
                    <div className="flex items-center gap-3">
                      {method.iconUrl && (
                        <Image
                          url={method.iconUrl}
                          height={24}
                          width={100}
                          responsive="w"
                          className={cn(
                            !method.isDepositAllowed && "opacity-50",
                          )}
                        />
                      )}
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <Switch
                            className="cursor-pointer mt-1"
                            checked={value}
                            onCheckedChange={(value) => {
                              onChange(value)
                            }}
                            disabled={!method.isDepositAllowed}
                          />
                        </div>
                      </TooltipTrigger>
                      {!method.isDepositAllowed && (
                        <TooltipContent>
                          Auto-approve deposits is not allowed for this method.
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </div>
                </FormControl>
              </FormItem>
            )
          }}
        />
      ))}
    </div>
  )
}
