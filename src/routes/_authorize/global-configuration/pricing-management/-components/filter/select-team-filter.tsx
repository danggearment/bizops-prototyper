import { ListPricingRuleType } from "@/schemas/schemas/pricing"
import { useInfiniteQueryIam } from "@/services/connect-rpc/transport"
import { staffListUserTeamForUpdateTierFiltering } from "@gearment/nextapi/api/iam/v1/staff_team_filtering-StaffTeamFilteringService_connectquery"
import { StaffListUserTeamForUpdateTierFilteringResponse_UserTeam } from "@gearment/nextapi/api/iam/v1/staff_team_filtering_pb"
import { ComboboxSearch } from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { useSearch } from "@tanstack/react-router"
import { useCallback, useMemo, useState } from "react"
import { usePricingRule } from "../../-pricing-rule-context"

const LIMIT_SEARCH_INFINITE = 50

export default function SelectTeamFilter() {
  const [searchText, setSearchText] = useState("")
  const { handleSetFilter } = usePricingRule()

  const search = useSearch({
    from: "/_authorize/global-configuration/pricing-management/",
  })

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
      _debounce((filter: ListPricingRuleType) => {
        handleSetFilter({
          ...filter,
        })
      }, 600),
    [handleSetFilter],
  )

  const onChange = useCallback(
    (value: string[]) => {
      _debounceSubmit({
        ...search,
        page: 1,
        teamIds: value,
      })
    },
    [_debounceSubmit, search],
  )

  const loading = isPending || isFetchingNextPage

  return (
    <ComboboxSearch
      label="Search and select teams"
      placeholder="Search and select teams"
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
