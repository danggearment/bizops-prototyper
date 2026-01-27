import {
  AllOrderSearchKeys,
  AllOrderSearchSchema,
  AllOrderSearchType,
} from "@/schemas/schemas/all-orders"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { RowSelectionState } from "@tanstack/react-table"
import {
  createContext,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"

import { MarkFulfilledOptionsAllOrderEnum } from "@/constants/order"
import { transportPod, useQueryPod } from "@/services/connect-rpc/transport.tsx"
import {
  Criteria,
  MarketplacePlatform,
  Order_Admin,
  Order_ListingSearch,
  Order_OrderStatus,
  Order_StaffListingFilter,
  Order_StaffSortCriterion,
  ProductGroup,
  RefundStatusCriteria,
  StaffCountOrderStatusResponse_Record,
} from "@/services/connect-rpc/types"
import { formatDateForCallApi } from "@/utils/format-date.ts"
import {
  staffCountOrderStatus,
  staffListOrder,
  staffListSalesOrderFilterCriteria,
} from "@gearment/nextapi/api/pod/v1/admin_api-OrderAdminAPI_connectquery.ts"
import { toast } from "@gearment/ui3"
import { keepPreviousData } from "@tanstack/react-query"
import { sortByMapping, sortDirectionMapping } from "../-helper"

interface AllOrdersContext {
  loading: boolean
  search: AllOrderSearchType
  filter: ReturnType<typeof createFilter>
  handleSetFilter: (
    search: AllOrderSearchType,
    resetRowState?: boolean,
    replace?: boolean,
  ) => void
  filterTags: [
    AllOrderSearchType,
    (search: AllOrderSearchType, resetRowState?: boolean) => void,
  ]
  shippingMethodsOption: Criteria[]
  colors: Criteria[]
  orderLocations: Criteria[]
  carriers: Criteria[]
  productTypes: Criteria[]
  sizes: Criteria[]
  printPositions: Criteria[]
  priorityTypes: Criteria[]
  creationMethods: Criteria[]
  refundStatus: RefundStatusCriteria[]
  products: ProductGroup[]
  orderList: Order_Admin[]
  rowCount: number
  pageCount: number
  rowSelection: RowSelectionState
  setRowSelection: React.Dispatch<SetStateAction<RowSelectionState>>
  ordersCount: StaffCountOrderStatusResponse_Record[]
  handleRefetchData: (showToast?: boolean) => Promise<void>
  markFulfilled: Criteria[]
  fulfillmentVendors: Criteria[]
}

// Helper function to create filter with proper typing
const createFilter = (search: AllOrderSearchType) => ({
  limit: search.limit,
  page: search.page,
  search: new Order_ListingSearch({
    search: search.searchText
      ? {
          case: search.searchKey || AllOrderSearchKeys.Values.orderId,
          value: search.searchText,
        }
      : undefined,
  }),
  filter: new Order_StaffListingFilter({
    ...search,
    processingStatuses: search.processingStatuses
      ? search.processingStatuses
      : [Order_OrderStatus.ALL],
    processingStatusForTabFilter: search.processingStatus
      ? search.processingStatus
      : undefined,
    platforms: search.platforms as unknown as MarketplacePlatform[],
    shippingMethods: search.shippingMethods,
    createdMethods: search.createdMethods,
    from: search.from ? formatDateForCallApi(search.from) : undefined,
    to: search.to ? formatDateForCallApi(search.to, "endOfDay") : undefined,
    orderLocationOptions: search.orderLocation ? [search.orderLocation] : [],
    trackingCarriers: search.carrier || [],
    priorities: search.priority ? [search.priority] : [],
    productTypes: search.productType ? [BigInt(search.productType)] : [],
    refundStatuses: search.refundStatus || [],
    productPrintAreas: search.positionPrint,
    storeIds: search.storeIds,
    variantIds: search.variantId ? [search.variantId] : [],
    productIds: search.productIds,
    colorCodes: search.colorCodes,
    sizeCodes: search.sizeCodes,
    fulfillmentVendorIds: search.fulfillmentVendors,
    isMarkFulfilled: search.markFulfilled
      ? search.markFulfilled === MarkFulfilledOptionsAllOrderEnum.MARK_FULFILLED
        ? true
        : false
      : undefined,
  }),
  sortCriterion: search.sortBy?.length
    ? new Order_StaffSortCriterion({
        sortBy: sortByMapping[search.sortBy[0]],
        sortDirection:
          sortDirectionMapping[search.sortDirection?.[0] ?? "desc"],
      })
    : undefined,
})

const AllOrderContext = createContext<AllOrdersContext>({
  loading: false,
  search: AllOrderSearchSchema.parse({}),
  filter: createFilter(AllOrderSearchSchema.parse({})),
  handleSetFilter: () => {},
  filterTags: [AllOrderSearchSchema.parse({}), () => {}],
  shippingMethodsOption: [],
  sizes: [],
  products: [],
  orderList: [],
  colors: [],
  carriers: [],
  productTypes: [],
  orderLocations: [],
  printPositions: [],
  refundStatus: [],
  priorityTypes: [],
  creationMethods: [],
  rowCount: 0,
  pageCount: 0,
  rowSelection: {},
  setRowSelection: () => {},
  ordersCount: [],
  handleRefetchData: async () => {},
  markFulfilled: [],
  fulfillmentVendors: [],
})

interface Props {
  children: React.ReactNode
}

export default function AllOrdersProvider({ children }: Props) {
  const search = useSearch({
    from: "/_authorize/order/sale-orders/",
  })
  const navigate = useNavigate()
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const filter = createFilter(search)

  const { data: ordersCount, refetch: refetchCountOrder } = useQueryPod(
    staffCountOrderStatus,
    {
      ...filter,
      filter: {
        ...filter.filter,
      },
    },
    {
      transport: transportPod({
        useHttpGet: false,
      }),
      placeholderData: keepPreviousData,
      select: (data) => data.data,
    },
  )

  const {
    data: orderList,
    isPending,
    isLoading,
    refetch: refetchOrder,
  } = useQueryPod(staffListOrder, filter, {
    transport: transportPod({
      useHttpGet: false,
    }),
    select: (data) => ({
      data: data.data,
      rowCount: data.total,
      pageCount: data.totalPage,
    }),
  })

  const { data: listSalesOrderFilterCriteria } = useQueryPod(
    staffListSalesOrderFilterCriteria,
  )

  const handleSetFilter = useCallback(
    (
      newFilter: AllOrderSearchType,
      resetRowState: boolean = true,
      replace: boolean = false,
    ) => {
      navigate({
        from: "/order/sale-orders",
        search: (old) =>
          replace ? { ...newFilter } : { ...old, ...newFilter },
        replace: true,
      })
      if (resetRowState) {
        setRowSelection({})
      }
    },
    [navigate],
  )

  const handleRefetchData = async (showToast?: boolean) => {
    await Promise.allSettled([refetchCountOrder(), refetchOrder()])

    if (showToast) {
      toast({
        title: "Successfully retrieved data",
      })
    }
  }

  const filterTags: AllOrdersContext["filterTags"] = useMemo(
    () => [search, handleSetFilter],
    [search, handleSetFilter],
  )

  const values = useMemo(
    () => ({
      orderList: orderList?.data || [],
      rowCount: Number(orderList?.rowCount) || 0,
      pageCount: orderList?.pageCount || 0,
    }),
    [orderList],
  )

  return (
    <AllOrderContext.Provider
      value={{
        ...values,
        search,
        filter,
        loading: isPending || isLoading,
        handleSetFilter,
        filterTags,
        rowSelection,
        setRowSelection,
        ordersCount: ordersCount || [],
        handleRefetchData,
        shippingMethodsOption:
          listSalesOrderFilterCriteria?.shippingMethods || [],
        products: listSalesOrderFilterCriteria?.products || [],
        colors: listSalesOrderFilterCriteria?.colors || [],
        orderLocations: listSalesOrderFilterCriteria?.orderLocations || [],
        carriers: listSalesOrderFilterCriteria?.carriers || [],
        productTypes: listSalesOrderFilterCriteria?.productTypes || [],
        sizes: listSalesOrderFilterCriteria?.sizes || [],
        printPositions: listSalesOrderFilterCriteria?.printPositions || [],
        priorityTypes: listSalesOrderFilterCriteria?.priorityTypes || [],
        creationMethods: listSalesOrderFilterCriteria?.creationMethods || [],
        refundStatus: listSalesOrderFilterCriteria?.refundStatus || [],
        markFulfilled: listSalesOrderFilterCriteria?.markFulfilled || [],
        fulfillmentVendors:
          listSalesOrderFilterCriteria?.fulfillmentVendor || [],
      }}
    >
      {children}
    </AllOrderContext.Provider>
  )
}

export const useAllOrder = () => {
  const context = useContext(AllOrderContext)
  if (!context) {
    throw new Error("No content provided")
  }

  return context
}
