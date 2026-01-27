import {
  GMProduct_Admin_Variant_Short,
  GMProduct_TeamProductDetail_Variant,
  GMTeamPriceCustomStatus,
  StaffListPriceCustomRuleRequest_SortCriterion_SortBy,
  StaffListPriceCustomRuleRequest_SortCriterion_SortDirection,
} from "@/services/connect-rpc/types"
import { getPrice } from "@/utils"
import { sortSizes } from "@/utils/sort"

export type ChannelState = {
  enabled: boolean
  value?: number
  input: string
  error?: string
}

export type VariantState = Record<
  string,
  { fbm: ChannelState; fba: ChannelState }
>

export function groupVariantsByOption1Code(
  variants: GMProduct_Admin_Variant_Short[],
) {
  const sortedVariants = variants.sort((a, b) =>
    sortSizes(a.option2?.name ?? "", b.option2?.name ?? ""),
  )

  return sortedVariants.reduce<Record<string, GMProduct_Admin_Variant_Short[]>>(
    (acc, variant) => {
      const code = variant.option1?.code || ""
      if (!acc[code]) {
        acc[code] = []
      }
      acc[code].push(variant)
      return acc
    },
    {},
  )
}

export enum BulkMode {
  DISCOUNT_PRICE = "discount_price",
  FLAT_RATE = "flat_rate",
  DIRECT_FIX_PRICE = "direct_fix_price",
}

export const bulkModeOptions = [
  { label: "Discount %", value: BulkMode.DISCOUNT_PRICE },
  { label: "Flat Rate", value: BulkMode.FLAT_RATE },
  { label: "Direct Fix Price", value: BulkMode.DIRECT_FIX_PRICE },
]

export enum FulfillmentMode {
  BOTH = "both",
  FBM = "fbm",
  FBA = "fba",
}

export const fulfillmentOptions = [
  { label: "FBM & FBA", value: FulfillmentMode.BOTH },
  { label: "FBM Only", value: FulfillmentMode.FBM },
  { label: "FBA Only", value: FulfillmentMode.FBA },
]

export const computePrice = (
  base: number,
  bulkValue: string,
  bulkMode: BulkMode,
): number => {
  const normalized = bulkValue.replace(/,/g, ".")
  const val = Number(normalized)
  if (!isFinite(val)) return base
  switch (bulkMode) {
    case BulkMode.DISCOUNT_PRICE.toString(): {
      return Number(Math.max(0, base * (1 - val / 100)).toFixed(2))
    }
    case BulkMode.FLAT_RATE.toString(): {
      return Number(Math.max(0, val).toFixed(2))
    }
    case BulkMode.DIRECT_FIX_PRICE.toString(): {
      return Number(Math.max(0, base - val).toFixed(2))
    }
    default:
      return base
  }
}

export const buildCurrentVariantResults = (
  all: GMProduct_TeamProductDetail_Variant[],
  variantState: VariantState,
  overrides?: {
    variantId: string
    fbmValue?: number
    fbmError?: string
    fbaValue?: number
    fbaError?: string
    fbmEnabled?: boolean
    fbaEnabled?: boolean
  },
) => {
  return all.map((vi) => {
    const isTarget = overrides && overrides.variantId === vi.variantId
    const current = variantState[vi.variantId]

    const priceFbm =
      current?.fbm.value ?? getPrice(vi.customPriceRule?.priceFbm)
    const priceFba =
      current?.fba.value ?? getPrice(vi.customPriceRule?.priceFba)

    const fbmVal =
      isTarget && overrides?.fbmValue !== undefined
        ? overrides!.fbmValue
        : priceFbm
    const fbaVal =
      isTarget && overrides?.fbaValue !== undefined
        ? overrides!.fbaValue
        : priceFba

    const enabledFbm = current?.fbm.enabled ?? true
    const enabledFba = current?.fba.enabled ?? true

    const fbmErr = isTarget ? overrides?.fbmError : current?.fbm.error
    const fbaErr = isTarget ? overrides?.fbaError : current?.fba.error
    return {
      variantId: vi.variantId,
      fbm: {
        enabled:
          isTarget && overrides?.fbmEnabled !== undefined
            ? Boolean(overrides.fbmEnabled)
            : enabledFbm,
        value: fbmVal,
        error: fbmErr,
      },
      fba: {
        enabled:
          isTarget && overrides?.fbaEnabled !== undefined
            ? Boolean(overrides.fbaEnabled)
            : enabledFba,
        value: fbaVal,
        error: fbaErr,
      },
    }
  })
}

export enum ErrorPriceMessage {
  PRICE_GREATER_THAN_RSP = "final price cannot be greater than RSP.",
  PRICE_NOT_FOUND = "Please input price",
}

export const PricingRuleTabs = [
  {
    key: GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_UNSPECIFIED,
    value: GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_UNSPECIFIED,
  },
  {
    key: GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_ACTIVE,
    value: GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_ACTIVE,
  },
  {
    key: GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_PENDING,
    value: GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_PENDING,
  },
  {
    key: GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_INACTIVE,
    value: GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_INACTIVE,
  },
]

export const sortByMapping: Record<
  string,
  StaffListPriceCustomRuleRequest_SortCriterion_SortBy
> = {
  createdAt: StaffListPriceCustomRuleRequest_SortCriterion_SortBy.CREATED_DATE,
  endTime: StaffListPriceCustomRuleRequest_SortCriterion_SortBy.END_TIME,
  startTime: StaffListPriceCustomRuleRequest_SortCriterion_SortBy.START_TIME,
}

export const sortDirectionMapping: Record<
  string,
  StaffListPriceCustomRuleRequest_SortCriterion_SortDirection
> = {
  asc: StaffListPriceCustomRuleRequest_SortCriterion_SortDirection.ASC,
  desc: StaffListPriceCustomRuleRequest_SortCriterion_SortDirection.DESC,
}

export enum PricingRuleDetailMode {
  UPDATE = "update",
  DETAIL = "detail",
}
