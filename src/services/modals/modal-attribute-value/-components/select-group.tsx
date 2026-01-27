import { useInfiniteQueryPod } from "@/services/connect-rpc/transport"
import { GMAttribute_Admin_Short } from "@/services/connect-rpc/types"
import { staffListGMAttributeGroup } from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { ComboboxSearch, LoadingProgress, Skeleton } from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { useCallback, useMemo, useState } from "react"

const LIMIT_SEARCH_INFINITE = 100

interface Props {
  defaultValues: string[]
  onChange: (value: string[]) => void
  attrCode: string
  hasCreateNewAttributeGroup?: boolean
}

export function SelectGroup({
  onChange,
  attrCode,
  defaultValues,
  hasCreateNewAttributeGroup = false,
}: Props) {
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
        selector: {
          attributeValues: attrCode ? [attrCode] : [],
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
      const staffsOfPage = page.data
      if (staffsOfPage) {
        return [...result, ...staffsOfPage]
      }
      return result
    }, [])
  }, [data])

  const listAttributeGroupOptions = useMemo(
    () =>
      (attributeGroups || []).map((attributeGroup) => ({
        label: `${attributeGroup.attrName} (${attributeGroup.attrKey})`,
        value: attributeGroup.attrKey,
        disabled: attributeGroup?.isSelectable,
      })),
    [attributeGroups],
  )

  const selectedOptions = useMemo(() => {
    return listAttributeGroupOptions.filter(
      (option) => option.disabled || defaultValues.includes(option.value),
    )
  }, [listAttributeGroupOptions])

  const onSearchChange = useCallback(
    _debounce((val: string) => {
      setSearchText(val)
    }, 600),
    [],
  )

  const handleChange = useCallback(
    (value: string[]) => {
      onChange(value)
    },
    [onChange],
  )

  const loading = isPending || isFetchingNextPage

  return (
    <div>
      {isPending && (
        <Skeleton className="w-full flex items-center justify-center h-[44px]">
          <LoadingProgress size="default" color="primary" />
        </Skeleton>
      )}
      {!isPending && (
        <ComboboxSearch
          disabled={hasCreateNewAttributeGroup}
          label="Groups"
          placeholder="Select attribute groups (optional)"
          options={listAttributeGroupOptions}
          defaultOptionsSelected={selectedOptions}
          defaultValues={defaultValues}
          loading={loading}
          hasMore={hasNextPage}
          fetchNextPage={fetchNextPage}
          onChange={handleChange}
          onSearch={onSearchChange}
          collapseThreshold={5}
          size="default"
          modal
        />
      )}
    </div>
  )
}
