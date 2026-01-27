import { CreatePricingRuleType } from "@/schemas/schemas/pricing"
import { useQueryPod } from "@/services/connect-rpc/transport"
import {
  GMProduct_Admin_Variant_Short,
  GMProduct_TeamProductDetail_Variant,
} from "@/services/connect-rpc/types"
import { getPrice } from "@/utils"
import { sortSizes } from "@/utils/sort"
import {
  staffGetProductDetail,
  staffListProductVariant,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { _debounce } from "@gearment/utils"
import {
  createContext,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useFormContext, useWatch } from "react-hook-form"
import {
  buildCurrentVariantResults,
  BulkMode,
  computePrice,
  ErrorPriceMessage,
  FulfillmentMode,
  groupVariantsByOption1Code,
  PricingRuleDetailMode,
  VariantState,
} from "../../-helper"
import { usePricingRule, VariantResult } from "../../-pricing-rule-context"

interface PricingConfigurationContextValue {
  actionButtons: { label: string; onClick: () => void }[]
  handleApplyBulk: () => void
  handleVariantChange: (
    v: GMProduct_Admin_Variant_Short,
    val: string,
    channel: ChannelType,
  ) => void
  toggleBaseVariantExpansion: (baseVariantId: string) => void
  handleToggleSelectAllInGroup: (
    variants: GMProduct_TeamProductDetail_Variant[],
    checked: boolean,
  ) => void
  expandedBaseVariants: string[]
  fulfillment: FulfillmentMode
  bulkMode: BulkMode
  bulkValue: string
  selectedVariantIds: string[]
  variantState: VariantState
  loading: boolean
  setFulfillment: (fulfillment: FulfillmentMode) => void
  setBulkMode: (bulkMode: BulkMode) => void
  setBulkValue: (bulkValue: string) => void
  groupedVariants: Record<string, GMProduct_Admin_Variant_Short[]>
  setSelectedVariantIds: React.Dispatch<SetStateAction<string[]>>
  productName: string
  productId: string
  onRemoveProduct: (index: number) => void
  productIndex: number
  mountedCollapse: boolean
  setMountedCollapse: React.Dispatch<SetStateAction<boolean>>
  totalColors: number
  totalVariants: number
  handleRemovePriceFbm: (v: GMProduct_TeamProductDetail_Variant) => void
  handleRemovePriceFba: (v: GMProduct_TeamProductDetail_Variant) => void
  selectedSizes: string[]
  setSelectedSizes: React.Dispatch<SetStateAction<string[]>>
  availableSizes: { value: string; label: string }[]
  totalRecords: number
  loadingProductDetail: boolean
}

const PricingConfigurationContext =
  createContext<PricingConfigurationContextValue>({
    actionButtons: [],
    handleApplyBulk: () => {},
    handleVariantChange: () => {},
    toggleBaseVariantExpansion: () => {},
    handleToggleSelectAllInGroup: () => {},
    expandedBaseVariants: [],
    fulfillment: FulfillmentMode.BOTH,
    bulkMode: BulkMode.DISCOUNT_PRICE,
    bulkValue: "",
    selectedVariantIds: [],
    variantState: {},
    loading: false,
    setFulfillment: () => {},
    setBulkMode: () => {},
    setBulkValue: () => {},
    groupedVariants: {},
    setSelectedVariantIds: () => {},
    productName: "",
    productId: "",
    onRemoveProduct: () => {},
    productIndex: 0,
    mountedCollapse: true,
    setMountedCollapse: () => {},
    totalColors: 0,
    totalVariants: 0,
    handleRemovePriceFbm: () => {},
    handleRemovePriceFba: () => {},
    selectedSizes: [],
    setSelectedSizes: () => {},
    availableSizes: [],
    totalRecords: 0,
    loadingProductDetail: false,
  })

interface Props {
  productName: string
  productId: string
  onRemoveProduct: (index: number) => void
  productIndex: number
  variant: VariantState
  totalColors: number
  totalVariants: number
  children: React.ReactNode
  mode?: PricingRuleDetailMode
}

const defaultVariantState = {
  enabled: true,
  input: "",
  value: undefined,
  error: undefined,
}

const validPattern = /^\d*(?:\.|\d+)?\d*$/

export type ChannelType = FulfillmentMode.FBM | FulfillmentMode.FBA

export function PricingConfigurationProvider({
  children,
  productId,
  variant,
  onRemoveProduct,
  productIndex,
  productName,
  mode,
}: Props) {
  const [expandedBaseVariants, setExpandedBaseVariants] = useState<string[]>([])
  const [fulfillment, setFulfillment] = useState<FulfillmentMode>(
    FulfillmentMode.BOTH,
  )

  const [bulkMode, setBulkMode] = useState<BulkMode>(BulkMode.DISCOUNT_PRICE)
  const [bulkValue, setBulkValue] = useState<string>("")
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])

  const [selectedVariantIds, setSelectedVariantIds] = useState<string[]>([])
  const [variantState, setVariantState] = useState<VariantState>(variant)

  const initialUpsertDoneRef = useRef(false)

  const form = useFormContext<CreatePricingRuleType>()
  const teamId = useWatch({ control: form.control, name: "teamId" })

  const customPriceId = useWatch({
    control: form.control,
    name: "customPriceId",
  })

  const [mountedCollapse, setMountedCollapse] = useState(false)

  const { data, isLoading } = useQueryPod(
    staffGetProductDetail,
    {
      productId: productId,
      selector: {
        teamId: teamId,
        customPriceId,
      },
    },
    {
      enabled: !!teamId && !!productId,
      select: (data) => data.data,
    },
  )

  const { data: productDetail, isLoading: isLoadingProductDetail } =
    useQueryPod(
      staffListProductVariant,
      {
        filter: {
          productIds: productId ? [productId] : [],
        },
        selector: {
          customPriceId: customPriceId,
          listAll: true,
        },
      },
      {
        enabled: !!productId && !!mountedCollapse,
        select: (data) => {
          return {
            variants: data?.data,
            totalRecords: data?.paging?.total,
          }
        },
      },
    )

  const groupedVariants = groupVariantsByOption1Code(
    productDetail?.variants ?? [],
  )
  const pricingRule = usePricingRule()

  const saveToContextDebounced = useMemo(
    () =>
      _debounce((variantsResult: VariantResult[]) => {
        pricingRule.upsertProductResult(
          productId,
          data?.name || productName,
          fulfillment,
          variantsResult,
        )
      }, 300),
    [pricingRule, productId, data?.name, productName, fulfillment],
  )

  const initializeVariantState = useCallback(
    (variants: GMProduct_TeamProductDetail_Variant[]) => {
      const nextSelected: string[] = []
      const nextState: VariantState = {}
      variants.forEach((v) => {
        const hasFbm = v.customPriceRule?.priceFbm != null
        const hasFba = v.customPriceRule?.priceFba != null
        const fbmNum = hasFbm
          ? getPrice(v.customPriceRule!.priceFbm)
          : undefined
        const fbaNum = hasFba
          ? getPrice(v.customPriceRule!.priceFba)
          : undefined

        if (hasFbm || hasFba) nextSelected.push(v.variantId)

        nextState[v.variantId] = {
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

      setSelectedVariantIds((prev) => {
        if (prev.length) return prev
        return nextSelected
      })
      setVariantState((prev) => ({ ...nextState, ...prev }))
    },
    [],
  )

  useEffect(() => {
    if (mode === PricingRuleDetailMode.UPDATE) {
      initialUpsertDoneRef.current = false
      setVariantState({})
      setSelectedVariantIds([])
    }
  }, [mode])

  const toggleBaseVariantExpansion = (baseVariantId: string) => {
    setExpandedBaseVariants((prev) => {
      if (prev.includes(baseVariantId)) {
        return prev.filter((id) => id !== baseVariantId)
      } else {
        return [...prev, baseVariantId]
      }
    })
  }

  const handleToggleSelectAllInGroup = (
    variants: GMProduct_TeamProductDetail_Variant[],
    checked: boolean,
  ) => {
    setSelectedVariantIds((prev) => {
      const variantIds = variants.map((v) => v.variantId)
      if (checked) {
        const newIds = variantIds.filter((id) => !prev.includes(id))
        return [...prev, ...newIds]
      } else {
        return prev.filter((id) => !variantIds.includes(id))
      }
    })
  }

  const handleCheckAll = () => {
    const allVariants = productDetail?.variants ?? []
    setSelectedVariantIds(allVariants.map((v) => v.variantId))
  }

  const handleUnselectAll = () => {
    setSelectedVariantIds([])
  }

  const handleExpandAll = () => {
    const allBaseVariantIds = Object.values(groupedVariants)
      .map((variants) => variants[0]?.variantId)
      .filter(Boolean) as string[]
    setExpandedBaseVariants(allBaseVariantIds)
  }

  const handleCollapseAll = () => {
    setExpandedBaseVariants([])
  }

  const handleApplyBulk = () => {
    const all = productDetail?.variants ?? []
    if (all.length === 0) return

    let targetVariants: GMProduct_Admin_Variant_Short[]
    if (selectedSizes.length > 0) {
      targetVariants = all.filter(
        (v) => v.option2?.name && selectedSizes.includes(v.option2.name),
      )
    } else {
      if (!selectedVariantIds.length) return
      targetVariants = all.filter((v) =>
        selectedVariantIds.includes(v.variantId),
      )
    }

    if (targetVariants.length === 0) return

    const next = { ...variantState }
    targetVariants.forEach((v) => {
      const suggested = computePrice(getPrice(v.rsp), bulkValue, bulkMode)
      const vs = next[v.variantId] ?? {
        fbm: { ...defaultVariantState },
        fba: { ...defaultVariantState },
      }

      if (fulfillment !== FulfillmentMode.FBA) {
        vs.fbm.value = suggested
        vs.fbm.input = String(suggested)
        vs.fbm.enabled = true
        vs.fbm.error =
          suggested > getPrice(v.rsp)
            ? ErrorPriceMessage.PRICE_GREATER_THAN_RSP
            : undefined
      }

      if (fulfillment !== FulfillmentMode.FBM) {
        vs.fba.value = suggested
        vs.fba.input = String(suggested)
        vs.fba.enabled = true
        vs.fba.error =
          suggested > getPrice(v.rsp)
            ? ErrorPriceMessage.PRICE_GREATER_THAN_RSP
            : undefined
      }
      next[v.variantId] = vs
    })

    setVariantState(next)

    const result = targetVariants.map((v) => ({
      variantId: v.variantId,
      fbm: {
        enabled: next[v.variantId]?.fbm.enabled ?? true,
        value: next[v.variantId]?.fbm.value,
        error: next[v.variantId]?.fbm.error,
      },
      fba: {
        enabled: next[v.variantId]?.fba.enabled ?? true,
        value: next[v.variantId]?.fba.value,
        error: next[v.variantId]?.fba.error,
      },
    }))

    pricingRule.upsertProductResult(
      productId,
      data?.name || productName,
      fulfillment,
      result,
    )
  }

  const handleVariantChange = (
    v: GMProduct_Admin_Variant_Short,
    val: string,
    channel: ChannelType,
  ) => {
    const raw = val
    const valid = validPattern.test(raw)
    if (!valid) return

    const num = raw === "" || raw === "." ? undefined : Number(raw)

    setVariantState((prev) => {
      const next = { ...prev }
      const current = next[v.variantId] ?? {
        fbm: { ...defaultVariantState },
        fba: { ...defaultVariantState },
      }
      current[channel].input = raw
      if (num !== undefined) current[channel].value = num

      if (raw.trim() !== "" && num !== undefined)
        current[channel].enabled = true
      next[v.variantId] = current
      return next
    })

    const err =
      num !== undefined && num > getPrice(v.rsp)
        ? ErrorPriceMessage.PRICE_GREATER_THAN_RSP
        : undefined

    setVariantState((prev) => {
      const next = { ...prev }
      const current = next[v.variantId]
      if (current) {
        current[channel].error = err
      }
      return next
    })

    const all = productDetail?.variants ?? []
    const variantsResult = buildCurrentVariantResults(all, variantState, {
      variantId: v.variantId,
      [`${channel}Value`]: num,
      [`${channel}Error`]: err,
      [`${channel}Enabled`]: raw.trim() !== "" && num !== undefined,
    })
    saveToContextDebounced(variantsResult)
  }

  const handleRemovePriceFbm = (v: GMProduct_TeamProductDetail_Variant) => {
    setVariantState((prev) => {
      const next = { ...prev }
      const current = next[v.variantId]
      if (current) {
        current.fbm.input = ""
        current.fbm.value = undefined
        current.fbm.error = undefined
        current.fbm.enabled = false
      }
      return next
    })
    const all = productDetail?.variants ?? []
    const variantsResult = buildCurrentVariantResults(all, variantState, {
      variantId: v.variantId,
      fbmEnabled: false,
    })
    saveToContextDebounced(variantsResult)
  }

  const handleRemovePriceFba = (v: GMProduct_TeamProductDetail_Variant) => {
    setVariantState((prev) => {
      const next = { ...prev }
      const current = next[v.variantId]
      if (current) {
        current.fba.input = ""
        current.fba.value = undefined
        current.fba.error = undefined
        current.fba.enabled = false
      }
      return next
    })
    const all = productDetail?.variants ?? []
    const variantsResult = buildCurrentVariantResults(all, variantState, {
      variantId: v.variantId,
      fbaEnabled: false,
    })
    saveToContextDebounced(variantsResult)
  }

  useEffect(() => {
    const noProducts = Object.keys(pricingRule.products ?? {}).length === 0
    const noDeleted = (pricingRule.deletedProductIds ?? []).length === 0
    if (noProducts && noDeleted) {
      setVariantState(variant)
    }
  }, [pricingRule.products, pricingRule.deletedProductIds, variant])

  useEffect(() => {
    const all = productDetail?.variants ?? []

    if (all.length > 0 && Object.keys(variantState).length === 0) {
      initializeVariantState(all)
      return
    }

    if (!initialUpsertDoneRef.current) {
      if (!all.length) return
      const ready = all.every((v) => !!variantState[v.variantId])
      if (!ready) return
      const variantsResult = buildCurrentVariantResults(all, variantState)
      pricingRule.upsertProductResult(
        productId,
        data?.name || productName,
        fulfillment,
        variantsResult,
      )
      initialUpsertDoneRef.current = true
      return
    }

    if (
      all.length > 0 &&
      initialUpsertDoneRef.current &&
      all.every((v) => !!variantState[v.variantId])
    ) {
      const variantsResult = buildCurrentVariantResults(all, variantState)
      saveToContextDebounced(variantsResult)
    }
  }, [
    data,
    productId,
    productName,
    fulfillment,
    pricingRule,
    initializeVariantState,
    saveToContextDebounced,
    variantState,
    productDetail,
  ])

  const actionButtons: { label: string; onClick: () => void }[] = [
    { label: "Check all", onClick: handleCheckAll },
    { label: "Unselect all", onClick: handleUnselectAll },
    { label: "Expand all", onClick: handleExpandAll },
    { label: "Collapse all", onClick: handleCollapseAll },
  ]

  const loading = isLoading
  const loadingProductDetail = isLoadingProductDetail || isLoading

  const availableSizes = useMemo(() => {
    const allVariants = productDetail?.variants ?? []

    const sizeSet = new Set<string>()
    allVariants.forEach((v) => {
      if (v.option2?.name) {
        sizeSet.add(v.option2.name)
      }
    })
    return Array.from(sizeSet)
      .sort((a, b) => sortSizes(a, b))
      .map((size) => ({ value: size, label: size }))
  }, [productDetail?.variants])

  return (
    <PricingConfigurationContext.Provider
      value={{
        actionButtons,
        handleApplyBulk,
        toggleBaseVariantExpansion,
        handleToggleSelectAllInGroup,
        expandedBaseVariants,
        fulfillment,
        bulkMode,
        bulkValue,
        selectedVariantIds,
        variantState,
        loading,
        handleVariantChange,
        setFulfillment,
        setBulkMode,
        setBulkValue,
        groupedVariants,
        setSelectedVariantIds,
        productName,
        productId,
        onRemoveProduct,
        productIndex,
        mountedCollapse,
        setMountedCollapse,
        totalColors: Number(data?.totalColors ?? 0),
        totalVariants: Number(data?.totalVariants ?? 0),
        handleRemovePriceFbm,
        handleRemovePriceFba,
        selectedSizes,
        setSelectedSizes,
        availableSizes,
        totalRecords: Number(productDetail?.totalRecords ?? 0),
        loadingProductDetail,
      }}
    >
      {children}
    </PricingConfigurationContext.Provider>
  )
}

export function usePricingConfiguration() {
  const context = useContext(PricingConfigurationContext)
  if (!context) {
    throw new Error(
      "usePricingConfiguration must be used within PricingConfigurationProvider",
    )
  }
  return context
}
