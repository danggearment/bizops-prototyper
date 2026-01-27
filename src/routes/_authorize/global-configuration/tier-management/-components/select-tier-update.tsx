import { UpdateTeamTierStep } from "@/constants/product-tier"
import { UpdateTeamTierSearchType } from "@/schemas/schemas/global-configuration"
import {
  useInfiniteQueryIam,
  useQueryIam,
} from "@/services/connect-rpc/transport"
//
import { staffListUserTeamForUpdateTierFiltering } from "@gearment/nextapi/api/iam/v1/staff_team_filtering-StaffTeamFilteringService_connectquery"
import { StaffListUserTeamForUpdateTierFilteringResponse_UserTeam } from "@gearment/nextapi/api/iam/v1/staff_team_filtering_pb"
import {
  Button,
  ButtonIconCopy,
  ComboboxField,
  ComboboxSearch,
  DataTable,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Option,
  useTable,
} from "@gearment/ui3"
import { _debounce, formatTextMany } from "@gearment/utils"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { ColumnDef } from "@tanstack/react-table"
import { Eye, Users, X } from "lucide-react"
import { useCallback, useMemo, useState } from "react"
import { useFormContext } from "react-hook-form"

interface SelectTierUpdateProps {
  handleSetNewSearch: (newSearch: UpdateTeamTierSearchType) => void
  priceKeysOptions: Option[]
}

const limit = 100

