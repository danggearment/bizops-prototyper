import { PrintLocationSearchType } from "@/schemas/schemas/prints"
import { useQueryPod } from "@/services/connect-rpc/transport"
import { StaffCountGMPrintLocationStatsResponse } from "@/services/connect-rpc/types"
import { formatDateForCallApi } from "@/utils"
import {
  staffCountGMPrintLocationStats,
  staffListGMPrintLocation,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { createContext, useCallback, useContext, useState } from "react"

interface PrintLocationContext {
  printLocations: any[]
  rowCount: number
  pageCount: number
  loading: boolean
  handleSetFilter: (filter: PrintLocationSearchType) => void
  isRefetching: boolean
  handleRefetchData: () => Promise<void>
  analytics: StaffCountGMPrintLocationStatsResponse
}

const PrintLocationContext = createContext<PrintLocationContext>({
  printLocations: [],
  rowCount: 0,
  pageCount: 0,
  loading: false,
  handleSetFilter: () => {},
  isRefetching: false,
  handleRefetchData: () => Promise.resolve(),
  analytics: new StaffCountGMPrintLocationStatsResponse(),
})

interface Props {
  children: React.ReactNode
}

export const PrintLocationProvider = ({ children }: Props) => {
  const search = useSearch({
    from: "/_authorize/product-management/prints/location/",
  })

  const navigate = useNavigate({
    from: "/product-management/prints/location",
  })

  const [isRefetching, setIsRefetching] = useState(false)

  const {
    data = { printLocations: [], rowCount: 0, pageCount: 0 },
    isPending,
    refetch,
  } = useQueryPod(
    staffListGMPrintLocation,
    {
      filter: {
        fromCreatedAt: search.from
          ? formatDateForCallApi(search.from)
          : undefined,
        toCreatedAt: search.to
          ? formatDateForCallApi(search.to, "endOfDay")
          : undefined,
        statuses: search.statuses ? search.statuses.map((v) => Number(v)) : [],
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
          printLocations: data.data,
          rowCount: Number(data.paging?.total || 0),
          pageCount: Number(data.paging?.totalPage || 0),
        }
      },
    },
  )

  const {
    data: analytics = new StaffCountGMPrintLocationStatsResponse({
      totalLocations: BigInt(0),
      totalActiveLocations: BigInt(0),
      totalInactiveLocations: BigInt(0),
    }),
  } = useQueryPod(
    staffCountGMPrintLocationStats,
    {},
    {
      select: (data) => {
        return new StaffCountGMPrintLocationStatsResponse({
          totalLocations: data.totalLocations,
          totalActiveLocations: data.totalActiveLocations,
          totalInactiveLocations: data.totalInactiveLocations,
        })
      },
    },
  )

  const handleSetFilter = useCallback((filter: PrintLocationSearchType) => {
    navigate({
      to: "/product-management/prints/location",
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
    <PrintLocationContext.Provider
      value={{
        printLocations: data?.printLocations,
        rowCount: data?.rowCount,
        pageCount: data?.pageCount,
        loading,
        handleSetFilter,
        isRefetching,
        handleRefetchData,
        analytics: new StaffCountGMPrintLocationStatsResponse(analytics),
      }}
    >
      {children}
    </PrintLocationContext.Provider>
  )
}

export const usePrintLocation = () => {
  const content = useContext(PrintLocationContext)
  if (!content) {
    throw new Error("PrintLocationContext not found in context")
  }
  return content
}
