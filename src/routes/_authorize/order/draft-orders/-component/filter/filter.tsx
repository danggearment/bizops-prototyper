import { DateRangeDatePicker, SelectDateRange } from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import { RefreshCwIcon } from "lucide-react"
import { useCallback, useRef, useState } from "react"

import DrawerAdvanceFilter from "@/routes/_authorize/order/-component/filter/drawer-advance-filter"
import { AllOrderSearchType } from "@/schemas/schemas/all-orders.ts"
import {
  OrderDraftSearchKeys,
  OrderDraftSearchSchema,
  OrderDraftSearchType,
} from "@/schemas/schemas/order-draft"
import { Order_OrderStatus } from "@/services/connect-rpc/types"
import { useEnterSearchText } from "@/services/modals/modal-enter-search-text"
import {
  appTimezone,
  formatDateRangeForSearching,
} from "@/utils/format-date.ts"
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from "@gearment/ui3"
import dayjs from "dayjs"
import { useOrderDraft } from "../../-all-orders-context"

const OrderByFilterOptions = [
  {
    text: "Order ID(s)",
    value: OrderDraftSearchKeys.Values.draftId,
  },
  {
    text: "Reference ID(s)",
    value: OrderDraftSearchKeys.Values.referenceId,
  },
  {
    text: "Team ID(s)",
    value: OrderDraftSearchKeys.Values.teamId,
  },
  {
    text: "Email",
    value: OrderDraftSearchKeys.Values.createdByEmails,
  },
]

interface SearchInputProps {
  placeholder: string
  value?: string
  onChange: (value: string) => void
  onClear: () => void
  inputRef: React.RefObject<HTMLInputElement | null>
}

const SearchInput = ({
  placeholder,
  value,
  onChange,
  inputRef,
}: SearchInputProps) => (
  <Input
    placeholder={placeholder}
    defaultValue={value}
    ref={inputRef}
    onChange={(e) => onChange(e.target.value)}
  />
)

export default function Filter() {
  const {
    search,
    handleSetFilter,
    handleRefetchData,
    shippingMethodsOption,
    products,
    colors,
    carriers,
    productTypes,
    sizes,
    printPositions,
    priorityTypes,
  } = useOrderDraft()
  const [searchKey, setSearchKey] = useState("")
  const [isRefetching, setRefetching] = useState(false)

  const storeSearchRef = useRef<HTMLInputElement>(null)
  const variantSearchRef = useRef<HTMLInputElement>(null)
  const inputSearchRef = useRef<HTMLInputElement>(null)

  const _debouceSubmit = useCallback(
    _debounce((newFilter: OrderDraftSearchType) => {
      handleSetFilter(newFilter)
    }, 600),
    [],
  )

  const handleSetDate = (dateRange?: DateRangeDatePicker) => {
    const fromTo = formatDateRangeForSearching(dateRange)
    handleSetFilter({
      ...search,
      ...fromTo,
      page: 1,
    })
  }

  const handleSearchChange =
    (field: keyof AllOrderSearchType) => (value: string) => {
      _debouceSubmit({
        ...search,
        [field]: value,
      })
    }

  const handleClearSearch =
    (
      field: keyof AllOrderSearchType,
      ref: React.RefObject<HTMLInputElement | null>,
    ) =>
    () => {
      if (ref.current) {
        ref.current.value = ""
      }
      handleSetFilter({
        ...search,
        [field]: "",
      })
    }

  const handleMainSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const value = inputSearchRef.current?.value?.trim()
    _debouceSubmit({
      ...search,
      page: 1,
      status: Order_OrderStatus.ALL,
      searchText: value,
      searchKey: searchKey || search.searchKey,
    })
  }
  const actions = useEnterSearchText((state) => state.actions)

  const handleClickInputSearch = () => {
    const key = searchKey || search.searchKey
    switch (key) {
      case OrderDraftSearchKeys.Values.draftId:
      case OrderDraftSearchKeys.Values.orderId:
      case OrderDraftSearchKeys.Values.originOrderId:
      case OrderDraftSearchKeys.Values.teamId:
      case OrderDraftSearchKeys.Values.referenceId: {
        actions.setOpen({
          value: inputSearchRef.current?.value || "",
          onConfirm: (text) => {
            if (inputSearchRef.current) {
              inputSearchRef.current.value = text
            }

            _debouceSubmit({
              ...search,
              page: 1,
              status: Order_OrderStatus.ALL,
              searchText: text,
              searchKey: searchKey || search.searchKey,
            })
            actions.onClose()
          },
        })
      }
    }
  }

  const handleResetFilter = () => {
    handleSetFilter({
      ...OrderDraftSearchSchema.parse({}),
    })
    setSearchKey("")
    if (inputSearchRef.current) {
      inputSearchRef.current.value = ""
    }
    if (storeSearchRef.current) {
      storeSearchRef.current.value = ""
    }
    if (variantSearchRef.current) {
      variantSearchRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4 mb-4 bg-background rounded-lg p-4">
      <form onSubmit={handleMainSearch} className="w-full flex-1 flex gap-4">
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
            <SelectTrigger className="w-[200px]  rounded-tr-none rounded-br-none border-r-transparent py-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OrderByFilterOptions.map((option) => (
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

        <Button type="submit">Search</Button>
      </form>

      <div className="flex gap-4">
        <div className="w-[200px]">
          <SelectDateRange
            defaultSelectedText="Created date"
            className="w-full justify-between"
            from={
              search.from ? dayjs(search.from).startOf("D").toDate() : undefined
            }
            to={search.to ? dayjs(search.to).endOf("D").toDate() : undefined}
            onChange={handleSetDate}
            timezone={appTimezone.getTimezone()}
          />
        </div>

        <div className="w-[200px]">
          <SearchInput
            placeholder="Search by store"
            value={search.storeId}
            onChange={handleSearchChange("storeId")}
            onClear={handleClearSearch("storeId", storeSearchRef)}
            inputRef={storeSearchRef}
          />
        </div>

        <div className="w-[200px]">
          <SearchInput
            placeholder="Search by variant"
            value={search.variant}
            onChange={handleSearchChange("variant")}
            onClear={handleClearSearch("variant", variantSearchRef)}
            inputRef={variantSearchRef}
          />
        </div>
        <Button variant="outline" onClick={handleResetFilter}>
          Reset filter
        </Button>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={async () => {
                const showToast = true
                setRefetching(true)
                await handleRefetchData(showToast)
                setRefetching(false)
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
        <DrawerAdvanceFilter
          handleSetFilter={handleSetFilter}
          search={search}
          shippingMethodsOption={shippingMethodsOption}
          products={products}
          colors={colors}
          carriers={carriers}
          productTypes={productTypes}
          sizes={sizes}
          printPositions={printPositions}
          priorityTypes={priorityTypes}
          refundStatus={[]}
        />
      </div>
    </div>
  )
}
