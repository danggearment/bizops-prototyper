import FormSearch from "@/components/form-search/form-search"
import { AllStoreStatus, StoreStatusLabel } from "@/constants/store"
import { FilterStoreType } from "@/schemas/schemas/store"
import { formatDateRangeForSearching } from "@/utils"
import {
  Combobox,
  DatePickerWithRange,
  DateRangeDatePicker,
} from "@gearment/ui3"
import { useSearch } from "@tanstack/react-router"

const StoreStatusOption = [
  {
    value: `${AllStoreStatus.ALL}`,
    label: StoreStatusLabel[AllStoreStatus.ALL],
  },
  {
    value: `${AllStoreStatus.INACTIVE}`,
    label: StoreStatusLabel[AllStoreStatus.INACTIVE],
  },
  {
    value: `${AllStoreStatus.ACTIVE}`,
    label: StoreStatusLabel[AllStoreStatus.ACTIVE],
  },
]

interface Props {
  handleChangeSearch: (search: FilterStoreType) => void
}

export default function Filter({ handleChangeSearch }: Props) {
  const search = useSearch({
    from: "/_authorize/system/teams/$teamId/store/",
  })

  const handleSetDate = (dateRange: DateRangeDatePicker | undefined) => {
    const fromTo = formatDateRangeForSearching(dateRange)
    const newFilter: FilterStoreType = {
      ...search,
      ...fromTo,
      page: 1,
    }
    handleChangeSearch(newFilter)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-[200px]">
          <Combobox
            placeholder="Status"
            value={search.status ? `${search.status}` : undefined}
            options={StoreStatusOption}
            onChange={(value) => {
              handleChangeSearch({
                ...search,
                status: Number(value),
              })
            }}
          />
        </div>
        <div>
          <DatePickerWithRange
            from={search.from ? new Date(search.from) : undefined}
            to={search.to ? new Date(search.to) : undefined}
            setDate={handleSetDate}
            className="w-[200px]"
          />
        </div>
      </div>
      <div className="flex-[2]">
        <FormSearch
          placeholder="Search store name"
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
    </div>
  )
}
