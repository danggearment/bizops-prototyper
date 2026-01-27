import CellTeam from "@/components/common/cell-team/cell-team.tsx"
import Image from "@/components/common/image/image"
import { BillingColorsMapping, mappingColor } from "@/constants/map-color.ts"
import {
  AllDepositRequestSearchKeys,
  StaffListDepositRequestType,
} from "@/schemas/schemas/payment.ts"
import { useQueryFinance } from "@/services/connect-rpc/transport.tsx"
import {
  DepositRequest_Short,
  DepositRequestStatus,
  DepositRequestType,
} from "@/services/connect-rpc/types"
import { useEnterSearchText } from "@/services/modals/modal-enter-search-text/modal-enter-search-text-store.tsx"
import { formatPrice } from "@/utils/format-currency"
import {
  appTimezone,
  formatDateForCallApi,
  formatDateRangeForSearching,
} from "@/utils/format-date.ts"
import { staffListPaymentMethod } from "@gearment/nextapi/api/payment/v1/payment_admin-PaymentAdminAPI_connectquery.ts"
import { staffListDepositRequest } from "@gearment/nextapi/api/wallet/v1/wallet_admin-WalletAdminAPI_connectquery.ts"
import {
  StaffListDepositRequestRequest_SortCriterion,
  StaffListDepositRequestRequest_SortCriterion_SortBy,
  StaffListDepositRequestRequest_SortCriterion_SortDirection,
} from "@gearment/nextapi/api/wallet/v1/wallet_admin_pb"
import {
  Badge,
  Button,
  CellHeader,
  cn,
  ComboboxMulti,
  DataTable,
  DateRangeDatePicker,
  Input,
  Select,
  SelectContent,
  SelectDateRange,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TablePagination,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useTable,
} from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import dayjs from "dayjs"
import { useCallback, useMemo, useRef, useState } from "react"
import { DepositRequestStatusOptions } from "../constants/index.ts"
import CellAction from "./cell-action.tsx"
import CellDeposit from "./cell-deposit.tsx"
import CellImage from "./cell-image.tsx"

import { DateTime } from "@/components/common/date-time.tsx"
import { NotepadTextIcon, RefreshCwIcon } from "lucide-react"

const columnHelper = createColumnHelper<DepositRequest_Short>()

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

