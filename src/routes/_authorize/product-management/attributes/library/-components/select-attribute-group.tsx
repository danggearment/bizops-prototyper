import { AttributeLibrarySearchType } from "@/schemas/schemas/attributes"
import { ListPricingRuleType } from "@/schemas/schemas/pricing"
import { useInfiniteQueryPod } from "@/services/connect-rpc/transport"
import { GMAttribute_Admin_Short } from "@/services/connect-rpc/types"
import { staffListGMAttributeGroup } from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { ComboboxSearch } from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { useCallback, useMemo, useState } from "react"

const LIMIT_SEARCH_INFINITE = 100

interface Props {
  handleSetFilter: (filter: AttributeLibrarySearchType) => void
  search: AttributeLibrarySearchType
}

export function SelectAttributeGroupFilter({ handleSetFilter, search }: Props) {
  const [searchText, setSearchText] = useState("")

  const { data, hasNextPage, fetchNextPage, isPending, isFetchingNextPage } =
    useInfiniteQueryPod(
      staffListGMAttributeGroup,
      {
        paging: {
          page: 1,
          limit: LIMIT_SEARCH_INFINITE,
        },
        search: {
          search: {
            case: "searchText",
            value: searchText ? searchText : "",
          },
        },
      },
      {
        pageParamKey: "paging",
        getNextPageParam: (lastPage, allPages) => {
          const maxPages = Math.ceil(
            Number(lastPage.paging?.total ?? 0) / LIMIT_SEARCH_INFINITE,
          )
          const currentPage = allPages.length
          if (currentPage < maxPages) {
            return { page: currentPage + 1, limit: LIMIT_SEARCH_INFINITE }
          }
          return undefined
        },
      },
    )

  const attributeGroups = useMemo(() => {
    return data?.pages.reduce((result: GMAttribute_Admin_Short[], page) => {
      const attributeGroupsOfPage = page.data
      if (attributeGroupsOfPage) {
        return [...result, ...attributeGroupsOfPage]
      }
      return result
    }, [])
  }, [data])

  const listAttributeGroupOptions = useMemo(
    () => [
      { label: "Ungrouped", value: "" },
      ...(attributeGroups || []).map((attributeGroup) => ({
        label: `${attributeGroup.attrName} (${attributeGroup.attrKey})`,
        value: attributeGroup.attrKey,
      })),
    ],
    [attributeGroups],
  )

  const selectedOptions = useMemo(() => {
    return listAttributeGroupOptions.filter((option) =>
      search.attributeGroupKeys?.includes(option.value),
    )
  }, [listAttributeGroupOptions, search.attributeGroupKeys])

  const onSearchChange = useCallback(
    _debounce((value: string) => {
      setSearchText(value)
    }, 600),
    [],
  )

  const _debounceSubmit = useMemo(
    () =>
      _debounce((filter: ListPricingRuleType) => {
        handleSetFilter(filter)
      }, 600),
    [handleSetFilter],
  )

  const onChange = useCallback(
    (value: string[]) => {
      _debounceSubmit({
        ...search,
        page: 1,
        attributeGroupKeys: value.length ? value : [],
      })
    },
    [_debounceSubmit, search],
  )

  const loading = isPending || isFetchingNextPage

  return (
    <ComboboxSearch
      label="Select attribute group"
      placeholder="Select attribute group"
      options={listAttributeGroupOptions}
      defaultOptionsSelected={selectedOptions}
      defaultValues={search.attributeGroupKeys ?? []}
      loading={loading}
      hasMore={hasNextPage}
      fetchNextPage={fetchNextPage}
      onChange={onChange}
      onSearch={onSearchChange}
      size="default"
    />
  )
}
