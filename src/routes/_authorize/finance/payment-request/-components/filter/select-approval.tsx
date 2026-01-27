import { StaffListStatementPaymentRequestType } from "@/schemas/schemas/payment"
import { useInfiniteQueryIam } from "@/services/connect-rpc/transport"
import { staffListStaffForFiltering } from "@gearment/nextapi/api/iam/v1/staff_account-StaffAccountAPI_connectquery"
import { StaffListStaffForFilteringResponse_Staff } from "@gearment/nextapi/api/iam/v1/staff_account_pb"
import { ComboboxSearch } from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { useCallback, useMemo, useState } from "react"

const LIMIT_SEARCH_INFINITE = 50

interface Props {
  handleSetNewSearch: (search: StaffListStatementPaymentRequestType) => void
  search: StaffListStatementPaymentRequestType
}

export default function SelectApproval({ handleSetNewSearch, search }: Props) {
  const [searchText, setSearchText] = useState("")

  const { data, hasNextPage, fetchNextPage, isPending, isFetchingNextPage } =
    useInfiniteQueryIam(
      staffListStaffForFiltering,
      {
        pagination: {
          page: 1,
          limit: LIMIT_SEARCH_INFINITE,
        },
        searchTokens: searchText ? [searchText] : undefined,
      },
      {
        pageParamKey: "pagination",
        getNextPageParam: (lastPage, allPages) => {
          const maxPages = Math.ceil(
            Number(lastPage.pagination?.total ?? 0) / LIMIT_SEARCH_INFINITE,
          )
          const currentPage = allPages.length
          if (currentPage < maxPages) {
            return { page: currentPage + 1, limit: LIMIT_SEARCH_INFINITE }
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
        label: staff.username || staff.email || staff.fullName,
        value: staff.staffId,
      })),
    [staffs],
  )

  const selectedOptions = useMemo(() => {
    return staffsOptions.filter((option) =>
      (search.resolverIds || []).includes(option.value),
    )
  }, [staffsOptions, search.resolverIds])

  const onSearchChange = useCallback(
    _debounce((value: string) => {
      setSearchText(value)
    }, 600),
    [],
  )

  const _debounceSubmit = useMemo(
    () =>
      _debounce((filter: StaffListStatementPaymentRequestType) => {
        handleSetNewSearch({
          ...filter,
        })
      }, 600),
    [handleSetNewSearch],
  )

  const onChange = useCallback(
    (value: string[]) => {
      _debounceSubmit({
        ...search,
        page: 1,
        resolverIds: value.length ? value : undefined,
      })
    },
    [_debounceSubmit, search],
  )

  const loading = isPending || isFetchingNextPage

  return (
    <ComboboxSearch
      label="Select approval/rejector"
      placeholder="Select approval/rejector"
      options={staffsOptions}
      defaultOptionsSelected={selectedOptions}
      defaultValues={search.resolverIds || []}
      loading={loading}
      hasMore={hasNextPage}
      fetchNextPage={fetchNextPage}
      onChange={onChange}
      onSearch={onSearchChange}
      size="default"
    />
  )
}
