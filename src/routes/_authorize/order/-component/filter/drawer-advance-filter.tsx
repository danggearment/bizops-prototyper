import {
  AllOrderSearchSchema,
  AllOrderSearchType,
} from "@/schemas/schemas/all-orders"
import { OrderDraftSearchType } from "@/schemas/schemas/order-draft"
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { FilterIcon, XIcon } from "lucide-react"
import { useMemo, useState } from "react"
import FormAdvanceFilter from "./form-advance-filter"

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
type SearchType = AllOrderSearchType | OrderDraftSearchType | any
interface DrawerAdvanceFilterProps {
  handleSetFilter: (filter: SearchType, resetRowState?: boolean) => void
  search: SearchType
  shippingMethodsOption: any[]
  products: any[]
  colors: any[]
  carriers: any[]
  productTypes: any[]
  sizes: any[]
  printPositions: any[]
  priorityTypes: any[]
  refundStatus: any[]
}

export default function DrawerAdvanceFilter({
  handleSetFilter,
  search,
  shippingMethodsOption,
  products,
  colors,
  carriers,
  productTypes,
  sizes,
  printPositions,
  priorityTypes,
  refundStatus,
}: DrawerAdvanceFilterProps) {
  const [openAdvanceFilter, setOpenFilter] = useState(false)

  const countAdvanceFilter = useMemo(() => {
    const count = Object.keys(search).filter(
      (key) =>
        countAdvanceFilterKey.includes(key) &&
        search[key as keyof SearchType] &&
        (Array.isArray(search[key as keyof SearchType])
          ? (search[key as keyof SearchType] as string[]).length > 0
          : true),
    ).length

    let countOptions = 0

    Object.keys(search).forEach((key) => {
      if (key === AllOrderSearchSchema.keyof().Values.options) {
        countOptions = (search[key as keyof SearchType] as string[]).length
      }
    })

    return count + countOptions
  }, [search])

  return (
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
  )
}
