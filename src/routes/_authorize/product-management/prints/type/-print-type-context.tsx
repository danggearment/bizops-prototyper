import { PrintTypeSearchType } from "@/schemas/schemas/prints"
import { useQueryPod } from "@/services/connect-rpc/transport"
import {
  GMProductPrintType_Admin_Short,
  StaffCountGMProductPrintTypeStatsResponse,
} from "@/services/connect-rpc/types"
import { formatDateForCallApi } from "@/utils"
import {
  staffCountGMProductPrintTypeStats,
  staffListGMProductPrintType,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { createContext, useCallback, useContext, useState } from "react"

interface PrintTypeContext {
  printTypes: GMProductPrintType_Admin_Short[]
  rowCount: number
  pageCount: number
  loading: boolean
  handleSetFilter: (filter: PrintTypeSearchType) => void
  isRefetching: boolean
  handleRefetchData: () => Promise<void>
  analytics: StaffCountGMProductPrintTypeStatsResponse
}

const PrintTypeContext = createContext<PrintTypeContext>({
  printTypes: [],
  rowCount: 0,
  pageCount: 0,
  loading: false,
  handleSetFilter: () => {},
  isRefetching: false,
  handleRefetchData: () => Promise.resolve(),
  analytics: new StaffCountGMProductPrintTypeStatsResponse(),
})

interface PrintTypeContextProps {
  children: React.ReactNode
}

export function PrintTypeProvider({ children }: PrintTypeContextProps) {
  const search = useSearch({
    from: "/_authorize/product-management/prints/type/",
  })
  const navigate = useNavigate({
    from: "/product-management/prints/type",
  })

  const [isRefetching, setIsRefetching] = useState(false)

  const {
    data = { printTypes: [], rowCount: 0, pageCount: 0 },
    isPending,
    refetch,
  } = useQueryPod(
    staffListGMProductPrintType,
    {
      filter: {
        statuses: search.statuses
          ? search.statuses.map((status) => Number(status))
          : [],
        createdAtFrom: search.from
          ? formatDateForCallApi(search.from)
          : undefined,
        createdAtTo: search.to
          ? formatDateForCallApi(search.to, "endOfDay")
          : undefined,
      },
      search: {
        search: {
          case: "searchText",
          value: search.searchText ? search.searchText : "",
        },
      },
      paging: {
        page: search.page,
        limit: search.limit,
      },
    },
    {
      select: (data) => {
        return {
          printTypes: data.data,
          rowCount: Number(data.paging?.total || 0),
          pageCount: Number(data.paging?.totalPage || 0),
        }
      },
    },
  )

  const {
    data: analytics = new StaffCountGMProductPrintTypeStatsResponse({
      totalPrintType: BigInt(0),
      activePrintType: BigInt(0),
      inactivePrintType: BigInt(0),
    }),
  } = useQueryPod(
    staffCountGMProductPrintTypeStats,
    {},
    {
      select: (data) => {
        return new StaffCountGMProductPrintTypeStatsResponse({
          totalPrintType: data.totalPrintType,
          activePrintType: data.activePrintType,
          inactivePrintType: data.inactivePrintType,
        })
      },
    },
  )

  const handleSetFilter = useCallback((filter: PrintTypeSearchType) => {
    navigate({
      to: "/product-management/prints/type",
      search: (old) => ({
        ...old,
        ...filter,
        page: 1,
      }),
      replace: true,
    })
  }, [])

  const handleRefetchData = useCallback(async () => {
    setIsRefetching(true)
    await Promise.all([refetch()])
    setIsRefetching(false)
  }, [refetch])

  const loading = isPending

  return (
    <PrintTypeContext.Provider
      value={{
        printTypes: data.printTypes,
        rowCount: data.rowCount,
        pageCount: data.pageCount,
        loading: loading,
        handleSetFilter,
        isRefetching,
        handleRefetchData,
        analytics: analytics
          ? analytics
          : new StaffCountGMProductPrintTypeStatsResponse(),
      }}
    >
      {children}
    </PrintTypeContext.Provider>
  )
}

export function usePrintType() {
  const context = useContext(PrintTypeContext)
  if (!context) {
    throw new Error(
      "usePrintTypeContext must be used within a PrintTypeContextProvider",
    )
  }
  return context
}