export function SelectTierUpdate({
  handleSetNewSearch,
  priceKeysOptions,
}: SelectTierUpdateProps) {
  const form = useFormContext<UpdateTeamTierSearchType>()

  const search = useSearch({
    from: "/_authorize/global-configuration/tier-management/update-team-tier",
  })

  const navigate = useNavigate()

  const [searchText, setSearchText] = useState("")

  const { data, fetchNextPage, hasNextPage, isPending } = useInfiniteQueryIam(
    staffListUserTeamForUpdateTierFiltering,
    {
      pagination: {
        page: 1,
        limit,
      },
      searchTokens: searchText ? [searchText] : undefined,
    },
    {
      pageParamKey: "pagination",
      getNextPageParam: (lastPage, allPages) => {
        const maxPages = Math.ceil(
          Number(lastPage.pagination?.total ?? 0) / limit,
        )
        const currentPage = allPages.length
        if (currentPage < maxPages) {
          return { page: currentPage + 1, limit }
        }
        return undefined
      },
    },
  )

  const { data: teamDetail } = useQueryIam(
    staffListUserTeamForUpdateTierFiltering,
    {
      searchTokens: search.teamIds,
    },
    {
      enabled: search.teamIds.length > 0,
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

  const allTeams = useMemo(
    () => [...(teams || []), ...(teamDetail?.data || [])],
    [teams, teamDetail?.data],
  )

  const teamsOptions = useMemo(() => {
    const baseTeams = (teams || []).map((team) => ({
      label: team.teamEmail
        ? `${team.teamName || team.teamId} (${team.teamEmail})`
        : `${team.teamName || team.teamId}`,
      value: team.teamId,
    }))

    // When searching, only show results from API
    if (searchText.trim() !== "") {
      return baseTeams
    }

    const teamDetails = (teamDetail?.data || []).map((team) => ({
      label: team.teamName || team.teamId,
      value: team.teamId,
    }))

    const uniqueTeamsMap = new Map<string, Option>()

    baseTeams.forEach((team) => {
      uniqueTeamsMap.set(team.value, team)
    })

    teamDetails.forEach((team) => {
      uniqueTeamsMap.set(team.value, team)
    })

    return Array.from(uniqueTeamsMap.values())
  }, [teams, teamDetail?.data, searchText])

  const ownerTeamsMap = useMemo(() => {
    const map = new Map<
      string,
      Array<{ teamId: string; teamName: string; teamEmail: string }>
    >()
    const seen = new Set<string>()

    allTeams.forEach((team) => {
      if (!team?.teamId || seen.has(team.teamId)) return
      seen.add(team.teamId)

      const ownerEmail = team.teamEmail || "--"
      const arr = map.get(ownerEmail) ?? []
      arr.push({
        teamId: team.teamId,
        teamName: team.teamName || team.teamId,
        teamEmail: team.teamEmail || "",
      })
      map.set(ownerEmail, arr)
    })

    return map
  }, [allTeams])

  const selectedOwnerTeamsMap = useMemo(() => {
    const selectedMap = new Map<
      string,
      Array<{ teamId: string; teamName: string; teamEmail: string }>
    >()

    ownerTeamsMap.forEach((teams, ownerEmail) => {
      const selectedTeams = teams.filter((team) =>
        search.teamIds.includes(team.teamId),
      )
      if (selectedTeams.length > 0) {
        selectedMap.set(ownerEmail, selectedTeams)
      }
    })

    return selectedMap
  }, [ownerTeamsMap, search.teamIds])

  const defaultOptionsSelected = useMemo(() => {
    if (search.teamIds.length === 0) return []

    const allTeamsMap = new Map<string, { teamId: string; teamName: string }>()

    allTeams.forEach((team) => {
      allTeamsMap.set(team.teamId, {
        teamId: team.teamId,
        teamName: team.teamName || team.teamId,
      })
    })

    return search.teamIds
      .map((teamId) => {
        const team = allTeamsMap.get(teamId)
        if (team) {
          return {
            label: team.teamName,
            value: team.teamId,
          }
        }
        return null
      })
      .filter((option): option is Option => option !== null)
  }, [search.teamIds, allTeams])

  const handleTeamChange = useCallback(
    (value: string[]) => {
      form.setValue("teamIds", value)
      handleSetNewSearch({
        ...search,
        teamIds: value,
      })
    },
    [form, handleSetNewSearch, search],
  )

  const onSearchChange = useCallback(
    _debounce((value: string) => {
      setSearchText(value)
    }, 600),
    [],
  )

  const handleNewTierChange = useCallback(
    (value: string) => {
      form.setValue("newTier", value)
      handleSetNewSearch({
        ...search,
        newTier: value,
      })
    },
    [form, handleSetNewSearch, search],
  )

  const isDisablePreviewButton = useMemo(() => {
    return search.teamIds.length === 0 || search.newTier === ""
  }, [search.teamIds, search.newTier])

  const handleSubmit = useCallback(
    (_: UpdateTeamTierSearchType) => {
      handleSetNewSearch({
        ...search,
        step: UpdateTeamTierStep.UpdateTier,
      })
    },
    [handleSetNewSearch, search],
  )

  const tableData = useMemo(() => {
    const data: Array<{
      ownerEmail: string
      teams: Array<{ teamId: string; teamName: string; teamEmail: string }>
      totalTeams: number
    }> = []

    selectedOwnerTeamsMap.forEach((teams, ownerEmail) => {
      data.push({
        ownerEmail,
        teams,
        totalTeams: teams.length,
      })
    })

    return data
  }, [selectedOwnerTeamsMap])

  const columns: ColumnDef<{
    ownerEmail: string
    teams: Array<{ teamId: string; teamName: string; teamEmail: string }>
    totalTeams: number
  }>[] = useMemo(
    () => [
      {
        accessorKey: "ownerEmail",
        header: "Email Owner",
        meta: {
          width: "240px",
        },
        cell: ({ row }) => (
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">
                {row.original.ownerEmail}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatTextMany("team", row.original.totalTeams)}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const teamIdsToRemove = row.original.teams.map(
                  (team) => team.teamId,
                )
                const newTeamIds = search.teamIds.filter(
                  (id) => !teamIdsToRemove.includes(id),
                )
                handleTeamChange(newTeamIds)
              }}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ),
      },
      {
        accessorKey: "teams",
        header: "Team Names",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            {row.original.teams.map((team) => (
              <div
                key={team.teamId}
                className="space-y-1 bg-muted/100 rounded-md p-2 "
              >
                <div className="text-sm font-medium">{team.teamName}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-background px-2 py-1 rounded-md">
                    {team.teamId}
                  </span>
                  <ButtonIconCopy
                    size={"sm"}
                    copyValue={team.teamId || ""}
                    className="ml-2"
                  />
                </div>
              </div>
            ))}
          </div>
        ),
      },
    ],
    [search.teamIds, handleTeamChange],
  )

  const table = useTable({
    columns,
    data: tableData,
  })

  return (
    <div className="bg-background p-4 rounded-lg w-[50%] space-y-4">
      <div className="flex items-center gap-2 text-lg font-bold">
        <Users className="w-4 h-4" />
        Update Team Tier(s)
      </div>
      <Form {...form}>
        <div className="w-full h-full flex flex-col flex-1 overflow-y-auto">
          <div className="rounded-lg w-full space-y-4">
            <FormField
              control={form.control}
              name="teamIds"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel required>Select Teams</FormLabel>
                    <FormControl>
                      <ComboboxSearch
                        label="Select Teams"
                        placeholder="Search by team name or owner email"
                        options={teamsOptions}
                        defaultValues={search.teamIds}
                        defaultOptionsSelected={defaultOptionsSelected}
                        loading={isPending}
                        hasMore={hasNextPage}
                        fetchNextPage={fetchNextPage}
                        onChange={(value) => {
                          handleTeamChange(value)
                          field.onChange(value)
                        }}
                        onSearch={onSearchChange}
                        collapseThreshold={defaultOptionsSelected.length}
                        allowClear={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            {selectedOwnerTeamsMap.size > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium">Selected Teams</p>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <DataTable table={table} />
                </div>
              </div>
            )}
            <FormField
              control={form.control}
              name="newTier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Select New Tier</FormLabel>
                  <FormControl>
                    <ComboboxField
                      placeholder="Select New Tier"
                      options={priceKeysOptions}
                      value={field.value || ""}
                      onChange={handleNewTierChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <Button
              onClick={() =>
                navigate({ to: "/global-configuration/tier-management" })
              }
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              disabled={isDisablePreviewButton}
              onClick={form.handleSubmit(handleSubmit)}
              type="button"
              size="sm"
            >
              <Eye className="w-4 h-4" />
              Preview Changes
            </Button>
          </div>
        </div>
      </Form>
    </div>
  )
}
