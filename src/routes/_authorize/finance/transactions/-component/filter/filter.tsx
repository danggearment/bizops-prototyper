import RefreshButton from "@/components/common/refresh-button/refresh-button"
import {
  AllTransactionSearchKeys,
  AllTransactionSearchSchema,
  AllTransactionSearchType,
} from "@/schemas/schemas/payment"
import { TeamTransactionType } from "@/services/connect-rpc/types"
import { useEnterSearchText } from "@/services/modals/modal-enter-search-text"
import { appTimezone, formatDateRangeForSearching } from "@/utils"
import {
  Button,
  ComboboxMultiField,
  DateRangeDatePicker,
  Form,
  FormField,
  Input,
  Select,
  SelectContent,
  SelectDateRange,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import dayjs from "dayjs"
import { useCallback, useMemo, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useAllTransaction } from "../../-all-transactions-context"
import SelectApproval from "../table-transaction/select-approval"

const TransactionByFilterOptions = [
  {
    text: "Transaction ID(s)",
    value: AllTransactionSearchKeys.Values.transactionId,
  },
  {
    text: "Email(s)",
    value: AllTransactionSearchKeys.Values.email,
  },
]

const MODAL_SEARCH_TYPES: readonly string[] = [
  AllTransactionSearchKeys.Values.transactionId,
  AllTransactionSearchKeys.Values.email,
]

// Type guard function to check if a key is in MODAL_SEARCH_TYPES
function isModalSearchType(key: string): boolean {
  return MODAL_SEARCH_TYPES.includes(key)
}

export default function Filter() {
  const { search, handleSetFilter, paymentMethods, handleRefetchData } =
    useAllTransaction()
  const inputSearchRef = useRef<HTMLInputElement>(null)
  const [searchKey, setSearchKey] = useState("")

  const form = useForm<AllTransactionSearchType>({
    resolver: zodResolver(AllTransactionSearchSchema),
    values: {
      searchKey: search.searchKey,
      searchText: search.searchText,
      methodCode: search.methodCode,
      approvalBy: search.approvalBy,
      from: search.from,
      to: search.to,
      type: search.type,
      page: search.page,
      limit: search.limit,
    },
  })

  const _debouceSubmit = useCallback(
    _debounce((newFilter: AllTransactionSearchType) => {
      handleSetFilter({
        ...newFilter,
        type: TeamTransactionType.ALL,
      })
    }, 600),
    [],
  )

  const actions = useEnterSearchText((state) => state.actions)

  const handleClickInputSearch = () => {
    const key = searchKey || search.searchKey

    if (key && isModalSearchType(key)) {
      actions.setOpen({
        value: inputSearchRef.current?.value || "",
        onConfirm: (text) => {
          if (inputSearchRef.current) {
            inputSearchRef.current.value = text
          }
          _debouceSubmit({
            ...search,
            page: 1,
            searchText: text,
            searchKey: key,
          })
          actions.onClose()
        },
      })
    }
  }

  const handleMainSearch = () => {
    const value = inputSearchRef.current?.value
    _debouceSubmit({
      ...search,
      page: 1,
      searchText: value,
      searchKey: searchKey || search.searchKey,
    })
  }

  const handleSetDate = (dateRange?: DateRangeDatePicker) => {
    const fromTo = formatDateRangeForSearching(dateRange)
    handleSetFilter({
      ...search,
      ...fromTo,
      page: 1,
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const key = searchKey || search.searchKey

    if (key && !isModalSearchType(key)) {
      _debouceSubmit({
        ...search,
        page: 1,
        searchText: value,
        searchKey: key,
      })
    }
  }

  const onSubmit = () => {
    handleMainSearch()
  }

  const paymentMethodOptions = useMemo(() => {
    return paymentMethods.map((method) => ({
      label: method.name,
      value: method.value,
    }))
  }, [paymentMethods])

  const ENABLE_FILTER_METHODCODE = [
    TeamTransactionType.DEPOSIT,
    TeamTransactionType.PAYMENT,
    TeamTransactionType.ALL,
    TeamTransactionType.SETTLEMENT,
  ]
  const ENABLE_FILTER_APPROVAL = [
    TeamTransactionType.DEPOSIT,
    TeamTransactionType.ALL,
  ]
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-background rounded-lg p-4 space-y-4"
      >
        <div className="flex-grow bg-background rounded-lg flex gap-4">
          <div className="flex w-full">
            <Select
              value={searchKey || search.searchKey}
              onValueChange={(value) => {
                setSearchKey(value)
                _debouceSubmit({
                  ...search,
                  page: 1,
                  searchKey: value,
                })
              }}
            >
              <SelectTrigger className="w-[160px] rounded-tr-none rounded-br-none border-r-transparent py-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TransactionByFilterOptions.map((option) => (
                  <SelectItem value={option.value} key={option.value}>
                    {option.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="w-full">
              <Input
                placeholder="Search"
                className="w-full rounded-tl-none rounded-bl-none bg-background-secondary"
                defaultValue={search.searchText}
                ref={inputSearchRef}
                onClick={handleClickInputSearch}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="w-[200px]">
            <SelectDateRange
              className="w-full justify-between"
              from={
                search.from
                  ? dayjs(search.from).startOf("D").toDate()
                  : undefined
              }
              to={search.to ? dayjs(search.to).endOf("D").toDate() : undefined}
              onChange={handleSetDate}
              timezone={appTimezone.getTimezone()}
            />
          </div>

          {ENABLE_FILTER_APPROVAL.includes(search.type) && <SelectApproval />}

          {ENABLE_FILTER_METHODCODE.includes(search.type) && (
            <div className="w-[200px]">
              <FormField
                control={form.control}
                name="methodCode"
                render={({ field }) => (
                  <ComboboxMultiField
                    options={paymentMethodOptions}
                    value={field.value || []}
                    placeholder="Payment method"
                    onChange={(value) => {
                      field.onChange(value)
                      _debouceSubmit({
                        ...search,
                        page: 1,
                        methodCode: value,
                      })
                    }}
                  />
                )}
              />
            </div>
          )}

          <div className="flex gap-2 items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                _debouceSubmit({
                  ...search,
                  page: 1,
                  searchText: undefined,
                  methodCode: undefined,
                  approvalBy: undefined,
                })
                if (inputSearchRef.current) {
                  inputSearchRef.current.value = ""
                }
              }}
            >
              Reset filter
            </Button>
            <RefreshButton handleRefetchData={handleRefetchData} />
          </div>
        </div>
      </form>
    </Form>
  )
}
