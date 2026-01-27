import { AllTransactionType, TransactionTypeLabel } from "@/constants/payment"
import {
  AllListTeamTransactionSearchKeys,
  StaffListTeamTransactionType,
} from "@/schemas/schemas/payment"
import { useEnterSearchText } from "@/services/modals/modal-enter-search-text"
import { formatDateRangeForSearching } from "@/utils"
import {
  Button,
  Combobox,
  DatePickerWithRange,
  DateRangeDatePicker,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { useSearch } from "@tanstack/react-router"
import { useCallback, useRef, useState } from "react"

const TransactionTypeOption = [
  {
    value: `${AllTransactionType.UNSPECIFIED}`,
    label: TransactionTypeLabel[AllTransactionType.UNSPECIFIED],
  },
  {
    value: `${AllTransactionType.TRANSFER}`,
    label: TransactionTypeLabel[AllTransactionType.TRANSFER],
  },
  {
    value: `${AllTransactionType.REFUND}`,
    label: TransactionTypeLabel[AllTransactionType.REFUND],
  },
  {
    value: `${AllTransactionType.PAYMENT}`,
    label: TransactionTypeLabel[AllTransactionType.PAYMENT],
  },
  {
    value: `${AllTransactionType.DEPOSIT}`,
    label: TransactionTypeLabel[AllTransactionType.DEPOSIT],
  },
  {
    value: `${AllTransactionType.ADJUST}`,
    label: TransactionTypeLabel[AllTransactionType.ADJUST],
  },
]

interface Props {
  handleChangeSearch: (search: StaffListTeamTransactionType) => void
}

const TeamTransactionByFilterOptions = [
  {
    text: "Transaction ID",
    value: AllListTeamTransactionSearchKeys.Values.txnId,
  },

  {
    text: "Email",
    value: AllListTeamTransactionSearchKeys.Values.email,
  },
]

export default function Filter({ handleChangeSearch }: Props) {
  const [searchKey, setSearchKey] = useState("")

  const inputSearchRef = useRef<HTMLInputElement>(null)
  const actions = useEnterSearchText((state) => state.actions)

  const _debounceSubmit = useCallback(
    _debounce((newFilter: StaffListTeamTransactionType) => {
      handleChangeSearch(newFilter)
    }, 600),
    [],
  )

  const search = useSearch({
    from: "/_authorize/system/teams/$teamId/transactions/",
  })

  const handleSetDate = (dateRange: DateRangeDatePicker | undefined) => {
    const fromTo = formatDateRangeForSearching(dateRange)
    const newFilter: StaffListTeamTransactionType = {
      ...search,
      ...fromTo,
      page: 1,
    }
    handleChangeSearch(newFilter)
  }

  const handleClickInputSearch = () => {
    actions.setOpen({
      value: inputSearchRef.current?.value || "",
      onConfirm: (text) => {
        if (inputSearchRef.current) {
          inputSearchRef.current.value = text
        }

        actions.onClose()
      },
    })
  }

  const handleMainSearch = () => {
    const value = inputSearchRef.current?.value
    _debounceSubmit({
      ...search,
      page: 1,
      searchText: value,
      searchKey: searchKey || search.searchKey,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-[200px]">
          <DatePickerWithRange
            from={search.from ? new Date(search.from) : undefined}
            to={search.to ? new Date(search.to) : undefined}
            setDate={handleSetDate}
          />
        </div>
        <div className="w-[200px]">
          <Combobox
            placeholder="All type"
            value={search.type ? `${search.type}` : undefined}
            options={TransactionTypeOption}
            onChange={(value) => {
              handleChangeSearch({
                ...search,
                type: Number(value),
              })
            }}
          />
        </div>
      </div>

      <div className="w-full flex-1 flex gap-4">
        <div className="flex w-full">
          <Select
            value={searchKey || search.searchKey}
            onValueChange={(value) => {
              setSearchKey(value)
              _debounceSubmit({
                ...search,
                page: 1,
                searchKey: value,
              })
            }}
          >
            <SelectTrigger className="w-[200px]  rounded-tr-none rounded-br-none border-r-transparent py-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TeamTransactionByFilterOptions.map((option) => (
                <SelectItem value={option.value} key={option.value}>
                  {option.text}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="w-full">
            <Input
              placeholder="Search"
              className="rounded-tl-none rounded-bl-none bg-background-secondary"
              defaultValue={search.searchText}
              ref={inputSearchRef}
              onClick={handleClickInputSearch}
            />
          </div>
        </div>

        <Button onClick={handleMainSearch}>Search</Button>
      </div>
    </div>
  )
}
