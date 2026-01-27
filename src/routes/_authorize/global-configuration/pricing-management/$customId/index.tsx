import {
  CreatePricingRuleType,
  DetailPricingRuleSchema,
} from "@/schemas/schemas/pricing"
import { useQueryPod } from "@/services/connect-rpc/transport"
import {
  GMProduct_TeamProductDetail,
  StaffListGMProductForCustomPriceFilteringResponse_Product,
} from "@/services/connect-rpc/types"
import { getPrice } from "@/utils"
import {
  staffGetPriceCustomRuleDetail,
  staffListProductPriceCustom,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { Button, ButtonIconCopy, LoadingCircle } from "@gearment/ui3"
import {
  createFileRoute,
  Link,
  stripSearchParams,
  useParams,
  useRouterState,
  useSearch,
} from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { ArrowLeft } from "lucide-react"
import { useMemo } from "react"
import { PricingRuleDetailMode, VariantState } from "../-helper"
import { PricingRuleProvider } from "../-pricing-rule-context"
import CustomPricingDetail from "./-custom-pricing-detail"

export const Route = createFileRoute(
  "/_authorize/global-configuration/pricing-management/$customId/",
)({
  staticData: {
    breadcrumb: [
      {
        name: "Pricing management",
        link: "/global-configuration/pricing-management",
      },
      {
        name: "Edit pricing rule",
        link: "/global-configuration/pricing-management/$customId",
      },
    ],
  },
  component: () => (
    <PricingRuleProvider>
      <Index />
    </PricingRuleProvider>
  ),
  validateSearch: zodValidator(DetailPricingRuleSchema),
  search: {
    middlewares: [stripSearchParams(DetailPricingRuleSchema.parse({}))],
  },
})

function Index() {
  const params = useParams({
    from: "/_authorize/global-configuration/pricing-management/$customId/",
  })

  const search = useSearch({
    from: "/_authorize/global-configuration/pricing-management/$customId/",
  })

  const callbackHistory = useRouterState({
    select: (state) => state.location.state,
  })

  const { data: ruleDetail, isLoading } = useQueryPod(
    staffGetPriceCustomRuleDetail,
    {
      customId: params.customId,
    },
    {
      enabled: !!params.customId,
      select: (data) => data.data,
    },
  )

  const { data: productsResp } = useQueryPod(
    staffListProductPriceCustom,
    {
      filter: {
        customId: params.customId,
      },
    },
    {
      enabled: !!params.customId,
      select: (data) => data.data,
    },
  )

  const initialProducts: {
    product: StaffListGMProductForCustomPriceFilteringResponse_Product[]
    variants: VariantState[]
  }[] = (productsResp ?? []).map((p: GMProduct_TeamProductDetail) => {
    const variantState: VariantState = {}
    ;(p.variants ?? []).forEach((v) => {
      const hasFbm = v.customPriceRule?.priceFbm != null
      const hasFba = v.customPriceRule?.priceFba != null
      const fbmNum = hasFbm
        ? getPrice(v.customPriceRule!.priceFbm)
        : getPrice(v.basePrice)
      const fbaNum = hasFba
        ? getPrice(v.customPriceRule!.priceFba)
        : getPrice(v.basePrice)
      variantState[v.variantId] = {
        fbm: {
          enabled: hasFbm,
          value: fbmNum,
          input: hasFbm ? String(fbmNum) : "",
          error: undefined,
        },
        fba: {
          enabled: hasFba,
          value: fbaNum,
          input: hasFba ? String(fbaNum) : "",
          error: undefined,
        },
      }
    })
    return {
      product: [
        new StaffListGMProductForCustomPriceFilteringResponse_Product({
          productId: p.productId,
          name: p.name,
        }),
      ],
      variants: [variantState],
    }
  })

  const defaultValues: CreatePricingRuleType = useMemo(() => {
    return {
      customPriceId: params.customId,
      teamId: ruleDetail?.teamId ?? "",
      dateRange: {
        from: ruleDetail?.startTime?.toDate() as Date,
        to: ruleDetail?.endTime?.toDate() as Date,
      },
      internalNote: ruleDetail?.internalNote || "",
    }
  }, [ruleDetail])

  return (
    <div className="pb-6">
      <div className="flex items-center gap-2">
        <Link
          to={
            callbackHistory.href || "/global-configuration/pricing-management"
          }
          className="mb-4 flex items-center gap-2"
        >
          <Button size="icon" variant="outline">
            <ArrowLeft />
          </Button>
        </Link>
        <div>
          <div className="heading-3 flex items-center gap-1">
            {search.mode === PricingRuleDetailMode.DETAIL
              ? `View pricing rule`
              : "Edit pricing rule"}
            {": "}
            {params.customId}
            <ButtonIconCopy size="sm" copyValue={params.customId} />
          </div>
          <p className="text-sm">View and update customized pricing rule</p>
        </div>
      </div>
      {isLoading && (
        <div className="flex justify-center items-center h-full">
          <LoadingCircle />
        </div>
      )}
      {ruleDetail && (
        <CustomPricingDetail
          customId={params.customId}
          defaultValues={defaultValues}
          initialProducts={initialProducts}
          ruleDetail={ruleDetail}
          mode={search.mode}
        />
      )}
    </div>
  )
}
