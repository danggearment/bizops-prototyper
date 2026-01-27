import { UpdateAutoApproveDepositConfigType } from "@/schemas/schemas/system-configuration"
import {
  useInfiniteQueryIam,
  useQueryIam,
} from "@/services/connect-rpc/transport"
import { staffListUserTeamForUpdateTierFiltering } from "@gearment/nextapi/api/iam/v1/staff_team_filtering-StaffTeamFilteringService_connectquery"
import { StaffListUserTeamForUpdateTierFilteringResponse_UserTeam } from "@gearment/nextapi/api/iam/v1/staff_team_filtering_pb"
import { ComboboxSearch, FormField, FormItem, Option } from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { useCallback, useMemo, useState } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useSystemConfiguration } from "../-system-configuration-context"

const LIMIT = 50

const formatLabel = (team: {
  teamName: string
  teamEmail: string
  teamId: string
}) =>
  team.teamEmail
    ? `${team.teamName || team.teamId} (${team.teamEmail})`
    : team.teamName || team.teamId

export default function SelectTeamFilter() {
  const form = useFormContext<UpdateAutoApproveDepositConfigType>()
  const { autoApproveDepositConfig } = useSystemConfiguration()

  const whitelistTeamIds = useMemo(
    () =>
      autoApproveDepositConfig?.whitelistTeams?.map((team) => team.teamId) ||
      [],
    [autoApproveDepositConfig?.whitelistTeams],
  )

  const { data: selectedTeamsData } = useQueryIam(
    staffListUserTeamForUpdateTierFiltering,
    { searchTokens: whitelistTeamIds },
    {
      enabled: whitelistTeamIds.length > 0,
    },
  )

  const [searchText, setSearchText] = useState("")

  const watchedTeamIds = useWatch({
    control: form.control,
    name: "teamIds",
  })
  const teamIds = useMemo(() => watchedTeamIds ?? [], [watchedTeamIds])

  const applyToAllTeams = form.watch("applyToAllTeams")

  const { data, hasNextPage, fetchNextPage, isPending, isFetchingNextPage } =
    useInfiniteQueryIam(
      staffListUserTeamForUpdateTierFiltering,
      {
        pagination: { page: 1, limit: LIMIT },
        searchTokens: searchText ? [searchText] : undefined,
      },
      {
        pageParamKey: "pagination",
        getNextPageParam: (lastPage, allPages) => {
          const maxPages = Math.ceil(
            Number(lastPage.pagination?.total ?? 0) / LIMIT,
          )
          return allPages.length < maxPages
            ? { page: allPages.length + 1, limit: LIMIT }
            : undefined
        },
      },
    )

  const teams = useMemo(() => {
    return data?.pages.reduce(
      (
        result: StaffListUserTeamForUpdateTierFilteringResponse_UserTeam[],
        page,
      ) => {
        const teamsOfPage = page.data
        if (teamsOfPage) {
          return [...result, ...teamsOfPage]
        }
        return result
      },
      [],
    )
  }, [data])

  const teamsOptions = useMemo(() => {
    const baseTeams = (teams || []).map((team) => ({
      label: formatLabel(team),
      value: team.teamId,
    }))

    if (searchText.trim() !== "") {
      return baseTeams
    }

    const teamSelectedOptions = (selectedTeamsData?.data || []).map((team) => ({
      label: formatLabel(team),
      value: team.teamId,
    }))

    const uniqueTeamsMap = new Map<string, Option>()
    baseTeams.forEach((team) => uniqueTeamsMap.set(team.value, team))
    teamSelectedOptions.forEach((team) => uniqueTeamsMap.set(team.value, team))

    return Array.from(uniqueTeamsMap.values())
  }, [teams, selectedTeamsData?.data, searchText])

  const defaultOptionsSelected = useMemo(() => {
    const selectedTeams = selectedTeamsData?.data || []
    if (selectedTeams.length === 0) return []
    return selectedTeams.map((team) => ({
      label: formatLabel(team),
      value: team.teamId,
    }))
  }, [selectedTeamsData?.data])

  const onSearchChange = useCallback(
    _debounce((value: string) => setSearchText(value), 600),
    [],
  )

  return (
    <>
      <FormField
        control={form.control}
        name="teamIds"
        render={({ field }) => (
          <FormItem>
            <ComboboxSearch
              label="Select teams"
              placeholder="Search and select teams"
              options={teamsOptions}
              defaultValues={teamIds}
              defaultOptionsSelected={defaultOptionsSelected}
              loading={isPending || isFetchingNextPage}
              hasMore={hasNextPage}
              fetchNextPage={fetchNextPage}
              onChange={(value) => {
                const isSame =
                  teamIds.length === value.length &&
                  teamIds.every((id) => value.includes(id))
                if (isSame) return

                field.onChange(value)
              }}
              onSearch={onSearchChange}
              size="default"
              disabled={applyToAllTeams}
            />
          </FormItem>
        )}
      />
    </>
  )
}
