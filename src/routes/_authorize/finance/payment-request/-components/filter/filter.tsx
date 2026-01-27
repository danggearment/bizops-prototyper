import RefreshButton from "@/components/common/refresh-button/refresh-button"
import {
  StaffListStatementPaymentRequestSchema,
  StaffListStatementPaymentRequestType,
} from "@/schemas/schemas/payment"
import { useEnterSearchText } from "@/services/modals/modal-enter-search-text"
import {
  appTimezone,
  formatDateRangeForSearching,
} from "@/utils/format-date.ts"
import {
  Button,
  DateRangeDatePicker,
  Input,
  SelectDateRange,
} from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { useSearch } from "@tanstack/react-router"
import dayjs from "dayjs"
import { useCallback, useRef } from "react"
import SelectApproval from "./select-approval"
import SelectTeamFilter from "./select-team-filter"

interface Props {
  handleRefetchData: () => Promise<void>
  handleChangeSearch: (
    search: StaffListStatementPaymentRequestType,
    isReplace?: boolean,
  ) => void
}

export default function Filter({
  handleChangeSearch,
  handleRefetchData,
}: Props) {
  const search = useSearch({
    from: "/_authorize/finance/payment-request/",
  })

  const inputSearchRef = useRef<HTMLInputElement>(null)
  const actions = useEnterSearchText((state) => state.actions)

  const _debounceSubmit = useCallback(
    _debounce((newFilter: StaffListStatementPaymentRequestType) => {
      handleChangeSearch(newFilter)
    }, 600),
    [handleChangeSearch],
  )

  const handleClickInputSearch = () => {
    actions.setOpen({
      value: inputSearchRef.current?.value || "",
      onConfirm: (text) => {
        if (inputSearchRef.current) {
          inputSearchRef.current.value = text
        }

        const tokens = (text || "")
          .split(/[\s,]+/)
          .map((t) => t.trim())
          .filter(Boolean)

        _debounceSubmit({
          ...search,
          page: 1,
          searchTokens: tokens.length ? tokens : undefined,
        })
        actions.onClose()
      },
    })
  }

  const handleSetDate = (dateRange?: DateRangeDatePicker) => {
    const fromTo = formatDateRangeForSearching(dateRange)
    handleChangeSearch({
      ...search,
      ...fromTo,
      page: 1,
    })
  }

  const handleResetFilter = () => {
    const defaults = StaffListStatementPaymentRequestSchema.parse({})
    handleChangeSearch(
      {
        ...defaults,
      },
      true,
    )
  }

  return (
    <div className="bg-background rounded-lg p-4 space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="w-full col-span-2">
          <Input
            placeholder="Search by request ID or statement ID"
            className="rounded-tl-none rounded-bl-none bg-background-secondary"
            defaultValue={search.searchTokens?.join(", ")}
            ref={inputSearchRef}
            onClick={handleClickInputSearch}
          />
        </div>
        <div>
          <SelectTeamFilter
            handleSetNewSearch={handleChangeSearch}
            search={search}
          />
        </div>
        <div className="space-y-2">
          {/* <p className="text-sm font-semibold text-gray-500">Date Range</p> */}
          <SelectDateRange
            from={
              search.from ? dayjs(search.from).startOf("D").toDate() : undefined
            }
            to={search.to ? dayjs(search.to).endOf("D").toDate() : undefined}
            onChange={handleSetDate}
            timezone={appTimezone.getTimezone()}
          />
        </div>
        <div className="space-y-2">
          <SelectApproval
            handleSetNewSearch={handleChangeSearch}
            search={search}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleResetFilter}>
            Reset filters
          </Button>
          <RefreshButton handleRefetchData={handleRefetchData} />
        </div>
      </div>
    </div>
  )
}
