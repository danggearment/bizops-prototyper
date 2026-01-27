import { useQueryPod } from "@/services/connect-rpc/transport"
import {
  GMAttribute_Admin_Value_Detail,
  GMProduct_Admin_Short,
} from "@/services/connect-rpc/types"
import {
  staffGetGMAttributeValueDetail,
  staffListProduct,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { useParams, useSearch } from "@tanstack/react-router"
import { createContext, useCallback, useContext, useState } from "react"

interface AttributeLibraryDetailContext {
  attributeLibraryDetail: GMAttribute_Admin_Value_Detail
  productsUsageAttribute: GMProduct_Admin_Short[]
  handleRefetchData: () => Promise<void>
  isRefetching: boolean
  loadingProductTable: boolean
  rowCount: number
  pageCount: number
}

const AttributeLibraryDetailContext =
  createContext<AttributeLibraryDetailContext>({
    attributeLibraryDetail: new GMAttribute_Admin_Value_Detail(),
    productsUsageAttribute: [],
    handleRefetchData: async () => {},
    isRefetching: false,
    loadingProductTable: false,
    rowCount: 0,
    pageCount: 0,
  })

interface Props {
  children: React.ReactNode
}

export const AttributeLibraryDetailProvider = ({ children }: Props) => {
  const { libraryId } = useParams({
    from: "/_authorize/product-management/attributes/library/$libraryId/",
  })

  const search = useSearch({
    from: "/_authorize/product-management/attributes/library/$libraryId/",
  })

  const [isRefetching, setIsRefetching] = useState(false)

  const { data: attributeLibraryDetail } = useQueryPod(
    staffGetGMAttributeValueDetail,
    { attributeCode: libraryId },
    {
      enabled: !!libraryId,
      select: (data) => data.data,
    },
  )

  const {
    data: productsUsageAttribute = { data: [], rowCount: 0, pageCount: 0 },
    refetch,
    isPending: isProductsUsageAttributePending,
  } = useQueryPod(
    staffListProduct,
    {
      filter: { attrCodes: [libraryId] },
      paging: { page: search.page, limit: search.limit },
      search: {
        search: {
          case: "token",
          value: search.searchText ? search.searchText : "",
        },
      },
    },
    {
      enabled: !!libraryId,
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

  const loadingProductTable = isProductsUsageAttributePending

  return (
    <AttributeLibraryDetailContext.Provider
      value={{
        attributeLibraryDetail: new GMAttribute_Admin_Value_Detail(
          attributeLibraryDetail,
        ),
        productsUsageAttribute: productsUsageAttribute.data,
        rowCount: Number(productsUsageAttribute?.rowCount) || 0,
        pageCount: Number(productsUsageAttribute?.pageCount) || 0,
        handleRefetchData,
        isRefetching,
        loadingProductTable,
      }}
    >
      {children}
    </AttributeLibraryDetailContext.Provider>
  )
}

export const useAttributeLibraryDetail = () => {
  const content = useContext(AttributeLibraryDetailContext)
  if (!content) {
    throw Error("AttributeLibraryDetailContext is not created")
  }

  return content
}
