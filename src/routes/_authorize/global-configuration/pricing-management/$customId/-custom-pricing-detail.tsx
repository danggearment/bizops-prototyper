import {
  CreatePricingRuleSchema,
  CreatePricingRuleType,
} from "@/schemas/schemas/pricing"
import { useMutationPod } from "@/services/connect-rpc/transport"
import {
  StaffGetPriceCustomRuleDetailResponse_PriceCustomRuleDetail,
  StaffListGMProductForCustomPriceFilteringResponse_Product,
} from "@/services/connect-rpc/types"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import { queryClient } from "@/services/react-query"
import { formatDateForCallApi } from "@/utils"
import {
  staffGetPriceCustomRuleDetail,
  staffGetProductDetail,
  staffListProductPriceCustom,
  staffListProductVariant,
  staffUpdateProductPriceCustom,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { Button, cn, Form, toast } from "@gearment/ui3"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { useEffect, useRef } from "react"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import BasicInformation from "../-components/basic-information/basic-information"
import PricingConfiguration from "../-components/pricing-configuration/pricing-configuration"
import { PricingRuleDetailMode, VariantState } from "../-helper"
import { usePricingRule } from "../-pricing-rule-context"

type EditFormProps = {
  customId: string
  defaultValues?: CreatePricingRuleType
  initialProducts?: {
    product: StaffListGMProductForCustomPriceFilteringResponse_Product[]
    variants: VariantState[]
  }[]
  ruleDetail: StaffGetPriceCustomRuleDetailResponse_PriceCustomRuleDetail
  mode: PricingRuleDetailMode
}

export default function CustomPricingDetail({
  customId,
  defaultValues,
  initialProducts,
  ruleDetail,
  mode,
}: EditFormProps) {
  const form = useForm<CreatePricingRuleType>({
    defaultValues,
    resolver: zodResolver(CreatePricingRuleSchema),
  })
  const { handleSubmit } = form
  const pricingRule = usePricingRule()
  const navigate = useNavigate()
  const hasJustUpdatedRef = useRef(false)
  const [setOpenConfirm, closeConfirm] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues)
    }
  }, [defaultValues, form, ruleDetail])

  const mutationUpdate = useMutationPod(staffUpdateProductPriceCustom, {
    onSuccess: async () => {
      await handleRefetch()
      hasJustUpdatedRef.current = true
      pricingRule.clear()
      toast({
        variant: "success",
        title: "Update pricing rule successfully",
        description: "Your changes have been saved",
      })
      navigate({
        to: "/global-configuration/pricing-management/$customId",
        params: { customId },
        search: { mode: PricingRuleDetailMode.DETAIL },
      })
      closeConfirm()
    },
    onError: (error) => {
      toast({
        variant: "error",
        title: "Update pricing rule failed",
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

    setOpenConfirm({
      title: "Confirm update pricing rule",
      description:
        "Are you sure you want to update this pricing rule? This action cannot be undone.",
      confirmText: "Update",
      cancelText: "Cancel",
      onConfirm: async () => {
        const data = pricingRule.buildProductPriceCustomDataForUpdate()
        await mutationUpdate.mutateAsync({
          customId,
          startTime: formatDateForCallApi(values.dateRange.from, true),
          endTime: formatDateForCallApi(values.dateRange.to, true),
          internalNote: values.internalNote || "",
          data,
          deleteProductPriceCustomProductIds: pricingRule.deletedProductIds,
        })
      },
    })
  }

  const isDetail = mode === PricingRuleDetailMode.DETAIL

  const loading = mutationUpdate.isPending
  const disabled = loading

  const handleRefetch = async () => {
    await Promise.allSettled([
      queryClient.invalidateQueries({
        queryKey: [
          staffGetPriceCustomRuleDetail.service.typeName,
          staffGetPriceCustomRuleDetail.name,
        ],
      }),
      queryClient.invalidateQueries({
        queryKey: [
          staffListProductPriceCustom.service.typeName,
          staffListProductPriceCustom.name,
        ],
      }),
      queryClient.invalidateQueries({
        queryKey: [
          staffGetProductDetail.service.typeName,
          staffGetProductDetail.name,
        ],
      }),
      queryClient.invalidateQueries({
        queryKey: [
          staffListProductVariant.service.typeName,
          staffListProductVariant.name,
        ],
      }),
    ])
  }

  const handleCancel = async () => {
    if (hasJustUpdatedRef.current) {
      await handleRefetch()
      hasJustUpdatedRef.current = false
    }
    navigate({
      to: "/global-configuration/pricing-management/$customId",
      params: { customId },
      search: { mode: PricingRuleDetailMode.DETAIL },
    })
    closeConfirm()
    form.reset(defaultValues)
    pricingRule.clear()
  }

  return (
    <div>
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <BasicInformation
              teamReadOnly
              defaultValue={{
                label: `${ruleDetail?.teamName} (${ruleDetail?.teamEmail})`,
                value: defaultValues?.teamId ?? "",
              }}
              mode={mode}
              customId={customId}
              createdBy={`${ruleDetail?.createdByName} (${ruleDetail?.createdByEmail ?? "without email"})`}
            />
            <PricingConfiguration
              initialProducts={initialProducts}
              mode={mode}
            />
            <div className="flex justify-end gap-x-4">
              <Button
                type="button"
                variant="outline"
                className={cn("w-40", isDetail && "hidden")}
                onClick={() =>
                  setOpenConfirm({
                    title: "Confirm",
                    description:
                      "Are you sure you want to cancel? All unsaved data will be reset.",
                    onConfirm: handleCancel,
                  })
                }
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={disabled}
                className={cn("w-40", isDetail && "hidden")}
              >
                Save changes
              </Button>
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  )
}
