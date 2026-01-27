import { useInfiniteQueryPod } from "@/services/connect-rpc/transport"
import { StaffListGMProductForCustomPriceFilteringResponse_Product } from "@/services/connect-rpc/types"
import { staffListGMProductForCustomPriceFiltering } from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { _debounce } from "@gearment/utils"
import { useCallback, useMemo, useState } from "react"
import { ComboboxSingleSearch } from "../form-create/combobox-single-search"

const LIMIT_SEARCH_INFINITE = 30

interface Props {
  onChange: (
    value: StaffListGMProductForCustomPriceFilteringResponse_Product,
  ) => void
  value: string
  excludeIds?: string[]
}

export default function SelectProduct({
  onChange,
  value,
  excludeIds = [],
}: Props) {
  const [searchText, setSearchText] = useState<string>("")

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQueryPod(
      staffListGMProductForCustomPriceFiltering,
      {
        paging: {
          cursor: "",
          limit: LIMIT_SEARCH_INFINITE,
        },
        search: {
          searchText: searchText ? [searchText] : [],
        },
        filter: {
          chosenProductIds: [],
        },
      },
      {
        pageParamKey: "paging",
        getNextPageParam: (lastPage) => {
          if (!lastPage?.paging) return undefined
          if (lastPage.paging.hasNext && lastPage.paging.nextCursor) {
            return {
              cursor: lastPage.paging.nextCursor,
              limit: LIMIT_SEARCH_INFINITE,
            }
          }
          return undefined
        },
      },
    )

  const products = useMemo(() => {
    return data?.pages.reduce(
      (
        result: StaffListGMProductForCustomPriceFilteringResponse_Product[],
        page,
      ) => {
        const productsOfPage = page.data
        if (productsOfPage) {
          return [...result, ...productsOfPage]
        }
        return result
      },
      [],
    )
  }, [data])

  const listProductOptions = useMemo(() => {
    if (!products) return []
    const excludeSet = new Set(excludeIds)
    return products
      .filter((product) => {
        if (product.productId === value) return true
        return !excludeSet.has(product.productId)
      })
      .map((product) => {
        return {
          label: product.name,
          value: product.productId,
          product,
        }
      })
  }, [products, excludeIds, value])

  const onSearchChange = useCallback(
    _debounce((value: string) => {
      setSearchText(value)
    }, 600),
    [],
  )

  const loading = isLoading || isFetchingNextPage

  const handleChange = useCallback(
    (selectedValue: string | null) => {
      if (!selectedValue) {
        onChange(
          new StaffListGMProductForCustomPriceFilteringResponse_Product({
            productId: "",
            name: "",
          }),
        )
        return
      }
      const found = products?.find((p) => p.productId === selectedValue)
      if (found) {
        onChange(
          new StaffListGMProductForCustomPriceFilteringResponse_Product({
            productId: found.productId,
            name: found.name,
          }),
        )
      } else {
        onChange(
          new StaffListGMProductForCustomPriceFilteringResponse_Product({
            productId: selectedValue,
            name: "",
          }),
        )
      }
    },
    [onChange, products],
  )

  return (
    <ComboboxSingleSearch
      label="Product"
      placeholder="Search product by name"
      options={listProductOptions}
      defaultValue={value ?? undefined}
      onChange={(selectedValue?: string) => {
        handleChange(selectedValue ?? null)
      }}
      disabled={loading}
      onSearch={onSearchChange}
      hasMore={hasNextPage}
      fetchNextPage={fetchNextPage}
      loading={loading}
      size="default"
    />
  )
}
