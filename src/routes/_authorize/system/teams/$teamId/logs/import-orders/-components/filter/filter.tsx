import { OrderImportStatusLabel } from "@/constants/enum-label.ts"
import { LogsImportOrdersSearchType } from "@/schemas/schemas/logs-import-orders"
import { formatDateRangeForSearching } from "@/utils/format-date.ts"
import { OrderAdmin_OrderDraftImportSessionStatus } from "@gearment/nextapi/api/pod/v1/admin_api_type_pb"
import {
  Button,
  cn,
  ComboboxMulti,
  DatePickerWithRange,
  DateRangeDatePicker,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { useSearch } from "@tanstack/react-router"
import { RefreshCwIcon } from "lucide-react"

const LogsImportOrdersStatusOptions = [
  {
    value: `${OrderAdmin_OrderDraftImportSessionStatus.ALL}`,
    label: OrderImportStatusLabel[OrderAdmin_OrderDraftImportSessionStatus.ALL],
  },
  {
    value: `${OrderAdmin_OrderDraftImportSessionStatus.PENDING}`,
    label:
      OrderImportStatusLabel[OrderAdmin_OrderDraftImportSessionStatus.PENDING],
  },
  {
    value: `${OrderAdmin_OrderDraftImportSessionStatus.PROCESSING}`,
    label:
      OrderImportStatusLabel[
        OrderAdmin_OrderDraftImportSessionStatus.PROCESSING
      ],
  },
  {
    value: `${OrderAdmin_OrderDraftImportSessionStatus.SUCCESS}`,
    label:
      OrderImportStatusLabel[OrderAdmin_OrderDraftImportSessionStatus.SUCCESS],
  },
  {
    value: `${OrderAdmin_OrderDraftImportSessionStatus.FAILED}`,
    label:
      OrderImportStatusLabel[OrderAdmin_OrderDraftImportSessionStatus.FAILED],
  },
]

interface Props {
  handleChangeSearch: (search: LogsImportOrdersSearchType) => void
  handleResetFilter: () => void
  handleRefetchData: () => void
  isRefetching: boolean
}

export default function FilterLogsImportOrders({
  handleChangeSearch,
  handleResetFilter,
  handleRefetchData,
  isRefetching,
}: Props) {
  const search = useSearch({
    from: "/_authorize/system/teams/$teamId/logs/import-orders/",
  })

  const handleSetDate = (dateRange: DateRangeDatePicker | undefined) => {
    const fromTo = formatDateRangeForSearching(dateRange)
    const newFilter: LogsImportOrdersSearchType = {
      ...search,
      ...fromTo,
      page: 1,
    }
    handleChangeSearch(newFilter)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="w-[240px]">
          <DatePickerWithRange
            placeholder="Created Date"
            from={search.from ? new Date(search.from) : undefined}
            to={search.to ? new Date(search.to) : undefined}
            setDate={handleSetDate}
          />
        </div>

        <div className="w-[200px]">
          <ComboboxMulti
            placeholder="Status"
            value={search.status?.map((status) => `${status}`)}
            options={LogsImportOrdersStatusOptions}
            onChange={(value) => {
              handleChangeSearch({
                ...search,
                status: value.map((status) => Number(status)),
              })
            }}
          />
        </div>

        <Button variant="outline" onClick={handleResetFilter}>
          Reset filter
        </Button>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={async () => {
                await handleRefetchData()
              }}
              variant="outline"
            >
              <RefreshCwIcon
                className={cn({
                  "animate-spin": isRefetching,
                })}
              />
            </Button>
          </TooltipTrigger>

          <TooltipContent side="top">Refresh data table</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
