import { PrintLocationStatusOptions } from "@/constants/prints"
import { PrintLocationSearchSchema } from "@/schemas/schemas/prints"
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
import { useNavigate, useSearch } from "@tanstack/react-router"
import dayjs from "dayjs"
import { RefreshCwIcon, SearchIcon } from "lucide-react"
import { useCallback, useState } from "react"
import { usePrintLocation } from "../-print-location-context"

export function LocationFilter() {
  const { handleSetFilter, handleRefetchData, isRefetching } =
    usePrintLocation()

  const search = useSearch({
    from: "/_authorize/product-management/prints/location/",
  })

  const [searchText, setSearchText] = useState(search.searchText)
  const navigate = useNavigate()

  const debouncedHandleSearch = useCallback(
    _debounce((value: string) => {
      handleSetFilter({
        ...search,
        page: 1,
        searchText: value,
      })
    }, 300),
    [],
  )

  const handleSearch = (value: string) => {
    setSearchText(value)
    debouncedHandleSearch(value)
  }

  const handleResetFilter = () => {
    setSearchText("")
    navigate({
      to: "/product-management/prints/location",
      search: PrintLocationSearchSchema.parse({}),
      replace: true,
    })
  }

  const handleSetDate = (dateRange: DateRangeDatePicker | undefined) => {
    const fromTo = formatDateRangeForSearching(dateRange)
    handleSetFilter({ ...search, ...fromTo, page: 1 })
  }

  return (
    <div className="bg-background p-4 rounded-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="col-span-1">
          <InputField
            leftIcon={<SearchIcon size={14} className="text-gray-500" />}
            placeholder="Search by print location name"
            value={searchText}
            onChange={(value) => handleSearch(value.target.value)}
          />
        </div>
        <div className="grid grid-cols-[1fr_154px] gap-4 col-span-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <ComboboxMulti
                value={search.statuses?.map((v) => String(v))}
                placeholder="All status"
                options={PrintLocationStatusOptions}
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
            <div className="col-span-1">
              <SelectDateRange
                className="justify-between"
                from={
                  search.from
                    ? dayjs(search.from).startOf("D").toDate()
                    : undefined
                }
                to={
                  search.to ? dayjs(search.to).endOf("D").toDate() : undefined
                }
                onChange={handleSetDate}
                position="left"
                timezone={appTimezone.getTimezone()}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
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
    </div>
  )
}
