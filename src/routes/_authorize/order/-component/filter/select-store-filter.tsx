import { AllOrderSearchType } from "@/schemas/schemas/all-orders"
import {
  useInfiniteQueryStore,
  useMutationStore,
} from "@/services/connect-rpc/transport"
import { Order_OrderStatus } from "@/services/connect-rpc/types"
import {
  staffGetStore,
  staffListStoreForOrderFiltering,
} from "@gearment/nextapi/api/store/v1/admin_api-StoreAdminAPI_connectquery"
import { StaffListStoreForOrderFilteringResponse_Store } from "@gearment/nextapi/api/store/v1/admin_api_pb"
import { ComboboxSearch } from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useAllOrder } from "../../sale-orders/-all-orders-context"

const LIMIT_SEARCH_INFINITE = 10

export default function SelectStoreFilter() {
  const { handleSetFilter, search } = useAllOrder()
  const [searchText, setSearchText] = useState("")
  const [selectedOptions, setSelectedOptions] = useState<
    {
      label: string
      value: string
    }[]
  >([])
  const mutationGetStore = useMutationStore(staffGetStore)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending: isPendingStore,
  } = useInfiniteQueryStore(
    staffListStoreForOrderFiltering,
    {
      searchTokens: searchText ? [searchText] : [],
      pagination: {
        page: 1,
        limit: LIMIT_SEARCH_INFINITE,
      },
    },
    {
      pageParamKey: "pagination",
      getNextPageParam: (lastPage, allPages) => {
        const maxPages = Math.ceil(
          Number(lastPage.pagination?.total || 0) / LIMIT_SEARCH_INFINITE,
        )
        const currentPage = allPages.length
        if (currentPage <= maxPages) {
          return {
            page: currentPage + 1,
            limit: LIMIT_SEARCH_INFINITE,
          }
        }
        return undefined
      },
    },
  )

  const stores = useMemo(() => {
    return data?.pages.reduce(
      (result: StaffListStoreForOrderFilteringResponse_Store[], page) => {
        const staffsOfPage = page.data
        if (staffsOfPage) {
          return [...result, ...staffsOfPage]
        }
        return result
      },
      [],
    )
  }, [data])

  const listStoreOptions = useMemo(
    () =>
      (stores || []).map((store) => ({
        label: `${store.name} (${store.storeId})`,
        value: store.storeId,
      })),
    [stores],
  )

  const onSearchChange = useCallback(
    _debounce((value: string) => {
      setSearchText(value)
    }, 600),
    [],
  )

  const onChange = useCallback((value: string[]) => {
    _debounceSubmit({
      ...search,
      page: 1,
      storeIds: value,
    })
  }, [])

  const _debounceSubmit = useCallback(
    _debounce((filter: AllOrderSearchType) => {
      handleSetFilter({
        ...filter,
        processingStatus: filter.processingStatus
          ? filter.processingStatus
          : Order_OrderStatus.ALL,
      })
    }, 600),
    [],
  )

  const fetchSelectedStoreOptions = async (storeIds: string[]) => {
    const promises = storeIds.map((storeId) =>
      mutationGetStore.mutateAsync({
        storeId,
        teamId: "",
      }),
    )
    const results = await Promise.all(promises)
    const options = results
      .map((result) => {
        if (result.store) {
          return {
            label: `${result.store.name} (${result.store.storeId})`,
            value: result.store.storeId,
          }
        }
        return null
      })
      .filter((result) => result !== null)
    setSelectedOptions(options)
  }

  useEffect(() => {
    if (search.storeIds?.length) {
      fetchSelectedStoreOptions(search.storeIds)
    }
  }, [search.storeIds])

  const loading = isPendingStore || isFetchingNextPage

  return (
    <ComboboxSearch
      label="Select stores"
      placeholder="Select stores"
      options={listStoreOptions}
      defaultOptionsSelected={selectedOptions}
      defaultValues={search.storeIds || []}
      loading={loading}
      hasMore={hasNextPage}
      fetchNextPage={fetchNextPage}
      onChange={onChange}
      onSearch={onSearchChange}
      size="default"
    />
  )
}
