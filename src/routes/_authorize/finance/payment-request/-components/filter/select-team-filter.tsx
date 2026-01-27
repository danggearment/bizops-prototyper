import { StaffListStatementPaymentRequestType } from "@/schemas/schemas/payment"
import { useInfiniteQueryIam } from "@/services/connect-rpc/transport"
import { staffListUserTeamForUpdateTierFiltering } from "@gearment/nextapi/api/iam/v1/staff_team_filtering-StaffTeamFilteringService_connectquery"
import { StaffListUserTeamForUpdateTierFilteringResponse_UserTeam } from "@gearment/nextapi/api/iam/v1/staff_team_filtering_pb"
import { ComboboxSearch } from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { useCallback, useMemo, useState } from "react"

interface Props {
  handleSetNewSearch: (search: StaffListStatementPaymentRequestType) => void
  search: StaffListStatementPaymentRequestType
}

const LIMIT_SEARCH_INFINITE = 50

export default function SelectTeamFilter({
  handleSetNewSearch,
  search,
}: Props) {
  const [searchText, setSearchText] = useState("")

  const { data, hasNextPage, fetchNextPage, isPending, isFetchingNextPage } =
    useInfiniteQueryIam(
      staffListUserTeamForUpdateTierFiltering,
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

  const teams = useMemo(() => {
    return data?.pages.reduce(
      (
        result: StaffListUserTeamForUpdateTierFilteringResponse_UserTeam[],
        page,
      ) => {
        const staffsOfPage = page.data
        if (staffsOfPage) {
          return [...result, ...staffsOfPage]
        }
        return result
      },
      [],
    )
  }, [data])

  const listTeamOptions = useMemo(
    () =>
      (teams || []).map((team) => ({
        label: `${team.teamName} (${team.teamEmail})`,
        value: team.teamId,
      })),
    [teams],
  )

  const selectedOptions = useMemo(() => {
    return listTeamOptions.filter((option) =>
      search.teamIds?.includes(option.value),
    )
  }, [listTeamOptions, search.teamIds])

  const onSearchChange = useCallback(
    _debounce((value: string) => {
      setSearchText(value)
    }, 600),
    [],
  )

  const _debounceSubmit = useMemo(
    () =>
      _debounce((filter: StaffListStatementPaymentRequestType) => {
        handleSetNewSearch(filter)
      }, 600),
    [handleSetNewSearch],
  )

  const onChange = useCallback(
    (value: string[]) => {
      _debounceSubmit({
        ...search,
        page: 1,
        teamIds: value.length ? value : undefined,
      })
    },
    [_debounceSubmit, search],
  )

  const loading = isPending || isFetchingNextPage

  return (
    <ComboboxSearch
      label="Select teams"
      placeholder="Select teams"
      options={listTeamOptions}
      defaultOptionsSelected={selectedOptions}
      defaultValues={search.teamIds || []}
      loading={loading}
      hasMore={hasNextPage}
      fetchNextPage={fetchNextPage}
      onChange={onChange}
      onSearch={onSearchChange}
      size="default"
    />
  )
}
