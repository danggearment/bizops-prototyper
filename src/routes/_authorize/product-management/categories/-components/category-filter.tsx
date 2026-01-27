import { CategoryStatusOptions } from "@/constants/categories"
import { CategorySchema } from "@/schemas/schemas/categories"
import { appTimezone } from "@/utils"
import {
  Button,
  cn,
  ComboboxMulti,
  DateRangeDatePicker,
  formatDateRangeForSearching,
  Input,
  SelectDateRange,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { useNavigate, useSearch } from "@tanstack/react-router"
import dayjs from "dayjs"
import { RefreshCwIcon, Search } from "lucide-react"
import { useCallback, useState } from "react"
import { useCategoryManagement } from "../-category-management-context"

export function CategoryFilter() {
  const { handleSetFilter, handleRefetchData, isRefetching, loading } =
    useCategoryManagement()

  const search = useSearch({
    from: "/_authorize/product-management/categories/",
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

  const handleSetDate = (dateRange: DateRangeDatePicker | undefined) => {
    const fromTo = formatDateRangeForSearching(dateRange)
    handleSetFilter({ ...search, ...fromTo, page: 1 })
  }

  const handleResetFilter = () => {
    setSearchText("")
    navigate({
      to: "/product-management/categories",
      search: CategorySchema.parse({}),
      replace: true,
    })
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-1">
        <SelectDateRange
          className="w-full justify-between"
          from={
            search.from ? dayjs(search.from).startOf("D").toDate() : undefined
          }
          to={search.to ? dayjs(search.to).endOf("D").toDate() : undefined}
          onChange={handleSetDate}
          timezone={appTimezone.getTimezone()}
        />
      </div>
      <div className="col-span-1">
        <ComboboxMulti
          value={search.statuses?.map((v) => String(v))}
          placeholder="All status"
          options={CategoryStatusOptions}
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
        {/* TODO: next sprint if have api, add created by options */}
        <ComboboxMulti
          value={[]}
          placeholder="Created by"
          options={[]}
          allowClear
          modal
          onChange={() => {}}
        />
      </div>
      <div className="col-span-3">
        <div className="flex items-center gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search category by name or slug"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 h-9"
            />
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
    </div>
  )
}
