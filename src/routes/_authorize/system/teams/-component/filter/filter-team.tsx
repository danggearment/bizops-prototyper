import FormSearch from "@/components/form-search/form-search.tsx"
import {
  AllGMTeamStatus,
  AllGMTeamStatusLabel,
  AllTeamRushOrder,
  AllTeamRushOrderLabel,
} from "@/constants/gm-team-status.tsx"
import { FilterTeamType } from "@/schemas/schemas/team.ts"
import { formatDateRangeForSearching } from "@/utils/format-date.ts"
import { StaffListProductPriceTierKeyResponse_Key } from "@gearment/nextapi/api/pod/v1/product_admin_pb"
import {
  Button,
  cn,
  Combobox,
  ComboboxMultiField,
  DatePickerWithRange,
  DateRangeDatePicker,
  Option,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { useSearch } from "@tanstack/react-router"
import { RefreshCwIcon } from "lucide-react"
import { useMemo } from "react"

const TeamStatusOptions = [
  {
    value: `${AllGMTeamStatus.ACTIVE}`,
    label: AllGMTeamStatusLabel[AllGMTeamStatus.ACTIVE],
  },
  {
    value: `${AllGMTeamStatus.INACTIVE}`,
    label: AllGMTeamStatusLabel[AllGMTeamStatus.INACTIVE],
  },
  {
    value: `${AllGMTeamStatus.BLOCKED}`,
    label: AllGMTeamStatusLabel[AllGMTeamStatus.BLOCKED],
  },
]

const RushOrderTeamOptions = [
  {
    value: `${AllTeamRushOrder.UNKNOWN}`,
    label: AllTeamRushOrderLabel[AllTeamRushOrder.UNKNOWN],
  },
  {
    value: `${AllTeamRushOrder.TRUE}`,
    label: AllTeamRushOrderLabel[AllTeamRushOrder.TRUE],
  },
  {
    value: `${AllTeamRushOrder.FALSE}`,
    label: AllTeamRushOrderLabel[AllTeamRushOrder.FALSE],
  },
]

interface Props {
  handleChangeSearch: (search: FilterTeamType) => void
  handleResetFilter: () => void
  handleRefetchData: () => void
  isRefetching: boolean
  tierKeys?: StaffListProductPriceTierKeyResponse_Key[]
}

export default function FilterTeam({
  handleChangeSearch,
  handleResetFilter,
  handleRefetchData,
  isRefetching,
  tierKeys,
}: Props) {
  const search = useSearch({
    from: "/_authorize/system/teams/",
  })

  const handleSetDate = (dateRange: DateRangeDatePicker | undefined) => {
    const fromTo = formatDateRangeForSearching(dateRange)
    const newFilter: FilterTeamType = {
      ...search,
      ...fromTo,
      page: 1,
    }
    handleChangeSearch(newFilter)
  }

  const tierOptions = useMemo<Option[]>(() => {
    return (
      tierKeys?.map((key) => ({
        value: key.tierId,
        label: key.tierName,
      })) || []
    )
  }, [tierKeys])

  return (
    <div className="space-y-4">
      <FormSearch
        placeholder="Search email / teamname"
        value={search.searchText}
        onSubmit={({ searchText }) => {
          handleChangeSearch({
            ...search,
            page: 1,
            searchText,
          })
        }}
      />
      <div className="flex gap-4">
        <div className="w-[200px]">
          <DatePickerWithRange
            placeholder="Created date"
            from={search.from ? new Date(search.from) : undefined}
            to={search.to ? new Date(search.to) : undefined}
            setDate={handleSetDate}
          />
        </div>
        <div className="w-[200px]">
          <ComboboxMultiField
            placeholder="Tier level"
            value={search.tierIds || []}
            options={tierOptions}
            onChange={(values) => {
              handleChangeSearch({
                ...search,
                tierIds: values,
              })
            }}
          />
        </div>
        <div className="w-[200px]">
          <Combobox
            placeholder="Status"
            value={search.status ? `${search.status}` : undefined}
            options={TeamStatusOptions}
            onChange={(value) => {
              handleChangeSearch({
                ...search,
                status: Number(value),
              })
            }}
          />
        </div>
        <div className="w-[200px]">
          <Combobox
            placeholder="Rush team / Normal team"
            value={search.isRushOrder ? `${search.isRushOrder}` : undefined}
            options={RushOrderTeamOptions}
            onChange={(value) => {
              handleChangeSearch({
                ...search,
                isRushOrder: Number(value),
              })
            }}
          />
        </div>
        <Button variant="outline" onClick={handleResetFilter}>
          Reset filter
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={async () => {
                await handleRefetchData()
              }}
              variant="outline"
            >
              <RefreshCwIcon
                className={cn({
                  "animate-spin": isRefetching,
                })}
              />
            </Button>
          </TooltipTrigger>

          <TooltipContent side="top">Refresh data table</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
