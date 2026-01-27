import { CreatePricingRuleType } from "@/schemas/schemas/pricing"
import { StaffListGMProductForCustomPriceFilteringResponse_Product } from "@/services/connect-rpc/types"
import {
  Button,
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { PlusIcon, Trash2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { PricingRuleDetailMode, VariantState } from "../../-helper"
import { usePricingRule } from "../../-pricing-rule-context"
import { PricingConfigurationProvider } from "./-pricing-configuration-context"
import CustomPricingProductVariant from "./pricing-product-variant"
import SelectProduct from "./select-product"

type Props = {
  initialProducts?: {
    product: StaffListGMProductForCustomPriceFilteringResponse_Product[]
    variants: VariantState[]
  }[]
  mode?: PricingRuleDetailMode
}

export default function PricingConfiguration({
  initialProducts,
  mode = PricingRuleDetailMode.UPDATE,
}: Props) {
  const [pricingConfigs, setPricingConfigs] = useState<
    (StaffListGMProductForCustomPriceFilteringResponse_Product & {
      variant: VariantState
    })[]
  >([])
  const form = useFormContext<CreatePricingRuleType>()
  const pricingRule = usePricingRule()
  const teamId = useWatch({ control: form.control, name: "teamId" })

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      const flattened = initialProducts.flatMap((entry) => {
        const prods = entry.product ?? []
        const variants = entry.variants ?? []
        const maxLen = Math.max(prods.length, variants.length)
        const rows: (StaffListGMProductForCustomPriceFilteringResponse_Product & {
          variant: VariantState
        })[] = []
        for (let i = 0; i < maxLen; i++) {
          const p = prods[i]
          const v = variants[i] ?? ({} as VariantState)
          if (!p) continue
          rows.push(
            Object.assign(
              new StaffListGMProductForCustomPriceFilteringResponse_Product({
                productId: p.productId,
                name: p.name,
              }),
              { variant: v },
            ),
          )
        }
        return rows
      })
      setPricingConfigs(flattened)
    }
  }, [initialProducts])

  const handleSelectProduct = useCallback(
    (
      idx: number,
      value: StaffListGMProductForCustomPriceFilteringResponse_Product,
    ) => {
      setPricingConfigs((prev) =>
        prev.map((config, i) => {
          if (i !== idx) return config
          return Object.assign(
            new StaffListGMProductForCustomPriceFilteringResponse_Product({
              productId: value.productId,
              name: value.name,
            }),
            { variant: {} },
          )
        }),
      )
    },
    [],
  )

  const handleAddProduct = () => {
    setPricingConfigs((prev) => [
      ...prev,
      Object.assign(
        new StaffListGMProductForCustomPriceFilteringResponse_Product({
          productId: "",
          name: "",
        }),
        { variant: {} },
      ),
    ])
  }

  const handleRemoveProduct = useCallback(
    (idx: number) => {
      setPricingConfigs((prev) => {
        const productId = prev[idx]?.productId
        if (productId) {
          pricingRule.removeProductResult(productId)
        }
        return prev.filter((_, i) => i !== idx)
      })
    },
    [pricingRule],
  )

  const disabled = !teamId

  const isDetail = mode === PricingRuleDetailMode.DETAIL

  return (
    <div className="bg-white dark:bg-dark-2 p-6 rounded-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="heading-3">Pricing configuration</div>
      </div>
      <div className="space-y-4">
        {pricingConfigs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No products configured yet.{" "}
            <span className={cn(isDetail && "hidden")}>
              Click &quot;Add product&quot; to get started.
            </span>
          </div>
        )}
        <div className="space-y-4">
          {pricingConfigs.map((config, idx) => (
            <div
              key={config.productId + idx}
              className="border border-border rounded-md"
            >
              {!config.productId ? (
                <div className="p-4">
                  <div className="flex gap-4 items-center">
                    <div className="flex-1">
                      <SelectProduct
                        onChange={(selectedProduct) => {
                          if (
                            selectedProduct &&
                            config.productId !== selectedProduct.productId
                          ) {
                            handleSelectProduct(idx, selectedProduct)
                          }
                        }}
                        value={config.productId}
                        excludeIds={pricingConfigs
                          .map((c) => c.productId)
                          .filter((id) => id && id !== config.productId)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveProduct(idx)}
                      className={cn(isDetail && "hidden")}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ) : (
                <PricingConfigurationProvider
                  productName={config.name}
                  productId={config.productId}
                  onRemoveProduct={handleRemoveProduct}
                  productIndex={idx}
                  variant={config.variant}
                  totalColors={Number(config.variant?.totalColors ?? 0)}
                  totalVariants={Number(config.variant?.totalVariants ?? 0)}
                  mode={mode}
                >
                  <CustomPricingProductVariant mode={mode} />
                </PricingConfigurationProvider>
              )}
            </div>
          ))}
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              type="button"
              onClick={handleAddProduct}
              disabled={disabled}
              className={cn(isDetail && "hidden")}
            >
              <PlusIcon /> Add product
            </Button>
          </TooltipTrigger>
          <TooltipContent color="dark" side="top">
            Please select a team before adding a product
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
