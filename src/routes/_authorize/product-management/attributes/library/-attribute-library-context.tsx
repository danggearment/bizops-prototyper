import { AttributeLibrarySearchType } from "@/schemas/schemas/attributes"
import { useQueryPod } from "@/services/connect-rpc/transport"
import {
  GMAttribute_Admin_Value,
  GMAttributeValueStatus,
} from "@/services/connect-rpc/types"
import { formatDateForCallApi } from "@/utils"
import { staffListGMAttributeValue } from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { createContext, useCallback, useContext, useState } from "react"

interface AttributeLibraryContext {
  attributeLibraries: GMAttribute_Admin_Value[]
  rowCount: number
  pageCount: number
  loading: boolean
  handleSetFilter: (filter: AttributeLibrarySearchType) => void
  isRefetching: boolean
  handleRefetchData: () => Promise<void>
}

const AttributeLibraryContext = createContext<AttributeLibraryContext>({
  attributeLibraries: [],
  rowCount: 0,
  pageCount: 0,
  loading: false,
  handleSetFilter: () => {},
  isRefetching: false,
  handleRefetchData: () => Promise.resolve(),
})

interface Props {
  children: React.ReactNode
}

export const AttributeLibraryProvider = ({ children }: Props) => {
  const search = useSearch({
    from: "/_authorize/product-management/attributes/library/",
  })

  const navigate = useNavigate({
    from: "/product-management/attributes/library",
  })

  const [isRefetching, setIsRefetching] = useState(false)

  const {
    data = { attributeLibraries: [], rowCount: 0, pageCount: 0 },
    isPending,
    refetch,
  } = useQueryPod(
    staffListGMAttributeValue,
    {
      filter: {
        statuses: search.statuses
          ? search.statuses.map((v: GMAttributeValueStatus) => Number(v))
          : [],
        attributeGroupKeys:
          search.attributeGroupKeys?.filter((v): v is string => v !== "") || [],
        onlyUngrouped: search.attributeGroupKeys?.some((v) => v === ""),
        fromCreatedAt: search.from
          ? formatDateForCallApi(search.from)
          : undefined,
        toCreatedAt: search.to
          ? formatDateForCallApi(search.to, "endOfDay")
          : undefined,
      },
      paging: {
        page: search.page,
        limit: search.limit,
      },
      search: {
        search: {
          case: "token",
          value: search.searchText ? search.searchText : "",
        },
      },
    },
    {
      select: (data) => {
        return {
          attributeLibraries: data.data,
          rowCount: Number(data.paging?.total || 0),
          pageCount: Number(data.paging?.totalPage || 0),
        }
      },
    },
  )

  const handleSetFilter = useCallback(
    (filter: AttributeLibrarySearchType) => {
      navigate({
        to: "/product-management/attributes/library",
        search: (old) => ({
          ...old,
          ...filter,
          page: 1,
        }),
        replace: true,
      })
    },
    [navigate],
  )

  const handleRefetchData = useCallback(async () => {
    setIsRefetching(true)
    await Promise.all([refetch()])
    setIsRefetching(false)
  }, [refetch])

  return (
    <AttributeLibraryContext.Provider
      value={{
        attributeLibraries: data?.attributeLibraries,
        rowCount: data?.rowCount,
        pageCount: data?.pageCount,
        loading: isPending,
        handleSetFilter,
        isRefetching,
        handleRefetchData,
      }}
    >
      {children}
    </AttributeLibraryContext.Provider>
  )
}

export const useAttributeLibrary = () => {
  const content = useContext(AttributeLibraryContext)
  if (!content) {
    throw Error("AttributeLibraryContext is not created")
  }

  return content
}
