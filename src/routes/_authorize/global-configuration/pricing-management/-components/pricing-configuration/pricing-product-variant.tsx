import { formatPrice, getPrice } from "@/utils"
import {
  Button,
  Checkbox,
  cn,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  ComboboxMulti,
  Input,
  InputField,
  LoadingCircle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@gearment/ui3"
import { formatTextMany } from "@gearment/utils"
import { ChevronDown, ChevronRight, CircleX, Trash2 } from "lucide-react"
import {
  BulkMode,
  bulkModeOptions,
  FulfillmentMode,
  fulfillmentOptions,
  PricingRuleDetailMode,
} from "../../-helper"
import { usePricingRule } from "../../-pricing-rule-context"
import { usePricingConfiguration } from "./-pricing-configuration-context"

export default function CustomPricingProductVariant({
  mode,
}: {
  mode: PricingRuleDetailMode
}) {
  const {
    loading,
    actionButtons,
    handleApplyBulk,
    handleVariantChange,
    toggleBaseVariantExpansion,
    handleToggleSelectAllInGroup,
    expandedBaseVariants,
    fulfillment,
    bulkMode,
    bulkValue,
    selectedVariantIds,
    variantState,
    setFulfillment,
    setBulkMode,
    setBulkValue,
    groupedVariants,
    setSelectedVariantIds,
    productName,
    onRemoveProduct,
    productIndex,
    productId,
    mountedCollapse,
    setMountedCollapse,
    totalColors,
    totalVariants,
    handleRemovePriceFbm,
    handleRemovePriceFba,
    selectedSizes,
    setSelectedSizes,
    availableSizes,
    loadingProductDetail,
  } = usePricingConfiguration()

  const { productErrors } = usePricingRule()

  const isHidden = mode === PricingRuleDetailMode.DETAIL

  return (
    <div className="p-4">
      {loading ? (
        <div className="text-center py-2.5">
          <LoadingCircle />
        </div>
      ) : (
        <Collapsible open={mountedCollapse} onOpenChange={setMountedCollapse}>
          <div className="flex items-center space-x-2">
            <CollapsibleTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setMountedCollapse(!mountedCollapse)}
              >
                {mountedCollapse ? (
                  <ChevronDown className="size-4" />
                ) : (
                  <ChevronRight className="size-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <div className="flex items-center gap-2 w-full justify-between">
              <div>
                <p className="text-primary text-lg font-semibold">
                  {productName}
                </p>
                <p className="text-muted-foreground text-sm">
                  {formatTextMany("color", totalColors)}
                  {" • "}
                  {formatTextMany("variant", totalVariants)}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onRemoveProduct(productIndex)}
                className={cn(isHidden && "hidden")}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
          {productErrors[productId] && (
            <div className="mt-2 text-sm text-destructive">
              {productErrors[productId]}
            </div>
          )}
          <CollapsibleContent className="mt-3 transition-all duration-300">
            {loadingProductDetail ? (
              <div className="py-2.5 w-full flex justify-center">
                <LoadingCircle />
              </div>
            ) : (
              <div className="space-y-4">
                <div className={cn("space-y-4", isHidden && "hidden")}>
                  <div className="flex flex-wrap items-center justify-end text-sm gap-2">
                    <div className="flex items-end gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="pl-1 text-sm text-muted-foreground font-medium">
                          Select sizes
                        </label>
                        <ComboboxMulti
                          options={availableSizes}
                          value={selectedSizes}
                          onChange={(values) => setSelectedSizes(values)}
                          placeholder="Select sizes"
                          className="w-50"
                          allowClear
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="pl-1 text-sm text-muted-foreground font-medium">
                          Fulfillment
                        </label>
                        <Select
                          value={fulfillment}
                          onValueChange={(value) =>
                            setFulfillment(value as FulfillmentMode)
                          }
                        >
                          <SelectTrigger className="w-50 h-9 bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border border-border shadow-lg z-50">
                            {fulfillmentOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="pl-1 text-sm text-muted-foreground font-medium">
                          Bulk mode
                        </label>
                        <Select
                          value={bulkMode}
                          onValueChange={(value: BulkMode) =>
                            setBulkMode(value)
                          }
                        >
                          <SelectTrigger className="w-50 h-9 bg-background">
                            <SelectValue placeholder="Select Mode" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border border-border shadow-lg z-50">
                            {bulkModeOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Input
                        type="number"
                        placeholder="Input bulk value"
                        className="w-50"
                        value={bulkValue}
                        onChange={(e) => setBulkValue(e.target.value)}
                      />
                      <Button onClick={handleApplyBulk}>Apply bulk</Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {actionButtons.map((button, index) => (
                      <div
                        className="flex items-center justify-between"
                        key={index}
                      >
                        <button
                          type="button"
                          className="flex-1 text-sm font-semibold text-center px-3 py-2 hover:text-primary transition-colors cursor-pointer"
                          onClick={button.onClick}
                        >
                          {button.label}
                        </button>
                        {index !== actionButtons.length - 1 && (
                          <span className="text-border">/</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  {Object.entries(groupedVariants).map(([code, vars]) => {
                    const groupVariant = vars[0]

                    return (
                      <Collapsible
                        key={code}
                        className="w-full p-2 border rounded-md border-stroke bg-gray-50/50"
                        open={expandedBaseVariants.includes(
                          groupVariant.variantId,
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={
                              vars.every((v) =>
                                selectedVariantIds.includes(v.variantId),
                              ) && vars.length > 0
                            }
                            className={cn("ml-4", isHidden && "hidden")}
                            onCheckedChange={(checked) =>
                              handleToggleSelectAllInGroup(
                                vars,
                                Boolean(checked),
                              )
                            }
                          />
                          <CollapsibleTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                toggleBaseVariantExpansion(
                                  groupVariant.variantId,
                                )
                              }
                            >
                              {expandedBaseVariants.includes(
                                groupVariant.variantId,
                              ) ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <p className="font-semibold capitalize">{code}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatTextMany("option", vars.length ?? 0)}
                          </p>
                        </div>
                        <CollapsibleContent className="mt-2 px-2">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-100">
                                <TableHead className="w-12"></TableHead>
                                <TableHead>Options</TableHead>
                                <TableHead className="text-right w-32">
                                  RSP
                                </TableHead>
                                {fulfillment !== FulfillmentMode.FBA && (
                                  <TableHead className="text-right w-32">
                                    Final Price (FBM)
                                  </TableHead>
                                )}
                                {fulfillment !== FulfillmentMode.FBM && (
                                  <TableHead className="text-right w-32">
                                    Final Price (FBA)
                                  </TableHead>
                                )}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {vars.map((v) => {
                                const isSelected = selectedVariantIds.includes(
                                  v.variantId,
                                )
                                const rsp = v.rsp

                                const currentPrice = variantState[v.variantId]
                                const fbmVal =
                                  currentPrice?.fbm.value ??
                                  (v.customPriceRule?.priceFbm
                                    ? getPrice(v.customPriceRule?.priceFbm)
                                    : "")

                                const fbaVal =
                                  currentPrice?.fba.value ??
                                  (v.customPriceRule?.priceFba
                                    ? getPrice(v.customPriceRule?.priceFba)
                                    : "")

                                return (
                                  <TableRow
                                    key={`${v.variantId}-${code}`}
                                    className="w-full"
                                  >
                                    <TableCell>
                                      <Checkbox
                                        checked={isSelected}
                                        className={cn(isHidden && "hidden")}
                                        onCheckedChange={(checked) => {
                                          setSelectedVariantIds((prev) => {
                                            if (checked) {
                                              if (!prev.includes(v.variantId)) {
                                                return [...prev, v.variantId]
                                              }
                                              return prev
                                            } else {
                                              return prev.filter(
                                                (id) => id !== v.variantId,
                                              )
                                            }
                                          })
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      {v.option2?.name} ({code})
                                    </TableCell>
                                    <TableCell className="text-right w-32">
                                      {formatPrice(rsp)}
                                    </TableCell>
                                    {fulfillment !== FulfillmentMode.FBA && (
                                      <TableCell className="text-right w-32">
                                        <div className="flex flex-col items-end gap-1">
                                          <div className="flex justify-end items-center gap-2 relative">
                                            <InputField
                                              className="max-w-24"
                                              type="text"
                                              placeholder="--"
                                              value={String(fbmVal)}
                                              onChange={(e) =>
                                                handleVariantChange(
                                                  v,
                                                  e.target.value,
                                                  FulfillmentMode.FBM,
                                                )
                                              }
                                              readOnly={isHidden}
                                              rightIcon={
                                                <button
                                                  type="button"
                                                  className={cn(
                                                    isHidden && "hidden",
                                                  )}
                                                  onClick={() => {
                                                    handleRemovePriceFbm(v)
                                                  }}
                                                >
                                                  <CircleX className="size-3.5 text-foreground/50 hover:text-foreground" />
                                                </button>
                                              }
                                            />
                                          </div>
                                          {currentPrice?.fbm.error && (
                                            <span className="text-xs text-destructive">
                                              {currentPrice?.fbm.error}
                                            </span>
                                          )}
                                        </div>
                                      </TableCell>
                                    )}
                                    {fulfillment !== FulfillmentMode.FBM && (
                                      <TableCell className="text-right w-32">
                                        <div className="flex flex-col items-end gap-1">
                                          <div className="flex justify-end items-center gap-2 relative">
                                            <InputField
                                              className="max-w-24"
                                              type="text"
                                              placeholder="--"
                                              value={String(fbaVal)}
                                              onChange={(e) =>
                                                handleVariantChange(
                                                  v,
                                                  e.target.value,
                                                  FulfillmentMode.FBA,
                                                )
                                              }
                                              readOnly={isHidden}
                                              rightIcon={
                                                <button
                                                  type="button"
                                                  className={cn(
                                                    isHidden && "hidden",
                                                  )}
                                                  onClick={() => {
                                                    handleRemovePriceFba(v)
                                                  }}
                                                >
                                                  <CircleX className="size-3.5 text-foreground/50 hover:text-foreground" />
                                                </button>
                                              }
                                            />
                                          </div>
                                          {currentPrice?.fba.error && (
                                            <span className="text-xs text-destructive">
                                              {currentPrice?.fba.error}
                                            </span>
                                          )}
                                        </div>
                                      </TableCell>
                                    )}
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </CollapsibleContent>
                      </Collapsible>
                    )
                  })}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}
