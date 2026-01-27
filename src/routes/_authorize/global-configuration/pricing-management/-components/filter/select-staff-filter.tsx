import { ListPricingRuleType } from "@/schemas/schemas/pricing"
import { useInfiniteQueryIam } from "@/services/connect-rpc/transport"
import { staffListStaffForFiltering } from "@gearment/nextapi/api/iam/v1/staff_account-StaffAccountAPI_connectquery"
import { StaffListStaffForFilteringResponse_Staff } from "@gearment/nextapi/api/iam/v1/staff_account_pb"
import { ComboboxSearch } from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { useSearch } from "@tanstack/react-router"
import { useCallback, useMemo, useState } from "react"
import { usePricingRule } from "../../-pricing-rule-context"

const limit = 10

export default function SelectCsFilter() {
  const { handleSetFilter } = usePricingRule()
  const search = useSearch({
    from: "/_authorize/global-configuration/pricing-management/",
  })

  const [searchText, setSearchText] = useState("")

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQueryIam(
      staffListStaffForFiltering,
      {
        searchTokens: searchText ? [searchText] : [],
        pagination: {
          page: 1,
          limit,
        },
      },
      {
        pageParamKey: "pagination",
        getNextPageParam: (lastPage, allPages) => {
          const maxPages = Math.ceil(
            Number(lastPage.pagination?.total || 0) / limit,
          )
          const currentPage = allPages.length
          if (currentPage < maxPages) {
            return {
              page: currentPage + 1,
              limit,
            }
          }
          return undefined
        },
      },
    )

  const staffs = useMemo(() => {
    return data?.pages.reduce(
      (result: StaffListStaffForFilteringResponse_Staff[], page) => {
        const staffsOfPage = page.data
        if (staffsOfPage) {
          return [...result, ...staffsOfPage]
        }
        return result
      },
      [],
    )
  }, [data])

  const staffsOptions = useMemo(
    () =>
      (staffs || []).map((staff) => ({
        label: `${staff.username} (${staff.email})`,
        value: staff.staffId,
      })),
    [staffs],
  )

  const selectedOptions = useMemo(() => {
    return staffsOptions.filter((option) =>
      (search.createdByIds || []).includes(option.value),
    )
  }, [staffsOptions, search.createdByIds])

  const debouncedSubmit = useMemo(
    () =>
      _debounce((newFilter: ListPricingRuleType) => {
        handleSetFilter({
          ...newFilter,
        })
      }, 600),
    [handleSetFilter],
  )

  const onChange = useCallback(
    (value: string[]) => {
      debouncedSubmit({
        ...search,
        page: 1,
        createdByIds: value,
      })
    },
    [debouncedSubmit, search],
  )

  const debouncedSetSearchText = useMemo(
    () =>
      _debounce((value: string) => {
        setSearchText(value)
      }, 600),
    [],
  )

  const loading = isPending || isFetchingNextPage

  return (
    <ComboboxSearch
      label="Select creators"
      placeholder="Select creators"
      options={staffsOptions}
      defaultOptionsSelected={selectedOptions}
      defaultValues={search.createdByIds || []}
      loading={loading}
      hasMore={hasNextPage}
      fetchNextPage={fetchNextPage}
      onChange={onChange}
      onSearch={debouncedSetSearchText}
      size="default"
    />
  )
}
