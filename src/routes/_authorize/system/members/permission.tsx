import FormSearch from "@/components/form-search/form-search.tsx"
import TablePermission from "@/routes/_authorize/system/members/-component/table-permission/table-permission.tsx"
import { FilterSchema, FilterType } from "@/schemas/schemas/member.ts"
import { formatDateRangeForSearching } from "@/utils/format-date.ts"
import {
  DatePickerWithRange,
  DateRangeDatePicker,
  PageHeader,
} from "@gearment/ui3"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeftIcon } from "lucide-react"

export const Route = createFileRoute("/_authorize/system/members/permission")({
  validateSearch: FilterSchema,
  beforeLoad: () => ({
    breadcrumb: [
      {
        link: "/system/members",
        name: "Members",
        search: undefined,
      },
      {
        link: "system/members/permissions",
        name: "Permissions",
        search: undefined,
      },
    ],
  }),
  component: Index,
})

function Index() {
  const search = Route.useSearch()

  const navigate = Route.useNavigate()

  const handleChangeSearch = (search: FilterType) => {
    navigate({
      to: "/system/members/permission",
      replace: true,
      search: (old) => ({
        ...old,
        ...search,
      }),
    })
  }

  const handleSetDate = (dateRange?: DateRangeDatePicker) => {
    const fromTo = formatDateRangeForSearching(dateRange)
    const newFilter: FilterType = {
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
    <>
      <PageHeader>
        <div className={"flex items-center justify-center"}>
          <Link
            to="/system/members"
            className={"mr-4 items-center flex"}
            search={FilterSchema.parse({})}
          >
            <button>
              <ArrowLeftIcon width={20} height={20} />
            </button>
          </Link>
          <PageHeader.Title>List Permissions</PageHeader.Title>
        </div>
      </PageHeader>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-[1]">
          <FormSearch
            placeholder="Enter username or group name"
            value={search.searchText}
            onSubmit={({ searchText }) => {
              handleSubmit(searchText)
            }}
          />
        </div>
        <div className="w-full max-w-[350px]">
          <DatePickerWithRange
            from={search.from ? new Date(Number(search.from)) : undefined}
            to={search.to ? new Date(Number(search.to)) : undefined}
            setDate={handleSetDate}
            placeholder="All time"
          />
        </div>
      </div>

      <TablePermission />
    </>
  )
}
