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

export default function FilterSalesUnitChart({ handleChangeSearch }: Props) {
  const search = useSearch({
    from: "/_authorize/dashboard/",
  })
  const defaultFrom = startOfDay(subDays(new Date(), 30))
  const defaultTo = endOfDay(subDays(new Date(), 1))

  useEffect(() => {
    if (!search.fromSalesUnits || !search.toSalesUnits) {
      const fromTo = formatDateRangeForSearching({
        from: defaultFrom,
        to: defaultTo,
      })
      handleChangeSearch({
        ...search,
        fromSalesUnits: fromTo.from,
        toSalesUnits: fromTo.to,
      })
    }
  }, [search, defaultFrom, defaultTo])

  const handleSetDate = (dateRange: DateRangeDatePicker | undefined) => {
    const fromTo = formatDateRangeForSearching(dateRange)
    const newFilter: AreaChartType = {
      ...search,
      fromSalesUnits: fromTo.from,
      toSalesUnits: fromTo.to,
    }
    handleChangeSearch(newFilter)
  }

  return (
    <div className={"max-w-[300px] mb-4"}>
      <SelectDateRange
        from={
          search.fromSalesUnits
            ? dayjs(search.fromSalesUnits).startOf("D").toDate()
            : undefined
        }
        to={
          search.toSalesUnits
            ? dayjs(search.toSalesUnits).endOf("D").toDate()
            : undefined
        }
        onChange={handleSetDate}
        timezone={appTimezone.getTimezone()}
      />
    </div>
  )
}