const columns: ColumnDef<DepositRequest_Short, any>[] = [
  columnHelper.accessor("txnId", {
    header: () => <span className="whitespace-nowrap">Transaction ID</span>,
    cell: ({ row }) => (
      <CellDeposit
        txnId={row.original.txnId}
        createdAt={row.original.createdAt}
        refId={row.original.refId}
      />
    ),
  }),
  columnHelper.accessor("teamId", {
    header: () => <span className="whitespace-nowrap">Team information</span>,
    cell: (props) => {
      return (
        <CellTeam
          teamId={props.row.original.teamId}
          teamName={props.row.original.teamName}
        />
      )
    },
  }),

  columnHelper.accessor("amount", {
    header: () => <span className="whitespace-nowrap text-right">Amount</span>,
    cell: ({ getValue }) => {
      return <span className="block">{formatPrice(getValue())}</span>
    },
  }),
  columnHelper.accessor("status", {
    header: () => <span className="block w-full text-center">Status</span>,
    cell: ({ getValue, row }) => (
      <div className="flex items-center justify-start gap-1">
        <Badge
          variant={mappingColor<DepositRequestStatus>(
            BillingColorsMapping,
            getValue<DepositRequestStatus>(),
          )}
        >
          <span className="lowercase first-letter:uppercase">
            {DepositRequestStatus[getValue()]}
          </span>
        </Badge>
        {getValue<DepositRequestStatus>() === DepositRequestStatus.REJECTED && (
          <Tooltip>
            <TooltipTrigger asChild>
              <NotepadTextIcon className="w-4 h-4 text-gray-500" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              {row.original.notes}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    ),
  }),
  columnHelper.accessor("methodIconUrls", {
    header: () => <span className="whitespace-nowrap">Payment method</span>,
    cell: ({ getValue }) => {
      const iconUrl = getValue()
      if (!iconUrl) return null
      return <Image url={iconUrl} height={24} width={100} responsive="w" />
    },
  }),
  columnHelper.accessor("type", {
    header: () => <span className="whitespace-nowrap">Top-Up Type</span>,
    cell: ({ getValue }) => {
      const value = DepositRequestType[getValue()]
      return <p className="text-center">{capitalizeFirstLetter(value)}</p>
    },
  }),
  columnHelper.accessor("fileUrls", {
    header: "Payment receipt",
    cell: (props) => <CellImage {...props} />,
  }),
  columnHelper.accessor("email", {
    header: () => <span className="whitespace-nowrap">Created by</span>,
    cell: ({ getValue }) => {
      const value = getValue()
      return <p>{value}</p>
    },
  }),
  columnHelper.accessor("createdAt", {
    header: (header) => (
      <CellHeader {...header} sort>
        Requested at
      </CellHeader>
    ),
    cell: ({ row }) => <DateTime date={row.original.createdAt?.toDate()} />,
  }),
  columnHelper.accessor("approval", {
    header: () => (
      <span className="whitespace-nowrap">Approver / Rejector</span>
    ),
    cell: ({ row }) => <p>{row.original.approval}</p>,
  }),
  columnHelper.accessor("resolvedAt", {
    header: (header) => (
      <CellHeader {...header} sort>
        Approved / Rejected Date
      </CellHeader>
    ),
    cell: ({ row }) => (
      <DateTime
        date={row.original.resolvedAt?.toDate()}
        className="text-sm font-normal"
      />
    ),
  }),
  columnHelper.display({
    id: "action",
    header: () => <span className="block text-right">Actions</span>,
    cell: (props) => <CellAction {...props} />,
  }),
]

const sortByMapping: Record<
  string,
  StaffListDepositRequestRequest_SortCriterion_SortBy
> = {
  resolvedAt: StaffListDepositRequestRequest_SortCriterion_SortBy.RESOLVED_AT,
  createdAt: StaffListDepositRequestRequest_SortCriterion_SortBy.CREATED_AT,
}

const sortDirectionMapping: Record<
  string,
  StaffListDepositRequestRequest_SortCriterion_SortDirection
> = {
  asc: StaffListDepositRequestRequest_SortCriterion_SortDirection.ASC,
  desc: StaffListDepositRequestRequest_SortCriterion_SortDirection.DESC,
}

const DepositByFilterOptions = [
  {
    text: "Transaction ID(s)",
    value: AllDepositRequestSearchKeys.Values.transactionId,
  },
  {
    text: "Team ID(s)",
    value: AllDepositRequestSearchKeys.Values.teamId,
  },
  {
    text: "Email(s)",
    value: AllDepositRequestSearchKeys.Values.emailAddress,
  },
  {
    text: "Reference ID(s)",
    value: AllDepositRequestSearchKeys.Values.referenceId,
  },
]

export default function TableBillings() {
  const search = useSearch({
    from: "/_authorize/finance/deposit/",
  })
  const navigate = useNavigate({
    from: "/finance/deposit",
  })

  const [searchKey, setSearchKey] = useState("")
  const inputSearchRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<string[] | undefined>(
    search.status?.map((status) => status.toString()),
  )
  const [paymentMethod, setPaymentMethod] = useState<string[] | undefined>(
    search.methodCode,
  )

  const _debounceSubmit = useCallback(
    _debounce((newFilter: StaffListDepositRequestType) => {
      handleChangeSearch(newFilter)
    }, 600),
    [],
  )

  const {
    data: listPaymentMethod,
    isRefetching,
    refetch,
  } = useQueryFinance(
    staffListPaymentMethod,
    {},
    {
      select: (response) => response.data || [],
    },
  )
  const listPaymentMethodOptions = useMemo(() => {
    if (!listPaymentMethod) {
      return []
    }
    return listPaymentMethod
      .filter(({ methodCode }) => methodCode !== "g_wallet")
      .map((method) => ({
        label: method.name,
        value: method.methodCode,
      }))
  }, [listPaymentMethod])

  const { data, isPending } = useQueryFinance(
    staffListDepositRequest,
    {
      page: search.page,
      limit: search.limit,
      filter: {
        from: search.from ? formatDateForCallApi(search.from) : undefined,
        to: search.to ? formatDateForCallApi(search.to, "endOfDay") : undefined,
        status: search.status,
        methodCode: search.methodCode,
      },
      search: {
        search: search.searchText
          ? {
              case:
                search.searchKey ||
                AllDepositRequestSearchKeys.Values.transactionId,
              value: search.searchText,
            }
          : undefined,
      },
      sortCriterion: (search.sortBy || []).reduce<
        StaffListDepositRequestRequest_SortCriterion[]
      >((acc, key, idx) => {
        const mapped = sortByMapping[key]
        if (!mapped) return acc
        acc.push(
          new StaffListDepositRequestRequest_SortCriterion({
            sortBy: mapped,
            sortDirection:
              sortDirectionMapping[search.sortDirection?.[idx] ?? "desc"],
          }),
        )
        return acc
      }, []),
    },
    {
      refetchOnWindowFocus: true,
      select: (data) => ({
        data: data.data,
        rowCount: Number(data?.total),
        pageCount: data?.totalPage,
      }),
    },
  )

  const handleSetDate = (dateRange: DateRangeDatePicker | undefined) => {
    const fromTo = formatDateRangeForSearching(dateRange)
    const newFilter = {
      ...search,
      ...fromTo,
      page: 1,
    }
    handleChangeSearch(newFilter)
  }

  const handleChangeSearch = (search: StaffListDepositRequestType) => {
    navigate({
      search: (old) => ({
        ...old,
        ...search,
      }),
      replace: true,
    })
  }

  const actions = useEnterSearchText((state) => state.actions)

  const handleClickInputSearch = () => {
    actions.setOpen({
      value: inputSearchRef.current?.value || "",
      onConfirm: (text) => {
        if (inputSearchRef.current) {
          inputSearchRef.current.value = text
        }

        _debounceSubmit({
          ...search,
          page: 1,
          searchText: text,
          searchKey: searchKey || search.searchKey,
        })
        actions.onClose()
      },
    })
  }

  const sorting = (search.sortBy || []).map((s, i) => ({
    id: s,
    desc: search.sortDirection ? search.sortDirection[i] === "desc" : false,
  }))

  const table = useTable<DepositRequest_Short>({
    columns,
    data: data?.data || [],
    rowCount: data?.rowCount || 0,
    pageCount: data?.pageCount || 0,
    manualSorting: true,
    state: {
      columnPinning: {
        right: ["action"],
      },
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.limit,
      },
      sorting,
    },
    onSortingChange: (updater) => {
      const newValue = updater instanceof Function ? updater(sorting) : updater

      const order = newValue.map((s) => s.id)
      const desc = newValue.map((s) => (s.desc ? "desc" : "asc"))

      navigate({
        search: (old) => ({
          ...old,
          sortBy: order,
          sortDirection: desc,
        }),
        replace: true,
      })
    },
    onPaginationChange: (updater) => {
      const newValue =
        updater instanceof Function
          ? updater({
              pageIndex: search.page - 1,
              pageSize: search.limit,
            })
          : updater

      navigate({
        search: (old) => ({
          ...old,
          page: newValue.pageIndex + 1,
          limit: newValue.pageSize,
        }),
        replace: true,
      })
    },
  })

  const handleResetFilter = () => {
    handleChangeSearch({
      ...search,
      page: 1,
      searchText: "",
    })
    setSearchKey("")
    if (inputSearchRef.current) {
      inputSearchRef.current.value = ""
    }
    setStatus(undefined)
    setPaymentMethod(undefined)
  }

  return (
    <div className="space-y-4">
      <div className="bg-background rounded-lg p-4 space-y-4">
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
                {DepositByFilterOptions.map((option) => (
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
        </div>

        <div className={"flex flex-col md:flex-row gap-4"}>
          <div className="w-[200px]">
            <SelectDateRange
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
          <ComboboxMulti
            className=" max-w-[200px] w-[200px]"
            placeholder="Status"
            value={status}
            options={DepositRequestStatusOptions.map((option) => ({
              ...option,
              value: String(option.value),
            }))}
            allowClear
            modal
            onChange={(values) => {
              const numericValues = values
                ? values.map((v) => Number(v))
                : undefined
              setStatus(values)
              _debounceSubmit({
                ...search,
                page: 1,
                status: numericValues,
              })
            }}
          />
          <ComboboxMulti
            className="max-w-[200px] w-[200px]"
            placeholder="Payment method"
            value={paymentMethod}
            options={listPaymentMethodOptions}
            allowClear
            modal
            onChange={(values) => {
              setPaymentMethod(values)
              _debounceSubmit({
                ...search,
                page: 1,
                methodCode: values,
              })
            }}
          />
          <Button variant="outline" onClick={handleResetFilter}>
            Reset filter
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={async () => {
                  refetch()
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
      <div>
        <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
        <div className="bg-background rounded-lg p-4">
          <DataTable table={table} loading={isPending} sticky />
        </div>
        <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
      </div>
    </div>
  )
}
