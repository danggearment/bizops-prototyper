import {
  ProductStockOptions,
  ProductStockStatus,
  ProductVariantStatusOptions,
} from "@/constants/product"
import { Button, Combobox, ComboboxMulti, InputField } from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { DownloadIcon, SearchIcon } from "lucide-react"
import { useCallback, useState } from "react"
import { useProductVariants } from "../product-variants-context"

export default function ProductVariantsFilter() {
  const [searchText, setSearchText] = useState("")

  const { search, handleChangeSearch } = useProductVariants()

  const debouncedHandleSearch = useCallback(
    _debounce((value: string) => {
      handleChangeSearch({
        ...search,
        variantSearchText: value,
        page: 1,
      })
    }, 300),
    [],
  )

  const handleSearch = (value: string) => {
    setSearchText(value)
    debouncedHandleSearch(value)
  }

  return (
    <div className="space-y-4 flex flex-col justify-end items-end">
      <div className="grid lg:grid-cols-4 grid-cols-2 gap-4 w-full">
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
            options={ProductVariantStatusOptions}
            allowClear
            modal
            portal={false}
            onChange={(values) => {
              handleChangeSearch({
                ...search,
                statuses: values.map((v) => Number(v)),
                page: 1,
              })
            }}
          />
        </div>
        <div className="col-span-1">
          <Combobox
            value={search.stockStatus}
            placeholder="All stock"
            options={ProductStockOptions}
            modal
            portal={false}
            onChange={(value) => {
              handleChangeSearch({
                ...search,
                stockStatus:
                  value as (typeof ProductStockStatus)[keyof typeof ProductStockStatus],
                page: 1,
              })
            }}
          />
        </div>
      </div>
      <Button variant="outline">
        <DownloadIcon /> Export variants
      </Button>
    </div>
  )
}
