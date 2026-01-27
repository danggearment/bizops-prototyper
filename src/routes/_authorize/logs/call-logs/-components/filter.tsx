import { CallLogsSearchSchema } from "@/schemas/schemas/call-logs"
import { queryClient } from "@/services/react-query"
import { appTimezone, formatDateRangeForSearching } from "@/utils"
import {
  Button,
  ComboboxMulti,
  DateRangeDatePicker,
  Input,
  SelectDateRange,
  toast,
} from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { RefreshCcwIcon } from "lucide-react"
import { useMemo } from "react"

const statusOptions = [
  { label: "200 - OK", value: "200" },
  { label: "201 - Created", value: "201" },
  { label: "400 - Bad Request", value: "400" },
  { label: "401 - Unauthorized", value: "401" },
  { label: "403 - Forbidden", value: "403" },
  { label: "404 - Not Found", value: "404" },
  { label: "422 - Unprocessable Entity", value: "422" },
  { label: "429 - Too Many Requests", value: "429" },
  { label: "500 - Internal Server Error", value: "500" },
  { label: "502 - Bad Gateway", value: "502" },
  { label: "503 - Service Unavailable", value: "503" },
  { label: "504 - Gateway Timeout", value: "504" },
]

export default function Filter() {
  const navigate = useNavigate({
    from: "/logs/call-logs",
  })
  const search = useSearch({
    from: "/_authorize/logs/call-logs/",
  })
  // TODO: Implement useCallLogsCriteria when API is available
  const teamOptions = useMemo(() => {
    return []
  }, [])

  const storeOptions = useMemo(() => {
    return []
  }, [])

  const handleChangeDateRange = (
    dateRange: DateRangeDatePicker | undefined,
  ) => {
    const formTo = formatDateRangeForSearching(dateRange)
    navigate({
      search: (old) => ({
        ...old,
        from: formTo.from,
        to: formTo.to,
        page: 1,
      }),
      replace: true,
    })
  }

  return (
    <div className="space-y-4 bg-background rounded-lg p-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="w-full sm:w-[240px]">
          <SelectDateRange
            from={search.from ? new Date(search.from) : undefined}
            to={search.to ? new Date(search.to) : undefined}
            onChange={handleChangeDateRange}
            timezone={appTimezone.getTimezone()}
          />
        </div>

        <div className="w-full sm:w-[150px]">
          <ComboboxMulti
            placeholder="Status"
            options={statusOptions}
            value={search.statuses}
            onChange={(value) => {
              navigate({
                search: (old) => ({
                  ...old,
                  page: 1,
                  statuses: value as any,
                }),
                replace: true,
              })
            }}
          />
        </div>

        <div className="w-full sm:w-[150px]">
          <ComboboxMulti
            placeholder="Team"
            options={teamOptions}
            value={search.teamIds}
            onChange={(value) => {
              navigate({
                search: (old) => ({
                  ...old,
                  page: 1,
                  teamIds: value,
                }),
                replace: true,
              })
            }}
          />
        </div>

        <div className="w-full sm:w-[150px]">
          <ComboboxMulti
            placeholder="Store"
            options={storeOptions}
            value={search.storeIds}
            onChange={(value) => {
              navigate({
                search: (old) => ({
                  ...old,
                  page: 1,
                  storeIds: value,
                }),
                replace: true,
              })
            }}
          />
        </div>

        <div className="w-full sm:w-[200px]">
          <Input
            placeholder="Client Key"
            value={search.clientKey || ""}
            onChange={(e) => {
              navigate({
                search: (old) => ({
                  ...old,
                  page: 1,
                  clientKey: e.target.value || undefined,
                }),
                replace: true,
              })
            }}
          />
        </div>

        <Button
          variant={"outline"}
          className="w-full sm:w-auto"
          onClick={() => {
            navigate({
              search: () => ({
                ...CallLogsSearchSchema.parse({}),
              }),
              replace: true,
            })
            toast({
              title: "Reset filter",
              description: "Reset filter successfully",
            })
          }}
        >
          Reset filter
        </Button>

        <Button
          variant={"outline"}
          className="w-full sm:w-auto"
          onClick={() => {
            queryClient.invalidateQueries({
              queryKey: ["api.integration.v1.CallLogIntegrationAPI"],
            })
            toast({
              title: "Refresh data",
              description: "Data refreshed successfully",
            })
          }}
        >
          <RefreshCcwIcon />
        </Button>
      </div>
    </div>
  )
}
