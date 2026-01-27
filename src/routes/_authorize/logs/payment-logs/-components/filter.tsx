import { usePaymentLogsCriteria } from "@/data-center/payment-logs/use-query"
import {
  PaymentLogsSearchKeys,
  PaymentLogsSearchSchema,
} from "@/schemas/schemas/payment-logs"
import { useEnterSearchText } from "@/services/modals/modal-enter-search-text"
import { queryClient } from "@/services/react-query"
import { appTimezone, formatDateRangeForSearching } from "@/utils"
import { staffListCheckoutRequest } from "@gearment/nextapi/api/payment/v1/api_staff_checkout_request-StaffCheckoutRequestService_connectquery"
import {
  StaffCheckoutRequest_Status,
  StaffCheckoutRequest_Type,
} from "@gearment/nextapi/api/payment/v1/data_staff_checkout_request_pb"
import {
  Button,
  ComboboxMulti,
  DateRangeDatePicker,
  Input,
  Select,
  SelectContent,
  SelectDateRange,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import dayjs from "dayjs"
import { RefreshCcwIcon } from "lucide-react"
import { useMemo, useRef } from "react"
import SelectTeam from "./select-team"

const SearchKeyFilterOptions = [
  {
    text: "Order ID(s)",
    value: PaymentLogsSearchKeys.Values.anyOrderIds.toString(),
  },
]

const statusOptions = [
  {
    label: "All",
    value: StaffCheckoutRequest_Status.ALL.toString(),
  },
  {
    label: "Pending",
    value: StaffCheckoutRequest_Status.PENDING.toString(),
  },
  {
    label: "Success",
    value: StaffCheckoutRequest_Status.SUCCESS.toString(),
  },
  {
    label: "Success partially",
    value: StaffCheckoutRequest_Status.SUCCESS_PARTIALLY.toString(),
  },
  {
    label: "Failed",
    value: StaffCheckoutRequest_Status.FAILED.toString(),
  },
  {
    label: "Expired",
    value: StaffCheckoutRequest_Status.EXPIRED.toString(),
  },
  {
    label: "Processing",
    value: StaffCheckoutRequest_Status.PROCESSING.toString(),
  },
]

const typeOptions = [
  {
    label: "All",
    value: StaffCheckoutRequest_Type.ALL.toString(),
  },
  {
    label: "Manual",
    value: StaffCheckoutRequest_Type.MANUAL.toString(),
  },
  {
    label: "Auto",
    value: StaffCheckoutRequest_Type.AUTO.toString(),
  },
]

export default function Filter() {
  const navigate = useNavigate({
    from: "/logs/payment-logs",
  })
  const search = useSearch({
    from: "/_authorize/logs/payment-logs/",
  })
  const criteria = usePaymentLogsCriteria()
  const inputSearchRef = useRef<HTMLInputElement>(null)
  const actions = useEnterSearchText((state) => state.actions)

  const paymentMethodOptions = useMemo(() => {
    return (
      criteria?.paymentMethods.map((c) => ({
        label: c.name,
        value: c.code,
      })) || []
    )
  }, [criteria])

  const handleChangeDateRange = (
    dateRange: DateRangeDatePicker | undefined,
  ) => {
    const formTo = formatDateRangeForSearching(dateRange)
    navigate({
      search: (old) => ({
        ...old,
        createdFrom: formTo.from,
        createdTo: formTo.to,
      }),
    })
  }

  const handleClickInputSearch = () => {
    actions.setOpen({
      value: inputSearchRef.current?.value || "",
      onConfirm: (text) => {
        if (inputSearchRef.current) {
          inputSearchRef.current.value = text
        }
        handleSearch()
        actions.onClose()
      },
    })
  }

  const handleSearch = () => {
    const searchText = inputSearchRef.current?.value
    navigate({
      search: (old) => ({
        ...old,
        page: 1,
        search: searchText,
      }),
      replace: true,
    })
  }

  return (
    <div className="space-y-4 bg-background rounded-lg p-4">
      <div className="flex items-center">
        <Select
          value={search.searchKey}
          onValueChange={(value) => {
            navigate({
              search: (old) => ({
                ...old,
                page: 1,
                searchKey: value as keyof typeof PaymentLogsSearchKeys.Values,
              }),
            })
          }}
        >
          <SelectTrigger className="w-[120px]  rounded-tr-none rounded-br-none border-r-transparent py-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SearchKeyFilterOptions.map((option) => (
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
            defaultValue={search.search}
            ref={inputSearchRef}
            onClick={handleClickInputSearch}
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-[240px]">
          <SelectDateRange
            from={
              search.createdFrom
                ? dayjs(search.createdFrom).startOf("D").toDate()
                : undefined
            }
            to={
              search.createdTo
                ? dayjs(search.createdTo).endOf("D").toDate()
                : undefined
            }
            onChange={handleChangeDateRange}
            timezone={appTimezone.getTimezone()}
          />
        </div>
        <div className="w-[120px]">
          <ComboboxMulti
            placeholder="Status"
            options={statusOptions}
            value={search.statuses.map((status) => status.toString())}
            onChange={(value) => {
              navigate({
                search: (old) => ({
                  ...old,
                  page: 1,
                  statuses: value.map(Number),
                }),
                replace: true,
              })
            }}
          />
        </div>
        <div className="w-[120px]">
          <ComboboxMulti
            placeholder="Type"
            options={typeOptions}
            value={search.types.map((type) => type.toString())}
            onChange={(value) => {
              navigate({
                search: (old) => ({
                  ...old,
                  page: 1,
                  types: value.map(Number),
                }),
              })
            }}
          />
        </div>
        <div className="w-[200px]">
          <ComboboxMulti
            placeholder="Payment method"
            options={paymentMethodOptions}
            value={search.paymentMethodCodes.map((type) => type.toString())}
            onChange={(value) => {
              navigate({
                search: (old) => ({
                  ...old,
                  page: 1,
                  paymentMethodCodes: value,
                }),
                replace: true,
              })
            }}
          />
        </div>
        <div className="w-[200px] ">
          <SelectTeam />
        </div>
        <Button
          variant={"outline"}
          onClick={() => {
            navigate({
              search: () => ({
                ...PaymentLogsSearchSchema.parse({}),
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
          onClick={() => {
            queryClient.invalidateQueries({
              queryKey: [
                staffListCheckoutRequest.service.typeName,
                staffListCheckoutRequest.name,
              ],
            })
            toast({
              title: "Refresh data",
              description: "Refresh data successfully",
            })
          }}
        >
          <RefreshCcwIcon />
        </Button>
      </div>
    </div>
  )
}
