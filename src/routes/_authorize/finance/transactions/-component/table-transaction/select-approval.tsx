import { AllTransactionSearchType } from "@/schemas/schemas/payment"
import { useInfiniteQueryIam } from "@/services/connect-rpc/transport"
import { TeamTransactionType } from "@/services/connect-rpc/types"
import { staffListStaffForFiltering } from "@gearment/nextapi/api/iam/v1/staff_account-StaffAccountAPI_connectquery"
import { StaffListStaffForFilteringResponse_Staff } from "@gearment/nextapi/api/iam/v1/staff_account_pb"
import { ComboboxSearch } from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { useCallback, useMemo, useState } from "react"
import { useAllTransaction } from "../../-all-transactions-context"

const limit = 10

export default function SelectApproval() {
  const { handleSetFilter, search } = useAllTransaction()

  const [searchText, setSearchText] = useState("")
  const [selected, setSelected] = useState<string[]>(search.approvalBy || [])

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
          if (currentPage <= maxPages) {
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
        label: staff.fullName || staff.username || staff.email,
        value: staff.staffId,
      })),
    [staffs],
  )

  const selectedOptions = useMemo(() => {
    return staffsOptions.filter((option) => selected.includes(option.value))
  }, [staffsOptions, selected])

  const onChange = useCallback((value: string[]) => {
    setSelected(value)
    _debouceSubmit({
      ...search,
      page: 1,
      approvalBy: value,
    })
  }, [])

  const _debouceSubmit = useCallback(
    _debounce((newFilter: AllTransactionSearchType) => {
      handleSetFilter({
        ...newFilter,
        type: TeamTransactionType.ALL,
      })
    }, 600),
    [],
  )

  const onSearchChange = useCallback(
    _debounce((value: string) => {
      setSearchText(value)
    }, 600),
    [],
  )

  const loading = isPending || isFetchingNextPage

  return (
    <div className={`${selected.length > 0 && "w-[240px]"}`}>
      <ComboboxSearch
        label="Select approval"
        placeholder="Select approval"
        options={staffsOptions}
        defaultOptionsSelected={selectedOptions}
        defaultValues={selected}
        loading={loading}
        hasMore={hasNextPage}
        fetchNextPage={fetchNextPage}
        onChange={onChange}
        onSearch={onSearchChange}
        size="default"
      />
    </div>
  )
}
