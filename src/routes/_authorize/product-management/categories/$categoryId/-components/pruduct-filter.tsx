import { ProductStatusOptions } from "@/constants/product"
import { ProductSearchSchema } from "@/schemas/schemas/product"
import {
  Button,
  cn,
  ComboboxMulti,
  InputField,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { RefreshCwIcon, SearchIcon } from "lucide-react"
import { useCallback, useState } from "react"
import { useCategoryDetail } from "../-category-detail-context"

export function ProductFilter() {
  const {
    handleSetFilter,
    handleRefetchData,
    rowCount,
    products,
    isRefetching,
  } = useCategoryDetail()
  const navigate = useNavigate({
    from: "/product-management/categories/$categoryId",
  })
  const search = useSearch({
    from: "/_authorize/product-management/categories/$categoryId/",
  })
  const [searchText, setSearchText] = useState(search.searchText)

  const debouncedHandleSearch = useCallback(
    _debounce((value: string) => {
      handleSetFilter({
        ...search,
        page: 1,
        searchText: value,
      })
    }, 300),
    [],
  )

  const handleSearch = (value: string) => {
    setSearchText(value)
    debouncedHandleSearch(value)
  }

  const handleResetFilter = () => {
    setSearchText("")
    navigate({
      to: "/product-management/categories/$categoryId",
      search: ProductSearchSchema.parse({}),
      replace: true,
    })
  }

  return (
    <div className="bg-background rounded-lg p-4 space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-2">
          <InputField
            leftIcon={<SearchIcon size={14} className="text-gray-500" />}
            placeholder="Search by product name, SKU, or vendor"
            value={searchText}
            onChange={(value) => handleSearch(value.target.value)}
          />
        </div>
        <div className="col-span-1">
          <ComboboxMulti
            value={search.statuses?.map((v) => String(v))}
            placeholder="All status"
            options={ProductStatusOptions}
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
          <ComboboxMulti
            value={[]}
            placeholder="All vendor"
            options={[]}
            allowClear
            modal
            onChange={() => {}}
          />
        </div>
      </div>
      <div className="flex gap-4 justify-between items-center">
        {products.length} of {rowCount} records
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
