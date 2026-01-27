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

import {
  OrderDraftSearchKeys,
  OrderDraftSearchSchema,
  OrderDraftSearchType,
} from "@/schemas/schemas/order-draft"
import { useQueryPod } from "@/services/connect-rpc/transport.tsx"
import {
  Criteria,
  MarketplacePlatform,
  OrderDraft_Admin,
  OrderDraft_Status,
  ProductGroup,
} from "@/services/connect-rpc/types"
import { formatDateForCallApi } from "@/utils/format-date.ts"
import {
  staffCountOrderDraftStatus,
  staffListOrderDraft,
  staffListSalesOrderDraftFilterCriteria,
} from "@gearment/nextapi/api/pod/v1/order_draft_admin-OrderDraftAdminAPI_connectquery"
import { StaffCountOrderDraftStatusResponse_Record } from "@gearment/nextapi/api/pod/v1/order_draft_admin_pb"
import { toast } from "@gearment/ui3"
import { keepPreviousData } from "@tanstack/react-query"

interface OrderDraftContext {
  loading: boolean
  search: OrderDraftSearchType
  handleSetFilter: (
    search: OrderDraftSearchType,
    resetRowState?: boolean,
  ) => void
  filterTags: [
    OrderDraftSearchType,
    (search: OrderDraftSearchType, resetRowState?: boolean) => void,
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
  products: ProductGroup[]
  orderList: OrderDraft_Admin[]
  rowCount: number
  pageCount: number
  rowSelection: RowSelectionState
  setRowSelection: React.Dispatch<SetStateAction<RowSelectionState>>
  ordersCount: StaffCountOrderDraftStatusResponse_Record[]
  handleRefetchData: (showToast?: boolean) => Promise<void>
}

const OrderDraftContext = createContext<OrderDraftContext>({
  loading: false,
  search: OrderDraftSearchSchema.parse({}),
  handleSetFilter: () => {},
  filterTags: [OrderDraftSearchSchema.parse({}), () => {}],
  shippingMethodsOption: [],
  sizes: [],
  products: [],
  orderList: [],
  colors: [],
  carriers: [],
  productTypes: [],
  orderLocations: [],
  printPositions: [],
  priorityTypes: [],
  creationMethods: [],
  rowCount: 0,
  pageCount: 0,
  rowSelection: {},
  setRowSelection: () => {},
  ordersCount: [],
  handleRefetchData: async () => {},
})

interface Props {
  children: React.ReactNode
}

export default function OrderDraftProvider({ children }: Props) {
  const search = useSearch({
    from: "/_authorize/order/draft-orders/",
  })
  const navigate = useNavigate()
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const filter = {
    limit: search.limit,
    page: search.page,
    search: {
      search: search.searchText
        ? {
            case: search.searchKey || OrderDraftSearchKeys.Values.draftId,
            value: search.searchText,
          }
        : undefined,
    },
    filter: {
      ...search,
      status:
        search.status === OrderDraft_Status.ALL
          ? undefined
          : (search.status as unknown as OrderDraft_Status),
      platforms: search.platforms as unknown as MarketplacePlatform[],
      shippingMethods: search.shippingMethods,
      createdMethods: search.createdMethods,
      from: search.from ? formatDateForCallApi(search.from) : undefined,
      to: search.to ? formatDateForCallApi(search.to, "endOfDay") : undefined,
      orderLocation: search.orderLocation,
      carrier: search.carrier,
      priority: search.priority,
      productType: BigInt(search.productType || 0),
      refundStatuses: search.refundStatus,
      positionPrint: search.positionPrint,
      storeIds: search.storeIds,
      variant: search.variant,
      ioss: search.ioss,
      productIds: search.productIds,
      colorCodes: search.colorCodes,
      sizeCodes: search.sizeCodes,
    },
  }

  const { data: ordersCount, refetch: refetchCountOrder } = useQueryPod(
    staffCountOrderDraftStatus,
    {
      ...filter,
      filter: {
        ...filter.filter,
        status: undefined,
      },
    },
    {
      placeholderData: keepPreviousData,
      select: (data) => data.data,
    },
  )

  const {
    data: orderList,
    isPending,
    isLoading,
    refetch: refetchOrder,
  } = useQueryPod(staffListOrderDraft, filter, {
    select: (data) => ({
      data: data.data,
      rowCount: data.total,
      pageCount: data.totalPage,
    }),
  })

  const { data: listSalesOrderFilterCriteria } = useQueryPod(
    staffListSalesOrderDraftFilterCriteria,
  )

  const handleSetFilter = useCallback(
    (newFilter: OrderDraftSearchType, resetRowState = true) => {
      navigate({
        from: "/order/draft-orders",
        search: (old) => ({
          ...old,
          ...newFilter,
        }),
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

  const filterTags: OrderDraftContext["filterTags"] = useMemo(
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
    <OrderDraftContext.Provider
      value={{
        ...values,
        search,
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
        creationMethods: listSalesOrderFilterCriteria?.createdMethods || [],
      }}
    >
      {children}
    </OrderDraftContext.Provider>
  )
}

export const useOrderDraft = () => {
  const context = useContext(OrderDraftContext)
  if (!context) {
    throw new Error("No content provided")
  }

  return context
}
