import { AttributeGroupValueSearchType } from "@/schemas/schemas/attributes"
import { useQueryPod } from "@/services/connect-rpc/transport"
import {
  GMAttribute_Admin_Detail,
  GMAttribute_Admin_Value,
} from "@/services/connect-rpc/types"
import { formatDateForCallApi } from "@/utils"
import {
  staffGetGMAttributeGroupDetail,
  staffListGMAttributeValue,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { useNavigate, useParams, useSearch } from "@tanstack/react-router"
import { createContext, useCallback, useContext, useState } from "react"

interface AttributeGroupValueContext {
  attributeValues: GMAttribute_Admin_Value[]
  rowCount: number
  pageCount: number
  loading: boolean
  handleSetFilter: (filter: AttributeGroupValueSearchType) => void
  isRefetching: boolean
  handleRefetchData: () => Promise<void>
  attributeGroupDetail: GMAttribute_Admin_Detail
}

const AttributeGroupValueContext = createContext<AttributeGroupValueContext>({
  attributeValues: [],
  rowCount: 0,
  pageCount: 0,
  loading: false,
  handleSetFilter: () => {},
  isRefetching: false,
  handleRefetchData: () => Promise.resolve(),
  attributeGroupDetail: new GMAttribute_Admin_Detail(),
})

interface Props {
  children: React.ReactNode
}

export const AttributeGroupValueProvider = ({ children }: Props) => {
  const { groupId } = useParams({
    from: "/_authorize/product-management/attributes/group/$groupId/",
  })
  const navigate = useNavigate({
    from: "/product-management/attributes/group/$groupId",
  })
  const search = useSearch({
    from: "/_authorize/product-management/attributes/group/$groupId/",
  })
  const [isRefetching, setIsRefetching] = useState(false)

  const {
    data = { attributeValues: [], rowCount: 0, pageCount: 0 },
    refetch,
    isPending,
  } = useQueryPod(
    staffListGMAttributeValue,
    {
      filter: {
        attributeGroupKeys: [groupId],
        statuses: search.statuses,
        fromCreatedAt: search.from
          ? formatDateForCallApi(search.from)
          : undefined,
        toCreatedAt: search.to
          ? formatDateForCallApi(search.to, "endOfDay")
          : undefined,
      },
      search: {
        search: {
          case: "token",
          value: search.searchText ? search.searchText : "",
        },
      },
      paging: { page: search.page, limit: search.limit },
    },
    {
      select: (data) => ({
        attributeValues: data.data,
        rowCount: Number(data.paging?.total),
        pageCount: Number(data.paging?.totalPage),
      }),
    },
  )

  const { data: attributeGroupDetail } = useQueryPod(
    staffGetGMAttributeGroupDetail,
    { attributeKey: groupId },
    { enabled: !!groupId, select: (data) => data.data },
  )

  const handleSetFilter = (filter: AttributeGroupValueSearchType) => {
    navigate({
      to: "/product-management/attributes/group/$groupId",
      search: (old) => ({ ...old, ...filter, page: 1 }),
      replace: true,
    })
  }

  const handleRefetchData = useCallback(async () => {
    setIsRefetching(true)
    await Promise.all([refetch()])
    setIsRefetching(false)
  }, [refetch])

  return (
    <AttributeGroupValueContext.Provider
      value={{
        attributeValues: data?.attributeValues,
        rowCount: data?.rowCount,
        pageCount: data?.pageCount,
        loading: isPending,
        handleSetFilter,
        isRefetching,
        handleRefetchData,
        attributeGroupDetail: new GMAttribute_Admin_Detail(
          attributeGroupDetail,
        ),
      }}
    >
      {children}
    </AttributeGroupValueContext.Provider>
  )
}

export const useAttributeGroupValue = () => {
  const context = useContext(AttributeGroupValueContext)
  if (!context) {
    throw new Error(
      "useAttributeGroupValue must be used within a AttributeGroupValueProvider",
    )
  }
  return context
}
