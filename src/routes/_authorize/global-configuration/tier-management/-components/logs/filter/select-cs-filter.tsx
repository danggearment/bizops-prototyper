import { UpdateTeamTierLogsSearchType } from "@/schemas/schemas/global-configuration"
import { useInfiniteQueryIam } from "@/services/connect-rpc/transport"
import { staffListStaffForFiltering } from "@gearment/nextapi/api/iam/v1/staff_account-StaffAccountAPI_connectquery"
import { StaffListStaffForFilteringResponse_Staff } from "@gearment/nextapi/api/iam/v1/staff_account_pb"
import { ComboboxSearch } from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { useCallback, useMemo, useState } from "react"

const limit = 10

interface Props {
  handleSetNewSearch: (newSearch: UpdateTeamTierLogsSearchType) => void
  search: UpdateTeamTierLogsSearchType
}

export default function SelectCsFilter({ handleSetNewSearch, search }: Props) {
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
      (search.staffIds || []).includes(option.value),
    )
  }, [staffsOptions, search.staffIds])

  const debouncedSubmit = useMemo(
    () =>
      _debounce((newFilter: UpdateTeamTierLogsSearchType) => {
        handleSetNewSearch({
          ...newFilter,
        })
      }, 600),
    [handleSetNewSearch],
  )

  const onChange = useCallback(
    (value: string[]) => {
      debouncedSubmit({
        ...search,
        page: 1,
        staffIds: value,
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
      label="Select staff username"
      placeholder="Select staff username"
      options={staffsOptions}
      defaultOptionsSelected={selectedOptions}
      defaultValues={search.staffIds || []}
      loading={loading}
      hasMore={hasNextPage}
      fetchNextPage={fetchNextPage}
      onChange={onChange}
      onSearch={debouncedSetSearchText}
      size="default"
    />
  )
}
