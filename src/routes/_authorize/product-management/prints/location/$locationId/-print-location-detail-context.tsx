import { useQueryPod } from "@/services/connect-rpc/transport"
import {
  GMPrintLocation_Admin_Detail,
  GMProduct_Admin_Short,
} from "@/services/connect-rpc/types"
import {
  staffGetGMPrintLocationDetail,
  staffListProduct,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { useParams, useSearch } from "@tanstack/react-router"
import { createContext, useCallback, useContext, useState } from "react"

interface PrintLocationDetailContext {
  printLocationDetail: GMPrintLocation_Admin_Detail
  productsUsagePrintLocations: GMProduct_Admin_Short[]
  rowCount: number
  pageCount: number
  isProductsUsagePrintLocationsPending: boolean
  handleRefetchData: () => Promise<void>
  isRefetching: boolean
}

const PrintLocationDetailContext = createContext<PrintLocationDetailContext>({
  printLocationDetail: new GMPrintLocation_Admin_Detail(),
  productsUsagePrintLocations: [],
  rowCount: 0,
  pageCount: 0,
  isProductsUsagePrintLocationsPending: false,
  handleRefetchData: async () => {},
  isRefetching: false,
})

export function PrintLocationDetailProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { locationId } = useParams({
    from: "/_authorize/product-management/prints/location/$locationId/",
  })

  const search = useSearch({
    from: "/_authorize/product-management/prints/location/$locationId/",
  })

  const [isRefetching, setIsRefetching] = useState(false)

  const { data: printLocationDetail = new GMPrintLocation_Admin_Detail() } =
    useQueryPod(
      staffGetGMPrintLocationDetail,
      { code: locationId },
      {
        enabled: !!locationId,
        select: (data) => data.data,
      },
    )

  const {
    data: productsUsagePrintLocations = { data: [], rowCount: 0, pageCount: 0 },
    refetch,
    isPending: isProductsUsagePrintLocationsPending,
  } = useQueryPod(
    staffListProduct,
    {
      filter: { printLocationCodes: [locationId] },
      paging: { page: search.page, limit: search.limit },
      search: {
        search: {
          case: "token",
          value: search.searchText ? search.searchText : "",
        },
      },
    },
    {
      enabled: !!locationId,
      select: (data) => ({
        data: data.data,
        rowCount: data.paging?.total || 0,
        pageCount: data.paging?.totalPage || 0,
      }),
    },
  )

  const handleRefetchData = useCallback(async () => {
    setIsRefetching(true)
    await Promise.all([refetch()])
    setIsRefetching(false)
  }, [refetch])

  return (
    <PrintLocationDetailContext.Provider
      value={{
        printLocationDetail,
        productsUsagePrintLocations: productsUsagePrintLocations.data,
        rowCount: Number(productsUsagePrintLocations.rowCount),
        pageCount: productsUsagePrintLocations.pageCount,
        isProductsUsagePrintLocationsPending,
        handleRefetchData,
        isRefetching,
      }}
    >
      {children}
    </PrintLocationDetailContext.Provider>
  )
}

export function usePrintLocationDetail() {
  const context = useContext(PrintLocationDetailContext)
  if (!context) {
    throw new Error(
      "usePrintLocationDetail must be used within a PrintLocationDetailContextProvider",
    )
  }
  return context
}
