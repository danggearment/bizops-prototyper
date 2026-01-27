import { TransactionExportStatusLabel } from "@/constants/payment"
import { TransactionExportSessionStatus } from "@/services/connect-rpc/types"
import { appTimezone, formatDateRangeForSearching } from "@/utils"
import { Combobox, DateRangeDatePicker, SelectDateRange } from "@gearment/ui3"
import { useSearch } from "@tanstack/react-router"
import { useExportTransactions } from "../../-export-transactions-context"

const TransactionExportStatusOption = [
  {
    value: `${TransactionExportSessionStatus.UNSPECIFIED}`,
    label:
      TransactionExportStatusLabel[TransactionExportSessionStatus.UNSPECIFIED],
  },
  {
    value: `${TransactionExportSessionStatus.COMPLETED}`,
    label:
      TransactionExportStatusLabel[TransactionExportSessionStatus.COMPLETED],
  },
  {
    value: `${TransactionExportSessionStatus.FAILED}`,
    label: TransactionExportStatusLabel[TransactionExportSessionStatus.FAILED],
  },
  {
    value: `${TransactionExportSessionStatus.IN_PROGRESS}`,
    label:
      TransactionExportStatusLabel[TransactionExportSessionStatus.IN_PROGRESS],
  },
  {
    value: `${TransactionExportSessionStatus.PENDING}`,
    label: TransactionExportStatusLabel[TransactionExportSessionStatus.PENDING],
  },
]

export default function Filter() {
  const { handleChangeSearch } = useExportTransactions()
  const search = useSearch({
    from: "/_authorize/logs/export-transactions/",
  })

  const handleSetDate = (dateRange: DateRangeDatePicker | undefined) => {
    const fromTo = formatDateRangeForSearching(dateRange)
    handleChangeSearch({
      ...search,
      ...fromTo,
      page: 1,
    })
  }

  const handleSetStatus = (status: string) => {
    handleChangeSearch({
      ...search,
      page: 1,
      status: Number(status),
    })
  }

  return (
    <div className="bg-background p-4 rounded-lg flex gap-4 mb-4">
      <div className="w-[240px]">
        <SelectDateRange
          from={search.from ? new Date(search.from) : undefined}
          to={search.to ? new Date(search.to) : undefined}
          onChange={handleSetDate}
          timezone={appTimezone.getTimezone()}
        />
      </div>
      <div className="w-[240px]">
        <Combobox
          placeholder="All status"
          value={search.status ? search.status.toString() : undefined}
          options={TransactionExportStatusOption}
          onChange={handleSetStatus}
        />
      </div>
    </div>
  )
}
