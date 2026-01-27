import { ProductVariantStatusOptions } from "@/constants/product"
import { ProductVariantsSearchSchema } from "@/schemas/schemas/product"
import {
  Button,
  cn,
  ComboboxMulti,
  DateRangeDatePicker,
  formatDateRangeForSearching,
  InputField,
  SelectDateRange,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { useNavigate, useSearch } from "@tanstack/react-router"
import dayjs from "dayjs"
import { RefreshCwIcon, SearchIcon } from "lucide-react"
import { useCallback, useState } from "react"
import { useVariantManagement } from "../-variant-management-context"
import SelectProductFilter from "./select-product-filter"

export default function VariantFilter() {
  const {
    handleSetFilter,
    handleRefetchData,
    variants,
    isRefetching,
    totalVariants,
  } = useVariantManagement()

  const navigate = useNavigate({
    from: "/product-management/variants",
  })
  const search = useSearch({
    from: "/_authorize/product-management/variants/",
  })

  const [searchText, setSearchText] = useState(search.variantSearchText)

  const debouncedHandleSearch = useCallback(
    _debounce((value: string) => {
      handleSetFilter({
        ...search,
        page: 1,
        variantSearchText: value,
      })
    }, 300),
    [],
  )

  const handleSearch = (value: string) => {
    setSearchText(value)
    debouncedHandleSearch(value)
  }

  const handleSetDate = (dateRange: DateRangeDatePicker | undefined) => {
    const fromTo = formatDateRangeForSearching(dateRange)
    handleSetFilter({ ...search, ...fromTo, page: 1 })
  }

  const handleResetFilter = () => {
    setSearchText("")
    navigate({
      to: "/product-management/variants",
      search: ProductVariantsSearchSchema.parse({}),
      replace: true,
    })
  }

  return (
    <div className="bg-background rounded-lg p-4 space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <SelectDateRange
            className="w-full justify-between"
            from={
              search.from ? dayjs(search.from).startOf("D").toDate() : undefined
            }
            to={search.to ? dayjs(search.to).endOf("D").toDate() : undefined}
            onChange={handleSetDate}
          />
        </div>
        <div className="col-span-1">
          <ComboboxMulti
            value={search.statuses?.map((v) => String(v))}
            placeholder="All status"
            options={ProductVariantStatusOptions}
            allowClear
            modal
            onChange={(value) => {
              handleSetFilter({
                ...search,
                page: 1,
                statuses: value.map((v) => Number(v)),
              })
            }}
          />
        </div>
        <div className="col-span-1">
          <SelectProductFilter />
        </div>
        <div className="col-span-3">
          <InputField
            leftIcon={<SearchIcon size={14} className="text-gray-500" />}
            placeholder="Search variants by SKU, product or options..."
            value={searchText}
            onChange={(value) => handleSearch(value.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-4 justify-between items-center">
        {variants.length} of {totalVariants} records
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleResetFilter}>
            Reset filter
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleRefetchData} variant="outline">
                <RefreshCwIcon
                  className={cn({ "animate-spin": isRefetching })}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Refresh data table</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
