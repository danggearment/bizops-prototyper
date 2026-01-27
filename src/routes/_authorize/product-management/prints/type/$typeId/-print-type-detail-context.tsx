import { useQueryPod } from "@/services/connect-rpc/transport"
import {
  GMProduct_Admin_Short,
  GMProductPrintType_Admin_Detail,
} from "@/services/connect-rpc/types"
import {
  staffGetGMProductPrintTypeDetail,
  staffListProduct,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { useParams, useSearch } from "@tanstack/react-router"
import { createContext, useCallback, useContext, useState } from "react"

interface PrintTypeDetailContext {
  printTypeDetail: GMProductPrintType_Admin_Detail
  productsUsagePrintTypes: GMProduct_Admin_Short[]
  rowCount: number
  pageCount: number
  isProductsUsagePrintTypesPending: boolean
  handleRefetchData: () => Promise<void>
  isRefetching: boolean
}

const PrintTypeDetailContext = createContext<PrintTypeDetailContext>({
  printTypeDetail: new GMProductPrintType_Admin_Detail(),
  productsUsagePrintTypes: [],
  rowCount: 0,
  pageCount: 0,
  isProductsUsagePrintTypesPending: false,
  handleRefetchData: async () => {},
  isRefetching: false,
})

interface Props {
  children: React.ReactNode
}

export function PrintTypeDetailProvider({ children }: Props) {
  const { typeId } = useParams({
    from: "/_authorize/product-management/prints/type/$typeId/",
  })

  const search = useSearch({
    from: "/_authorize/product-management/prints/type/$typeId/",
  })

  const [isRefetching, setIsRefetching] = useState(false)

  const { data: printTypeDetail = new GMProductPrintType_Admin_Detail() } =
    useQueryPod(
      staffGetGMProductPrintTypeDetail,
      { printTypeCode: typeId },
      {
        enabled: !!typeId,
        select: (data) => data.data,
      },
    )

  const {
    data: productsUsagePrintTypes = { data: [], rowCount: 0, pageCount: 0 },
    refetch,
    isPending: isProductsUsagePrintTypesPending,
  } = useQueryPod(
    staffListProduct,
    {
      filter: { printTypeCodes: [typeId] },
      paging: { page: search.page, limit: search.limit },
      search: {
        search: {
          case: "token",
          value: search.searchText ? search.searchText : "",
        },
      },
    },
    {
      enabled: !!typeId,
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
    <PrintTypeDetailContext.Provider
      value={{
        printTypeDetail,
        productsUsagePrintTypes: productsUsagePrintTypes.data,
        rowCount: Number(productsUsagePrintTypes.rowCount),
        pageCount: productsUsagePrintTypes.pageCount,
        isProductsUsagePrintTypesPending,
        handleRefetchData,
        isRefetching,
      }}
    >
      {children}
    </PrintTypeDetailContext.Provider>
  )
}

export function usePrintTypeDetail() {
  const context = useContext(PrintTypeDetailContext)
  if (!context) {
    throw new Error(
      "usePrintTypeDetail must be used within a PrintTypeDetailContextProvider",
    )
  }
  return context
}
