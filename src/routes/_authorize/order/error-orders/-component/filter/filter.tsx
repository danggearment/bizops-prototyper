import {
  AllOrderSearchKeys,
  AllOrderSearchSchema,
  AllOrderSearchType,
} from "@/schemas/schemas/all-orders.ts"
import { Order_OrderStatus } from "@/services/connect-rpc/types"
import { useEnterSearchText } from "@/services/modals/modal-enter-search-text"
import {
  appTimezone,
  formatDateRangeForSearching,
} from "@/utils/format-date.ts"
import {
  Button,
  cn,
  DateRangeDatePicker,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Input,
  Select,
  SelectContent,
  SelectDateRange,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { _debounce } from "@gearment/utils"
import dayjs from "dayjs"
import { FilterIcon, RefreshCwIcon, XIcon } from "lucide-react"
import { useCallback, useMemo, useRef, useState } from "react"
import { useAllOrder } from "../../-all-orders-context"
import FormAdvanceFilter from "../../../-component/filter/form-advance-filter"
import SelectStoreFilter from "../../../-component/filter/select-store-filter"

const OrderByFilterOptions = [
  {
    text: "Order ID(s)",
    value: AllOrderSearchKeys.Values.orderId,
  },
  {
    text: "Fulfillment Order ID(s)",
    value: AllOrderSearchKeys.Values.fulfillmentOrderId,
  },
  {
    text: "Reference ID(s)",
    value: AllOrderSearchKeys.Values.referenceId,
  },
  {
    text: "Team ID(s)",
    value: AllOrderSearchKeys.Values.teamId,
  },
  {
    text: "Email",
    value: AllOrderSearchKeys.Values.createdByEmails,
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
    className="bg-background-secondary  h-full truncate"
    defaultValue={value}
    ref={inputRef}
    onChange={(e) => onChange(e.target.value)}
  />
)

const countAdvanceFilterKey: string[] = [
  AllOrderSearchSchema.keyof().Values.platforms,
  AllOrderSearchSchema.keyof().Values.createdMethods,
  AllOrderSearchSchema.keyof().Values.carrier,
  AllOrderSearchSchema.keyof().Values.productType,
  AllOrderSearchSchema.keyof().Values.priority,
  AllOrderSearchSchema.keyof().Values.refundStatus,
  AllOrderSearchSchema.keyof().Values.productIds,
  AllOrderSearchSchema.keyof().Values.colorCodes,
  AllOrderSearchSchema.keyof().Values.sizeCodes,
  AllOrderSearchSchema.keyof().Values.shippingMethods,
  AllOrderSearchSchema.keyof().Values.orderLocation,
]

export default function Filter() {
  const { search, handleSetFilter, handleRefetchData } = useAllOrder()
  const [searchKey, setSearchKey] = useState("")
  const [isRefetching, setRefetching] = useState(false)

  const [openAdvanceFilter, setOpenFilter] = useState(false)
  const {
    shippingMethodsOption,
    products,
    colors,
    carriers,
    productTypes,
    sizes,
    printPositions,
    priorityTypes,
    refundStatus,
  } = useAllOrder()

  const storeSearchRef = useRef<HTMLInputElement>(null)
  const variantSearchRef = useRef<HTMLInputElement>(null)
  const inputSearchRef = useRef<HTMLInputElement>(null)

  const _debouceSubmit = useCallback(
    _debounce((newFilter: AllOrderSearchType) => {
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
      status: Order_OrderStatus.AWAITING_FULFILLMENT,
      searchText: value,
      searchKey: searchKey || search.searchKey,
    })
  }
  const actions = useEnterSearchText((state) => state.actions)

  const handleClickInputSearch = () => {
    const key = searchKey || search.searchKey
    switch (key) {
      case AllOrderSearchKeys.Values.customerName:
      case AllOrderSearchKeys.Values.createdByEmails:
      case AllOrderSearchKeys.Values.trackingNumber: {
        break
      }

      case AllOrderSearchKeys.Values.orderId:
      case AllOrderSearchKeys.Values.fulfillmentOrderId:
      case AllOrderSearchKeys.Values.teamId:
      case AllOrderSearchKeys.Values.referenceId: {
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
      ...AllOrderSearchSchema.parse({}),
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

  const countAdvanceFilter = useMemo(() => {
    const count = Object.keys(search).filter(
      (key) =>
        countAdvanceFilterKey.includes(key) &&
        search[key as keyof AllOrderSearchType] &&
        (Array.isArray(search[key as keyof AllOrderSearchType])
          ? (search[key as keyof AllOrderSearchType] as string[]).length > 0
          : true),
    ).length

    let countOptions = 0

    Object.keys(search).forEach((key) => {
      if (key === AllOrderSearchSchema.keyof().Values.options) {
        countOptions = (search[key as keyof AllOrderSearchType] as string[])
          .length
      }
    })

    return count + countOptions
  }, [search])

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
            <SelectTrigger className="w-[200px] text-foreground rounded-tr-none rounded-br-none border-r-transparent px-5 py-0">
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

        <div className="min-w-[220px]">
          <SelectStoreFilter />
        </div>

        <div>
          <SearchInput
            placeholder="Search by Variant"
            value={search.variantId}
            onChange={handleSearchChange("variantId")}
            onClear={handleClearSearch("variantId", variantSearchRef)}
            inputRef={variantSearchRef}
          />
        </div>
        <Button variant="outline" onClick={handleResetFilter}>
          Reset filter
        </Button>
        <Tooltip>
          <TooltipTrigger>
            <Button
              onClick={async () => {
                const showToast = true
                setRefetching(true)
                await handleRefetchData(showToast)
                setRefetching(false)
              }}
              className="bg-white"
              variant="outline"
            >
              <RefreshCwIcon
                className={cn("", {
                  "animate-spin": isRefetching,
                })}
              />
            </Button>
          </TooltipTrigger>

          <TooltipContent color="dark" side="top">
            Refresh data table
          </TooltipContent>
        </Tooltip>

        <Drawer
          open={openAdvanceFilter}
          onOpenChange={setOpenFilter}
          direction="right"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <DrawerTrigger asChild>
                <Button variant="outline" className="relative">
                  <FilterIcon />
                  {countAdvanceFilter > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {countAdvanceFilter}
                    </span>
                  )}
                </Button>
              </DrawerTrigger>
            </TooltipTrigger>

            <TooltipContent side="top">Advanced filter</TooltipContent>
          </Tooltip>

          <DrawerContent className="bg-white flex flex-col w-[400px] h-full rounded-none fixed top-0 right-0 left-auto mt-0">
            <DrawerHeader className="flex flex-row justify-between items-center pt-6">
              <DrawerTitle className="heading-3">Advanced filter</DrawerTitle>
              <DrawerClose>
                <Button variant="ghost" size="icon">
                  <XIcon />
                </Button>
              </DrawerClose>
            </DrawerHeader>

            <div className="overflow-y-auto overflow-x-hidden px-4">
              <FormAdvanceFilter
                onCloseFilter={() => setOpenFilter(false)}
                search={search}
                handleSetFilter={handleSetFilter}
                shippingMethodsOption={shippingMethodsOption}
                products={products}
                colors={colors}
                carriers={carriers}
                productTypes={productTypes}
                sizes={sizes}
                printPositions={printPositions}
                priorityTypes={priorityTypes}
                refundStatus={refundStatus}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  )
}
