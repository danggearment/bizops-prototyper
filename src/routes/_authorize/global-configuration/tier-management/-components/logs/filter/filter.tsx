import { TeamPriceTierActionOptions } from "@/constants/product-tier"
import {
  UpdateTeamTierLogsSearchSchema,
  UpdateTeamTierLogsSearchType,
} from "@/schemas/schemas/global-configuration"
import {
  appTimezone,
  formatDateRangeForSearching,
} from "@/utils/format-date.ts"
import {
  Button,
  ComboboxMulti,
  DateRangeDatePicker,
  Option,
  SelectDateRange,
} from "@gearment/ui3"
import dayjs from "dayjs"

import SelectCsFilter from "./select-cs-filter"
import SelectTeamFilter from "./select-team-filter"

interface Props {
  handleSetNewSearch: (newSearch: UpdateTeamTierLogsSearchType) => void
  search: UpdateTeamTierLogsSearchType
  priceKeyOptions: Option[]
}

export function Filter({ handleSetNewSearch, search, priceKeyOptions }: Props) {
  const handleSetDate = (dateRange?: DateRangeDatePicker) => {
    const fromTo = formatDateRangeForSearching(dateRange)
    handleSetNewSearch({
      ...search,
      ...fromTo,
      page: 1,
    })
  }

  const handleResetFilter = () => {
    handleSetNewSearch({
      ...UpdateTeamTierLogsSearchSchema.parse({}),
    })
  }

  return (
    <div className="bg-background rounded-lg mb-4 p-4 space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-500">Date Range</p>
          <SelectDateRange
            from={
              search.from ? dayjs(search.from).startOf("D").toDate() : undefined
            }
            to={search.to ? dayjs(search.to).endOf("D").toDate() : undefined}
            onChange={handleSetDate}
            timezone={appTimezone.getTimezone()}
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-500">
            Select user email
          </p>
          <SelectTeamFilter
            handleSetNewSearch={handleSetNewSearch}
            search={search}
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-500">
            Select staff username
          </p>
          <SelectCsFilter
            handleSetNewSearch={handleSetNewSearch}
            search={search}
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-500">
            Select new tiers
          </p>
          <ComboboxMulti
            placeholder="All new tiers"
            options={priceKeyOptions}
            value={search.newTierIds}
            onChange={(value) => {
              handleSetNewSearch({
                ...search,
                newTierIds: value,
                page: 1,
              })
            }}
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-500">Select Actions</p>
          <ComboboxMulti
            placeholder="All Actions"
            options={TeamPriceTierActionOptions}
            value={(search.actions || []).map((v) => String(v))}
            onChange={(value) => {
              const actionEnums = value
                ?.map((v) => parseInt(v, 10))
                .filter((v) => !Number.isNaN(v))
              handleSetNewSearch({
                ...search,
                actions: actionEnums,
                page: 1,
              })
            }}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="outline" onClick={handleResetFilter}>
          Reset filter
        </Button>
      </div>
    </div>
  )
}
