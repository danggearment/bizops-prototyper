import FormSearch from "@/components/form-search/form-search"
import { MigrationDataTypeOptions } from "@/constants/migration"
import {
  MigrationSearchSchema,
  MigrationSearchType,
} from "@/schemas/schemas/migration"
import { queryClient } from "@/services/react-query"
import { appTimezone, formatDateRangeForSearching } from "@/utils"
import {
  staffCountMigrationJobStatus,
  staffListMigrationJob,
} from "@gearment/nextapi/api/migration/v1/migration-MigrationOperationAPI_connectquery"
import {
  Button,
  cn,
  ComboboxMulti,
  DateRangeDatePicker,
  SelectDateRange,
} from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import dayjs from "dayjs"
import { RefreshCcwIcon } from "lucide-react"
import { useMigration } from "../../-migration-context"

export default function FilterMigrationJobs() {
  const navigate = useNavigate({ from: "/dev/migration" })
  const search = useSearch({ from: "/_authorize/dev/migration/" })
  const { isPendingJob } = useMigration()

  const handleChangeSearch = (search: MigrationSearchType) => {
    navigate({
      search: (old) => ({ ...old, ...search }),
      replace: true,
    })
  }

  const handleSetDate = (dateRange: DateRangeDatePicker | undefined) => {
    const fromTo = formatDateRangeForSearching(dateRange)
    const newFilter: MigrationSearchType = {
      ...search,
      from: fromTo.from || "",
      to: fromTo.to || "",
    }
    handleChangeSearch(newFilter)
  }

  const handleRefetch = () => {
    queryClient.invalidateQueries({
      queryKey: [
        staffListMigrationJob.service.typeName,
        staffListMigrationJob.name,
      ],
    })
    queryClient.invalidateQueries({
      queryKey: [
        staffCountMigrationJobStatus.service.typeName,
        staffCountMigrationJobStatus.name,
      ],
    })
  }

  return (
    <div className="space-y-4 bg-background rounded-lg p-4">
      <div>
        <FormSearch
          placeholder="Search"
          value={search.cusIds?.join(",")}
          onSubmit={(values) => {
            handleChangeSearch({
              ...search,
              cusIds: values.searchText ? values.searchText.split(",") : [],
            })
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        <ComboboxMulti
          value={search.dataTypes.map((item) => item.toString())}
          onChange={(values) => {
            handleChangeSearch({
              ...search,
              dataTypes: values.map((item) => Number(item)),
            })
          }}
          className="max-w-[200px] w-[200px]"
          placeholder="Select migration types"
          options={MigrationDataTypeOptions}
          allowClear
          modal
        />
        <SelectDateRange
          from={
            search.from ? dayjs(search.from).startOf("D").toDate() : undefined
          }
          to={search.to ? dayjs(search.to).endOf("D").toDate() : undefined}
          onChange={handleSetDate}
          className="max-w-[200px] w-[200px]"
          timezone={appTimezone.getTimezone()}
        />
        <Button
          variant={"outline"}
          onClick={() => {
            navigate({
              search: (old) => ({
                ...MigrationSearchSchema.parse({}),
                tab: old.tab,
                page: 1,
              }),
            })
          }}
        >
          Reset filter
        </Button>
        <Button
          variant={"outline"}
          onClick={handleRefetch}
          disabled={isPendingJob}
        >
          <RefreshCcwIcon className={cn(isPendingJob && "animate-spin")} />
        </Button>
      </div>
    </div>
  )
}
