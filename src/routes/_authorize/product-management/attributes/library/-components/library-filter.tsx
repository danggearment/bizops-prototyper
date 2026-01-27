import { AttributeLibraryStatusOptions } from "@/constants/attributes"
import { AttributeLibrarySchema } from "@/schemas/schemas/attributes"
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
import { useAttributeLibrary } from "../-attribute-library-context"
import { SelectAttributeGroupFilter } from "./select-attribute-group"

export default function LibraryFilter() {
  const { handleSetFilter, handleRefetchData, isRefetching, loading } =
    useAttributeLibrary()
  const search = useSearch({
    from: "/_authorize/product-management/attributes/library/",
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
      to: "/product-management/attributes/library",
      search: AttributeLibrarySchema.parse({}),
      replace: true,
    })
  }

  const handleSetDate = (dateRange: DateRangeDatePicker | undefined) => {
    const fromTo = formatDateRangeForSearching(dateRange)
    handleSetFilter({ ...search, ...fromTo, page: 1 })
  }

  return (
    <div className="bg-background p-4 rounded-lg space-y-4">
      <InputField
        leftIcon={<SearchIcon size={14} className="text-gray-500" />}
        placeholder="Search by name or code..."
        value={searchText}
        onChange={(value) => handleSearch(value.target.value)}
      />

      <div className="flex flex-col lg:flex-row items-center gap-4 w-full">
        <div className="w-full flex-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="col-span-1">
              <SelectDateRange
                className="w-full justify-between"
                from={
                  search.from
                    ? dayjs(search.from).startOf("D").toDate()
                    : undefined
                }
                to={
                  search.to ? dayjs(search.to).endOf("D").toDate() : undefined
                }
                onChange={handleSetDate}
                timezone={appTimezone.getTimezone()}
              />
            </div>
            <div className="col-span-1">
              <SelectAttributeGroupFilter
                handleSetFilter={handleSetFilter}
                search={search}
              />
            </div>
            <div className="col-span-1">
              <ComboboxMulti
                value={search.statuses?.map((v) => String(v))}
                placeholder="All status"
                options={AttributeLibraryStatusOptions}
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
          </div>
        </div>
        <div className="flex-auto flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleResetFilter}
            disabled={loading}
          >
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
