import { ListPricingRuleType } from "@/schemas/schemas/pricing"
import { ProductPriceCustom } from "@/services/connect-rpc/types"
import { formatNumberToMoney } from "@/utils/format-currency"
import { useNavigate } from "@tanstack/react-router"
import { RowSelectionState } from "@tanstack/react-table"
import {
  createContext,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react"
import { FulfillmentMode, VariantState } from "./-helper"

export type VariantResult = {
  variantId: string
  fbm: { enabled: boolean; value?: number; error?: string }
  fba: { enabled: boolean; value?: number; error?: string }
}

export type ProductPricingResult = {
  productId: string
  productName: string
  fulfillment: FulfillmentMode
  variants: VariantResult[]
  baseline?: VariantResult[]
}

interface PricingRuleContextValue {
  products: Record<string, ProductPricingResult>
  upsertProductResult: (
    productId: string,
    productName: string,
    fulfillment: FulfillmentMode,
    variants: VariantResult[],
  ) => void
  removeProductResult: (productId: string) => void
  markProductDeleted: (productId: string) => void
  clear: () => void
  buildProductPriceCustomData: () => ProductPriceCustom[]
  buildProductPriceCustomDataForUpdate: (
    initialVariantsByProduct?: Record<string, VariantState>,
  ) => ProductPriceCustom[]
  validateProductsBeforeSave: () => boolean
  handleSetFilter: (
    search: ListPricingRuleType,
    resetRowState?: boolean,
    replace?: boolean,
  ) => void
  rowSelection: RowSelectionState
  setRowSelection: React.Dispatch<SetStateAction<RowSelectionState>>
  deletedProductIds: string[]
  productErrors: Record<string, string>
  setProductErrors: React.Dispatch<SetStateAction<Record<string, string>>>
}

const PricingRuleContext = createContext<PricingRuleContextValue | null>(null)

export function PricingRuleProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const navigate = useNavigate({
    from: "/global-configuration/pricing-management",
  })
  const [productsState, setProductsState] = useState<
    Record<string, ProductPricingResult>
  >({})

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [deletedProductIds, setDeletedProductIds] = useState<string[]>([])
  const [productErrors, setProductErrors] = useState<Record<string, string>>({})

  const upsertProductResult: PricingRuleContextValue["upsertProductResult"] = (
    productId,
    productName,
    fulfillment,
    variants,
  ) => {
    setProductsState((prev) => ({
      ...prev,
      [productId]: {
        productId,
        productName,
        fulfillment,
        variants,
        baseline: prev[productId]?.baseline ?? variants,
      },
    }))

    const hasAnyConfigured = variants.some(
      (v) =>
        (v.fbm.enabled && v.fbm.value !== undefined && !v.fbm.error) ||
        (v.fba.enabled && v.fba.value !== undefined && !v.fba.error),
    )
    if (hasAnyConfigured) {
      setProductErrors((prev) => {
        if (!prev[productId]) return prev
        const next = { ...prev }
        delete next[productId]
        return next
      })
    }
  }

  const removeProductResult: PricingRuleContextValue["removeProductResult"] = (
    productId,
  ) => {
    setProductsState((prev) => {
      const next = { ...prev }
      delete next[productId]
      return next
    })
    setDeletedProductIds([...deletedProductIds, productId])
    setProductErrors((prev) => {
      if (!prev[productId]) return prev
      const next = { ...prev }
      delete next[productId]
      return next
    })
  }

  const markProductDeleted: PricingRuleContextValue["markProductDeleted"] = (
    productId,
  ) => {
    if (!productId) return
    setDeletedProductIds((prev) =>
      prev.includes(productId) ? prev : [...prev, productId],
    )
  }

  const clear = () => {
    setProductsState({})
    setDeletedProductIds([])
    setRowSelection({})
  }

  const buildProductPriceCustomData = useCallback(() => {
    const result: ProductPriceCustom[] = []
    Object.values(productsState).forEach((p) => {
      p.variants.forEach((v) => {
        const payload = new ProductPriceCustom({
          productId: p.productId,
          variantId: v.variantId,
        })

        // Map: FBM -> price, FBA -> priceFba
        // Always include channel values if valid, regardless of selected fulfillment mode
        if (v.fbm.enabled && !v.fbm.error && v.fbm.value !== undefined) {
          payload.price = formatNumberToMoney(v.fbm.value)
        }

        if (v.fba.enabled && !v.fba.error && v.fba.value !== undefined) {
          payload.priceFba = formatNumberToMoney(v.fba.value)
        }

        result.push(payload)
      })
    })
    return result
  }, [productsState])

  const buildProductPriceCustomDataForUpdate = useCallback(
    (initialVariantsByProduct?: Record<string, VariantState>) => {
      const result: ProductPriceCustom[] = []
      Object.values(productsState).forEach((p) => {
        const baselineVariants = p.baseline
        const baseline: Record<
          string,
          { fbm?: VariantResult["fbm"]; fba?: VariantResult["fba"] }
        > = {}
        if (baselineVariants && baselineVariants.length) {
          baselineVariants.forEach((b) => {
            baseline[b.variantId] = { fbm: b.fbm, fba: b.fba }
          })
        } else if (initialVariantsByProduct) {
          Object.entries(initialVariantsByProduct[p.productId] || {}).forEach(
            ([variantId, state]) => {
              baseline[variantId] = {
                fbm: {
                  enabled: state.fbm.enabled,
                  value: state.fbm.value,
                  error: state.fbm.error,
                },
                fba: {
                  enabled: state.fba.enabled,
                  value: state.fba.value,
                  error: state.fba.error,
                },
              }
            },
          )
        }
        p.variants.forEach((v) => {
          const baseV = baseline[v.variantId]
          const baseFbmValue = baseV?.fbm?.value
          const baseFbaValue = baseV?.fba?.value

          const currFbmEnabled = v.fbm.enabled
          const currFbmValue = v.fbm.value
          const currFbmError = v.fbm.error

          const currFbaEnabled = v.fba.enabled
          const currFbaValue = v.fba.value
          const currFbaError = v.fba.error

          const fbmChanged = (baseFbmValue ?? null) !== (currFbmValue ?? null)
          const fbaChanged = (baseFbaValue ?? null) !== (currFbaValue ?? null)

          if (!fbmChanged && !fbaChanged) return

          const payload = new ProductPriceCustom({
            productId: p.productId,
            variantId: v.variantId,
          })

          if (currFbmEnabled && !currFbmError && currFbmValue !== undefined) {
            payload.price = formatNumberToMoney(currFbmValue)
          }
          if (currFbaEnabled && !currFbaError && currFbaValue !== undefined) {
            payload.priceFba = formatNumberToMoney(currFbaValue)
          }

          if (payload.price !== undefined || payload.priceFba !== undefined) {
            result.push(payload)
          }
        })
      })
      return result
    },
    [productsState],
  )

  const validateProductsBeforeSave = useCallback(() => {
    const errors: Record<string, string> = {}
    Object.values(productsState).forEach((p) => {
      if (!p.productId) return
      if (deletedProductIds.includes(p.productId)) return
      const hasAnyConfigured = p.variants.some(
        (v) =>
          (v.fbm.enabled && v.fbm.value !== undefined && !v.fbm.error) ||
          (v.fba.enabled && v.fba.value !== undefined && !v.fba.error),
      )
      if (!hasAnyConfigured) {
        errors[p.productId] =
          "Please enter a price change or remove this product before saving."
      }
    })
    setProductErrors(errors)
    return Object.keys(errors).length === 0
  }, [productsState, deletedProductIds])

  const handleSetFilter = useCallback(
    (
      newFilter: ListPricingRuleType,
      resetRowState: boolean = true,
      replace: boolean = false,
    ) => {
      navigate({
        to: "/global-configuration/pricing-management",
        search: (old) =>
          replace ? { ...newFilter } : { ...old, ...newFilter },
        replace: true,
      })
      if (resetRowState) {
        setRowSelection({})
      }
    },
    [navigate],
  )

  return (
    <PricingRuleContext.Provider
      value={{
        products: productsState,
        upsertProductResult,
        removeProductResult,
        markProductDeleted,
        clear,
        buildProductPriceCustomData,
        buildProductPriceCustomDataForUpdate,
        validateProductsBeforeSave,
        handleSetFilter,
        rowSelection,
        setRowSelection,
        deletedProductIds,
        productErrors,
        setProductErrors,
      }}
    >
      {children}
    </PricingRuleContext.Provider>
  )
}

export function usePricingRule() {
  const ctx = useContext(PricingRuleContext)
  if (!ctx)
    throw new Error("usePricingRule must be used within PricingRuleProvider")
  return ctx
}
