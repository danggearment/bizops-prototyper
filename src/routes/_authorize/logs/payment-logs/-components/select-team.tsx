import { useTeamDetailMutation } from "@/data-center/teams"
import {
  useInfiniteQueryIam,
  useQueryIam,
} from "@/services/connect-rpc/transport"
import { Team_Detail } from "@/services/connect-rpc/types"
import { staffListTeamForFiltering } from "@gearment/nextapi/api/iam/v1/api_staff_team-StaffTeamAPI_connectquery"
import { staffListAllGMTeam } from "@gearment/nextapi/api/iam/v1/team-TeamAPI_connectquery"
import { ComboboxSearch } from "@gearment/ui3"
import { _debounce } from "@gearment/utils"

import { useNavigate, useSearch } from "@tanstack/react-router"
import { useCallback, useEffect, useMemo, useState } from "react"

const limit = 10
export default function SelectTeam() {
  const search = useSearch({
    from: "/_authorize/logs/payment-logs/",
  })
  const navigate = useNavigate({
    from: "/logs/payment-logs",
  })

  const { mutateAsync: getTeamDetail } = useTeamDetailMutation()
  const [searchTeam, setSearchTeam] = useState("")
  const [defaultOptionsSelected, setDefaultOptionsSelected] = useState<
    {
      label: string
      value: string
    }[]
  >([])

  useQueryIam(staffListTeamForFiltering)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useInfiniteQueryIam(
      staffListAllGMTeam,
      {
        filter: {
          searchText: searchTeam,
        },
        page: 1,
        limit,
      },
      {
        pageParamKey: "page",
        getNextPageParam: (lastPage, allPages) => {
          const maxPages = Math.ceil(Number(lastPage.total) / limit)
          const currentPage = allPages.length
          if (currentPage <= maxPages) {
            return currentPage + 1
          }
          return undefined
        },
      },
    )

  const teams = useMemo(() => {
    return data?.pages.reduce((result: Team_Detail[], page) => {
      const teamsOfPage = page.data
      if (teamsOfPage) {
        return [...result, ...teamsOfPage]
      }
      return result
    }, [])
  }, [data])

  const teamsOptions = useMemo(
    () =>
      (teams || []).map((team) => ({
        label: `${team.teamName} (${team.teamId})`,
        value: team.teamId,
      })),
    [teams],
  )
  const onSearch = useCallback(
    _debounce((value: string) => {
      setSearchTeam(value)
    }, 500),
    [],
  )

  const onChange = useCallback((value: string[]) => {
    navigate({
      search: (old) => ({
        ...old,
        teamIds: value,
      }),
      replace: true,
    })
  }, [])

  useEffect(() => {
    const fetchTeamDetail = async () => {
      const result = await Promise.all(
        search.teamIds.map(async (teamId) => {
          const team = await getTeamDetail({
            teamId: teamId,
          })
          return {
            label: `${team.teamName} (${teamId})`,
            value: teamId,
          }
        }),
      )
      setDefaultOptionsSelected(result)
    }
    fetchTeamDetail()
  }, [search.teamIds])

  const loading = isPending || isFetchingNextPage

  return (
    <ComboboxSearch
      label="Select team"
      placeholder="Select team"
      options={teamsOptions}
      defaultOptionsSelected={defaultOptionsSelected}
      defaultValues={search.teamIds.map((teamId) => teamId.toString())}
      loading={loading}
      hasMore={hasNextPage}
      fetchNextPage={fetchNextPage}
      onChange={onChange}
      onSearch={onSearch}
      size="default"
    />
  )
}
