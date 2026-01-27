import { ProductVariantsSearchType } from "@/schemas/schemas/product"
import {
  useInfiniteQueryPod,
  useMutationPod,
} from "@/services/connect-rpc/transport"
import { staffListGMProductForCustomPriceFiltering } from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { StaffListGMProductForCustomPriceFilteringResponse_Product } from "@gearment/nextapi/api/pod/v1/product_admin_pb"
import { ComboboxSearch } from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { useSearch } from "@tanstack/react-router"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useVariantManagement } from "../-variant-management-context"

const LIMIT_SEARCH_INFINITE = 30

type Option = {
  label: string
  value: string
}

export default function SelectProductFilter() {
  const search = useSearch({
    from: "/_authorize/product-management/variants/",
  })
  const { handleSetFilter } = useVariantManagement()

  const [searchText, setSearchText] = useState("")
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([])

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isPendingProducts,
  } = useInfiniteQueryPod(
    staffListGMProductForCustomPriceFiltering,
    {
      search: {
        searchText: searchText ? [searchText] : [],
      },
      paging: {
        cursor: "",
        limit: LIMIT_SEARCH_INFINITE,
      },
      filter: {
        chosenProductIds: [],
      },
    },
    {
      pageParamKey: "paging",
      getNextPageParam: (lastPage) => {
        if (lastPage.paging?.hasNext && lastPage.paging.nextCursor) {
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
    return data?.pages.reduce<
      StaffListGMProductForCustomPriceFilteringResponse_Product[]
    >((result, page) => {
      if (page.data) {
        result.push(...page.data)
      }
      return result
    }, [])
  }, [data])

  const listProductOptions = useMemo<Option[]>(
    () =>
      (products || []).map((product) => ({
        label: product.name,
        value: product.productId,
      })),
    [products],
  )

  const onSearchChange = useCallback(
    _debounce((value: string) => {
      setSearchText(value)
    }, 600),
    [],
  )

  const _debounceSubmit = useCallback(
    _debounce((filter: ProductVariantsSearchType) => {
      handleSetFilter(filter)
    }, 600),
    [],
  )

  const onChange = useCallback(
    (value: string[]) => {
      _debounceSubmit({
        ...search,
        page: 1,
        productIds: value,
      })
    },
    [search],
  )

  const mutationFetchSelectedProducts = useMutationPod(
    staffListGMProductForCustomPriceFiltering,
  )

  const fetchSelectedProductOptions = async (productIds: string[]) => {
    if (!productIds.length) {
      setSelectedOptions([])
      return
    }

    try {
      const response = await mutationFetchSelectedProducts.mutateAsync({
        paging: {
          cursor: "",
          limit: productIds.length,
        },
        filter: {
          chosenProductIds: productIds,
        },
        search: {},
      })

      const options: Option[] = (response.data || []).map((product) => ({
        label: product.name,
        value: product.productId,
      }))

      setSelectedOptions(options)
    } catch (error) {
      console.error("Failed to fetch selected products", error)
    }
  }

  useEffect(() => {
    if (search.productIds?.length) {
      fetchSelectedProductOptions(search.productIds)
    } else {
      setSelectedOptions([])
    }
  }, [search.productIds])

  const loading = isPendingProducts || isFetchingNextPage

  return (
    <ComboboxSearch
      label="Select products"
      placeholder="Select products"
      options={listProductOptions}
      defaultOptionsSelected={selectedOptions}
      defaultValues={search.productIds || []}
      loading={loading}
      hasMore={hasNextPage}
      fetchNextPage={fetchNextPage}
      onChange={onChange}
      onSearch={onSearchChange}
      size="default"
    />
  )
}
