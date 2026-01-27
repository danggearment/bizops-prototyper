import { AttributeGroupValueStatusOptions } from "@/constants/attributes"
import { appTimezone } from "@/utils"
import {
  Button,
  cn,
  ComboboxMulti,
  DateRangeDatePicker,
  formatDateRangeForSearching,
  InputField,
  SelectDateRange,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { useSearch } from "@tanstack/react-router"
import dayjs from "dayjs"
import { RefreshCwIcon, SearchIcon } from "lucide-react"
import { useCallback, useState } from "react"
import { useAttributeGroupValue } from "../-attribute-group-value-context"

export default function GroupValueFilter() {
  const search = useSearch({
    from: "/_authorize/product-management/attributes/group/$groupId/",
  })

  const { handleSetFilter, handleRefetchData, isRefetching } =
    useAttributeGroupValue()

  const [searchText, setSearchText] = useState(search.searchText)

  const debouncedHandleSearch = useCallback(
    _debounce((value: string) => {
      handleSetFilter({
        ...search,
        page: 1,
        searchText: value,
      })
    }, 300),
    [search, handleSetFilter],
  )

  const handleSearch = (value: string) => {
    setSearchText(value)
    debouncedHandleSearch(value)
  }

  const handleResetFilter = () => {
    setSearchText("")
    handleSetFilter({ ...search, page: 1, searchText: "" })
  }
  const handleSetDate = (dateRange: DateRangeDatePicker | undefined) => {
    const fromTo = formatDateRangeForSearching(dateRange)
    handleSetFilter({ ...search, ...fromTo, page: 1 })
  }

  return (
    <div className="bg-background rounded-lg p-4 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="col-span-1 lg:col-span-2">
          <InputField
            leftIcon={<SearchIcon size={14} className="text-gray-500" />}
            placeholder="Search by attribute name, attribute code"
            value={searchText}
            onChange={(value) => handleSearch(value.target.value)}
          />
        </div>
        <div>
          <ComboboxMulti
            value={search.statuses?.map((v) => String(v)) || []}
            placeholder="All status"
            options={AttributeGroupValueStatusOptions}
            allowClear
            modal
            onChange={(value) => {
              handleSetFilter({
                ...search,
                page: 1,
                statuses: value.map((v) => Number(v)),
              })
            }}
          />
        </div>
        <div>
          <SelectDateRange
            className="w-full justify-between"
            from={
              search.from ? dayjs(search.from).startOf("D").toDate() : undefined
            }
            to={search.to ? dayjs(search.to).endOf("D").toDate() : undefined}
            onChange={handleSetDate}
            position="left"
            timezone={appTimezone.getTimezone()}
          />
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={handleResetFilter}>
            Reset filter
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleRefetchData} variant="outline">
                <RefreshCwIcon
                  className={cn({ "animate-spin": isRefetching })}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Refresh data table</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
