import {
  Button,
  Calendar,
  cn,
  DateRangeDatePicker,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@gearment/ui3"
import { useSearch } from "@tanstack/react-router"
import { format } from "date-fns"
import dayjs from "dayjs"
import { CalendarIcon } from "lucide-react"
import { usePricingRule } from "../../-pricing-rule-context"
import SelectCsFilter from "./select-staff-filter"
import SelectTeamFilter from "./select-team-filter"

const formatDateUrl = "yyyy-MM-dd"

export default function FilterPricingRule() {
  const search = useSearch({
    from: "/_authorize/global-configuration/pricing-management/",
  })

  const { handleSetFilter } = usePricingRule()

  const handleSetStartDate = (dateRange?: DateRangeDatePicker) => {
    const startDate = {
      fromStartTime: dateRange?.from
        ? format(dateRange.from, formatDateUrl)
        : undefined,
    }
    handleSetFilter({ ...search, ...startDate, page: 1 })
  }

  const handleSetEndDate = (dateRange?: DateRangeDatePicker) => {
    const endDate = {
      toEndTime: dateRange?.to
        ? format(dateRange.to, formatDateUrl)
        : undefined,
    }
    handleSetFilter({ ...search, ...endDate, page: 1 })
  }

  return (
    <div className="bg-background rounded-lg mb-4 p-4 space-y-2">
      <p className="text-lg font-bold">Pricing rules</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-500">
            Select user email
          </p>
          <SelectTeamFilter />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-500">Start date</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !search.fromStartTime && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {search.fromStartTime ? (
                  format(search.fromStartTime, "yyyy-MM-dd")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  search.fromStartTime
                    ? dayjs(search.fromStartTime).toDate()
                    : undefined
                }
                onSelect={(date) => {
                  handleSetStartDate({ from: date, to: undefined })
                }}
                initialFocus
              />
              <div className="p-1 border-t">
                <Button
                  variant="ghost"
                  className="w-full p-1 h-[28px] rounded-sm"
                  onClick={() => handleSetStartDate(undefined)}
                >
                  Clear
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-500">End date</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !search.toEndTime && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {search.toEndTime ? (
                  format(search.toEndTime, "yyyy-MM-dd")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  search.toEndTime
                    ? dayjs(search.toEndTime).toDate()
                    : undefined
                }
                onSelect={(date) => {
                  handleSetEndDate({ from: undefined, to: date })
                }}
                disabled={(date) => {
                  return (
                    date &&
                    dayjs(search.fromStartTime).isAfter(
                      dayjs(date).startOf("day"),
                    )
                  )
                }}
                initialFocus
              />
              <div className="p-1 border-t">
                <Button
                  variant="ghost"
                  className="w-full p-1 h-[28px] rounded-sm"
                  onClick={() => handleSetEndDate(undefined)}
                >
                  Clear
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-500">Select creators</p>
          <SelectCsFilter />
        </div>
      </div>
    </div>
  )
}
