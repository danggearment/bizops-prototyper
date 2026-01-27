import FormSearch from "@/components/form-search/form-search"
import {
  PermissionFilterSchema,
  PermissionFilterType,
} from "@/schemas/schemas/permission"
import { formatDateRangeForSearching } from "@/utils/format-date"
import {
  DatePickerWithRange,
  DateRangeDatePicker,
  PageHeader,
} from "@gearment/ui3"
import { createFileRoute } from "@tanstack/react-router"
import TablePermission from "../members/-component/table-permission/table-permission"

export const Route = createFileRoute("/_authorize/system/permissions/")({
  beforeLoad: () => ({
    breadcrumb: [
      {
        link: "#",
        name: "System",
        search: undefined,
      },
      {
        link: "/system/permissions",
        name: "Permissions",
        search: undefined,
      },
    ],
  }),
  validateSearch: PermissionFilterSchema,
  component: Index,
})

function Index() {
  const search = Route.useSearch()

  const navigate = Route.useNavigate()

  const handleChangeSearch = (search: PermissionFilterType) => {
    navigate({
      from: "/system/permissions",
      replace: true,
      search: (old) => ({
        ...old,
        ...search,
      }),
    })
  }

  const handleSetDate = (dateRange?: DateRangeDatePicker) => {
    const fromTo = formatDateRangeForSearching(dateRange)
    const newFilter: PermissionFilterType = {
      ...search,
      ...fromTo,
    }
    handleChangeSearch(newFilter)
  }

  const handleSubmit = (searchText: string) => {
    const newFilter = {
      ...search,
      searchText: searchText,
      page: 1,
    }
    handleChangeSearch(newFilter)
  }

  return (
    <div className="space-y-4">
      <PageHeader>
        <PageHeader.Title>List Permissions</PageHeader.Title>
      </PageHeader>
      <div className="bg-background p-4 rounded-lg space-y-4">
        <div className="w-[200px]">
          <DatePickerWithRange
            from={search.from ? new Date(Number(search.from)) : undefined}
            to={search.to ? new Date(Number(search.to)) : undefined}
            setDate={handleSetDate}
            placeholder="All time"
          />
        </div>
        <FormSearch
          placeholder="Enter username or group name"
          value={search.searchText}
          onSubmit={({ searchText }) => {
            handleSubmit(searchText)
          }}
        />
      </div>
      <div className="bg-background p-4 rounded-lg">
        <TablePermission />
      </div>
    </div>
  )
}
