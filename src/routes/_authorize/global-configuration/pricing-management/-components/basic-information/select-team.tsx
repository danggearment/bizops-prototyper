import { useInfiniteQueryIam } from "@/services/connect-rpc/transport"
import { Team_Detail } from "@/services/connect-rpc/types"
import { staffListAllGMTeam } from "@gearment/nextapi/api/iam/v1/team-TeamAPI_connectquery"
import { _debounce } from "@gearment/utils"
import { useCallback, useMemo, useState } from "react"
import { ComboboxSingleSearch } from "../form-create/combobox-single-search"

const LIMIT_SEARCH_INFINITE = 30

interface Props {
  onChange: (value: string) => void
  disabled?: boolean
  defaultValue?: {
    label: string
    value: string
  }
}

export default function SelectTeam({
  onChange,
  disabled,
  defaultValue,
}: Props) {
  const [searchText, setSearchText] = useState<string>("")

  const { data, hasNextPage, fetchNextPage, isPending, isFetchingNextPage } =
    useInfiniteQueryIam(
      staffListAllGMTeam,
      {
        page: 1,
        limit: LIMIT_SEARCH_INFINITE,
        filter: {
          searchText: searchText,
        },
      },
      {
        enabled: !defaultValue?.value,
        pageParamKey: "page",
        getNextPageParam: (lastPage, allPages) => {
          const maxPages = Math.ceil(
            Number(lastPage.total) / LIMIT_SEARCH_INFINITE,
          )
          const currentPage = allPages.length
          if (currentPage < maxPages) {
            return currentPage + 1
          }
          return undefined
        },
      },
    )

  const teams = useMemo(() => {
    return data?.pages.reduce((result: Team_Detail[], page) => {
      const staffsOfPage = page.data
      if (staffsOfPage) {
        return [...result, ...staffsOfPage]
      }
      return result
    }, [])
  }, [data])

  const listTeamOptions = useMemo(() => {
    if (!teams) return []
    return teams.map((team) => {
      const label = team.email
        ? `${team.teamName} (${team.email})`
        : team.teamName
      return {
        label,
        value: team.teamId,
      }
    })
  }, [teams])

  const onSearchChange = useCallback(
    _debounce((value: string) => {
      setSearchText(value)
    }, 600),
    [],
  )

  const defaultOptionSelected = useMemo(() => {
    return {
      label: defaultValue?.label ?? "",
      value: defaultValue?.value ?? "",
    }
  }, [defaultValue])

  const loading = isPending || isFetchingNextPage

  return (
    <ComboboxSingleSearch
      label="Team"
      placeholder="Search team by team name or team owner email"
      options={listTeamOptions}
      defaultOptionSelected={defaultOptionSelected}
      onChange={(value) => {
        onChange(value ?? "")
      }}
      onSearch={onSearchChange}
      hasMore={!!hasNextPage}
      fetchNextPage={fetchNextPage}
      loading={loading}
      disabled={disabled}
      size="default"
    />
  )
}
