import { AreaChartType } from "@/schemas/schemas/area-chart.ts"
import {
  appTimezone,
  formatDateRangeForSearching,
} from "@/utils/format-date.ts"
import { DateRangeDatePicker, SelectDateRange } from "@gearment/ui3"
import { useSearch } from "@tanstack/react-router"
import { endOfDay, startOfDay, subDays } from "date-fns"
import dayjs from "dayjs"
import { useEffect } from "react"
interface Props {
  handleChangeSearch: (search: AreaChartType) => void
}

export default function FilterSalesOrderChart({ handleChangeSearch }: Props) {
  const search = useSearch({
    from: "/_authorize/dashboard/",
  })
  const defaultFrom = startOfDay(subDays(new Date(), 30))
  const defaultTo = endOfDay(subDays(new Date(), 1))

  useEffect(() => {
    if (!search.from || !search.to) {
      handleChangeSearch({
        ...search,
        ...formatDateRangeForSearching({ from: defaultFrom, to: defaultTo }),
      })
    }
  }, [search, defaultFrom, defaultTo])

  const handleSetDate = (dateRange: DateRangeDatePicker | undefined) => {
    const fromTo = formatDateRangeForSearching(dateRange)
    const newFilter: AreaChartType = {
      ...search,
      ...fromTo,
    }
    handleChangeSearch(newFilter)
  }

  return (
    <div className={"max-w-[300px] mb-4"}>
      <SelectDateRange
        from={
          search.from ? dayjs(search.from).startOf("D").toDate() : undefined
        }
        to={search.to ? dayjs(search.to).endOf("D").toDate() : undefined}
        onChange={handleSetDate}
        timezone={appTimezone.getTimezone()}
      />
    </div>
  )
}
