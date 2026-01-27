import { useMemo } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { CreditCard, Users } from "lucide-react"
import { FormProvider, useForm } from "react-hook-form"

import {
  staffListPaymentMethodConfig,
  staffListSystemConfiguration,
  staffUpdateAutoApproveDepositRequestConfig,
} from "@gearment/nextapi/api/payment/v1/payment_admin-PaymentAdminAPI_connectquery"
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  LoadingCircle,
  Switch,
  toast,
} from "@gearment/ui3"

import {
  UpdateAutoApproveDepositConfigSchema,
  UpdateAutoApproveDepositConfigType,
} from "@/schemas/schemas/system-configuration"
import { useMutationFinance } from "@/services/connect-rpc/transport"
import { queryClient } from "@/services/react-query"

import { useSystemConfiguration } from "../-system-configuration-context"
import { PaymentMethodConfiguration } from "./payment-method-configuration"
import SelectTeamFilter from "./select-teams"

export default function AutoApproveDepositTab() {
  const {
    autoApproveDepositConfig,
    paymentMethodConfig,
    isLoadingFinance,
    isLoadingPaymentMethod,
  } = useSystemConfiguration()

  const whitelistTeamIds = useMemo(
    () =>
      autoApproveDepositConfig?.whitelistTeams?.map((team) => team.teamId) ||
      [],
    [autoApproveDepositConfig?.whitelistTeams],
  )

  const defaultPaymentMethods = useMemo(
    () =>
      paymentMethodConfig?.map((method) => ({
        methodCode: method.methodCode,
        enable: method.isAutoApproveDeposit ?? false,
      })) || [],
    [paymentMethodConfig],
  )

  const formValues = useMemo(
    () => ({
      applyToAllTeams: autoApproveDepositConfig?.applyToAllTeams || false,
      teamIds: whitelistTeamIds,
      paymentMethods: defaultPaymentMethods,
    }),
    [
      autoApproveDepositConfig?.applyToAllTeams,
      whitelistTeamIds,
      defaultPaymentMethods,
    ],
  )

  const form = useForm<UpdateAutoApproveDepositConfigType>({
    values: formValues,
    resolver: zodResolver(UpdateAutoApproveDepositConfigSchema),
  })

  const {
    formState: { isDirty, isSubmitting },
  } = form

  const mutation = useMutationFinance(
    staffUpdateAutoApproveDepositRequestConfig,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            staffListSystemConfiguration.service.typeName,
            staffListSystemConfiguration.name,
          ],
        })
        queryClient.invalidateQueries({
          queryKey: [
            staffListPaymentMethodConfig.service.typeName,
            staffListPaymentMethodConfig.name,
          ],
        })

        toast({
          variant: "success",
          title: "Success",
          description: "Auto approve deposit config updated successfully",
        })
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update auto approve deposit config",
        })
      },
    },
  )

  const onSubmit = async (values: UpdateAutoApproveDepositConfigType) => {
    const currentTeamIds = values.teamIds || []
    const newTeamIds = currentTeamIds.filter(
      (id) => !whitelistTeamIds.includes(id),
    )
    const removeTeamIds = whitelistTeamIds.filter(
      (id) => !currentTeamIds.includes(id),
    )

    await mutation.mutateAsync({
      applyToAllTeams: values.applyToAllTeams,
      newTeamIds,
      removeTeamIds,
      paymentMethods: values.paymentMethods || defaultPaymentMethods,
    })
  }

  if (isLoadingFinance || isLoadingPaymentMethod) {
    return (
      <div className="h-48 flex items-center justify-center">
        <LoadingCircle />
      </div>
    )
  }

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="space-y-4 bg-background rounded-md p-4 ">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 border p-4 rounded-lg">
                  <FormField
                    control={form.control}
                    name="applyToAllTeams"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex flex-col gap-1">
                            <p className="font-medium text-md flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              Apply to all teams
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Allow every team to auto-approve deposits.
                            </p>
                          </div>

                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(value) => field.onChange(value)}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />

                  <SelectTeamFilter />
                </div>
              </div>

              <div className="border p-4 rounded-lg">
                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <p className="font-semibold text-md">Payment methods</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Toggle auto-approve deposits by payment method.
                  </p>
                </div>
                <PaymentMethodConfiguration />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!isDirty || isSubmitting}
                  loading={isSubmitting}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </FormProvider>
  )
}
