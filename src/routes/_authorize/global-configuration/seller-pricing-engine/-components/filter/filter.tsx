import {
  LastUpdatedOptions,
  PricingSourceLabel,
  PricingTierLabel,
  ProductTypeOptions,
} from "@/constants/seller-pricing"
import {
  PricingSource,
  PricingTier,
  SellerPricingSearchSchema,
} from "@/schemas/schemas/seller-pricing"
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { useSearch } from "@tanstack/react-router"
import { RefreshCw, RotateCcw, Search } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { useSellerPricing } from "../../-seller-pricing-context"

export default function FilterSellerPricing() {
  const search = useSearch({
    from: "/_authorize/global-configuration/seller-pricing-engine/",
  })

  const { handleSetFilter } = useSellerPricing()
  const [searchValue, setSearchValue] = useState(search.search || "")

  // Debounced search handler
  const debouncedSearch = useMemo(
    () =>
      _debounce((value: string) => {
        handleSetFilter({ ...search, search: value || undefined, page: 1 })
      }, 300),
    [search, handleSetFilter],
  )

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSearchValue(value)
      debouncedSearch(value)
    },
    [debouncedSearch],
  )

  const handleProductTypeChange = (value: string) => {
    handleSetFilter({
      ...search,
      productType: value === "all" ? undefined : value,
      page: 1,
    })
  }

  const handlePricingSourceChange = (value: string) => {
    handleSetFilter({
      ...search,
      pricingSource: value === "all" ? undefined : (value as PricingSource),
      page: 1,
    })
  }

  const handleTierChange = (value: string) => {
    handleSetFilter({
      ...search,
      tier: value === "all" ? undefined : (value as PricingTier),
      page: 1,
    })
  }

  const handleLastUpdatedChange = (value: string) => {
    handleSetFilter({
      ...search,
      lastUpdated: value === "all" ? undefined : value,
      page: 1,
    })
  }

  const handleResetFilters = () => {
    setSearchValue("")
    handleSetFilter(SellerPricingSearchSchema.parse({}))
  }

  const handleRefresh = () => {
    // In production, this would trigger a refetch of the data
    // For now, just re-apply the same filters
    handleSetFilter({ ...search })
  }

  const hasActiveFilters =
    search.search ||
    search.productType ||
    search.pricingSource ||
    search.tier ||
    search.lastUpdated

  return (
    <div className="bg-background rounded-lg mb-4 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold">Search & Filters</p>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-muted-foreground"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search Input */}
        <div className="space-y-2 lg:col-span-1">
          <p className="text-sm font-semibold text-gray-500">Search</p>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Product name, code, or SKU..."
              value={searchValue}
              onChange={handleSearchChange}
              className="pl-9"
            />
          </div>
        </div>

        {/* Product Type */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-500">Product Type</p>
          <Select
            value={search.productType || "all"}
            onValueChange={handleProductTypeChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {ProductTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pricing Source */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-500">Pricing Source</p>
          <Select
            value={search.pricingSource || "all"}
            onValueChange={handlePricingSourceChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sources</SelectItem>
              {Object.entries(PricingSourceLabel).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tier */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-500">Tier</p>
          <Select value={search.tier || "all"} onValueChange={handleTierChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All tiers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tiers</SelectItem>
              {Object.entries(PricingTierLabel).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Last Updated */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-500">Last Updated</p>
          <Select
            value={search.lastUpdated || "all"}
            onValueChange={handleLastUpdatedChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Any time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any time</SelectItem>
              {LastUpdatedOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
