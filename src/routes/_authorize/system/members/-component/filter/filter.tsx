import FormSearch from "@/components/form-search/form-search.tsx"
import { FilterType } from "@/schemas/schemas/member.ts"
import { formatDateRangeForSearching } from "@/utils/format-date.ts"
import {
  Combobox,
  DatePickerWithRange,
  DateRangeDatePicker,
} from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"

export default function Filter() {
  const search = useSearch({
    from: "/_authorize/system/members/",
  })

  const navigate = useNavigate()

  const handleChangeSearch = (search: FilterType) => {
    navigate({
      to: "/system/members",
      search: (old) => ({
        ...old,
        ...search,
      }),
      replace: true,
    })
  }

  const handleSetDate = (dateRange: DateRangeDatePicker | undefined) => {
    const fromTo = formatDateRangeForSearching(dateRange)
    const newFilter: FilterType = {
      ...search,
      ...fromTo,
      page: 1,
    }
    handleChangeSearch(newFilter)
  }

  return (
    <div className="space-y-4 bg-background p-4 rounded-lg">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-[240px]">
          <DatePickerWithRange
            placeholder="All time"
            from={search.from ? new Date(search.from) : undefined}
            to={search.to ? new Date(search.to) : undefined}
            setDate={handleSetDate}
            className="w-full"
          />
        </div>
        <div className="w-[240px]">
          <Combobox
            placeholder="All role"
            value={search.role ? `${search.role}` : undefined}
            options={[]}
            onChange={(value) => {
              handleChangeSearch({
                ...search,
                role: String(value),
              })
            }}
          />
        </div>
      </div>
      <FormSearch
        placeholder="Enter staff name"
        value={search.searchText}
        onSubmit={({ searchText }) => {
          handleChangeSearch({
            ...search,
            page: 1,
            searchText,
          })
        }}
      />
    </div>
  )
}
