import {
  CreatePricingRuleSchema,
  CreatePricingRuleType,
  ListPricingRuleSchema,
} from "@/schemas/schemas/pricing"
import { useMutationPod } from "@/services/connect-rpc/transport"
import { queryClient } from "@/services/react-query"
import { formatDateForCallApi } from "@/utils"
import {
  staffCreateProductPriceCustom,
  staffListPriceCustomRule,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { Button, Form, toast } from "@gearment/ui3"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "@tanstack/react-router"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { usePricingRule } from "../../-pricing-rule-context"
import BasicInformation from "../basic-information/basic-information"
import PricingConfiguration from "../pricing-configuration/pricing-configuration"

interface Props {
  defaultValues?: CreatePricingRuleType
}

export default function FormCreatePricingRule({ defaultValues }: Props) {
  const form = useForm<CreatePricingRuleType>({
    defaultValues: defaultValues,
    resolver: zodResolver(CreatePricingRuleSchema),
  })
  const navigate = useNavigate()

  const { handleSubmit } = form
  const pricingRule = usePricingRule()

  const mutationCreate = useMutationPod(staffCreateProductPriceCustom, {
    onSuccess: () => {
      navigate({
        to: "/global-configuration/pricing-management",
        search: ListPricingRuleSchema.parse({}),
      })
      queryClient.invalidateQueries({
        queryKey: [
          staffListPriceCustomRule.service.typeName,
          staffListPriceCustomRule.name,
        ],
      })
      toast({
        variant: "success",
        title: "Create pricing rule successfully",
        description: "You can now use the pricing rule",
      })
    },
    onError: (error) => {
      toast({
        variant: "error",
        title: "Create pricing rule failed",
        description: (
          <div
            dangerouslySetInnerHTML={{
              __html: error.rawMessage,
            }}
          ></div>
        ),
      })
    },
  })

  const onSubmit: SubmitHandler<CreatePricingRuleType> = async (values) => {
    if (!pricingRule.validateProductsBeforeSave()) return

    const data = pricingRule.buildProductPriceCustomData()
    await mutationCreate.mutateAsync({
      teamId: values.teamId,
      startTime: formatDateForCallApi(values.dateRange.from, true),
      endTime: formatDateForCallApi(values.dateRange.to, true),
      data,
      internalNote: values.internalNote || "",
    })
  }

  const loading = mutationCreate.isPending
  const disabled = loading

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <BasicInformation />
          <PricingConfiguration />
          <div className="flex justify-end gap-x-4">
            <Button variant="outline" className="w-40">
              <Link to="/global-configuration/pricing-management">Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="w-40"
              loading={loading}
              disabled={disabled}
            >
              Create
            </Button>
          </div>
        </form>
      </Form>
    </FormProvider>
  )
}
