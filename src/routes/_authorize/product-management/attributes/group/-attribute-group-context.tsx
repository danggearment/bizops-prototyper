import { AttributesGroupSearchType } from "@/schemas/schemas/attributes"
import { useQueryPod } from "@/services/connect-rpc/transport"
import { GMAttribute_Admin_Short } from "@/services/connect-rpc/types"
import { staffListGMAttributeGroup } from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { createContext, useCallback, useContext, useState } from "react"

interface AttributeGroupContext {
  attributeGroups: GMAttribute_Admin_Short[]
  rowCount: number
  pageCount: number
  loading: boolean
  handleSetFilter: (filter: AttributesGroupSearchType) => void
  isRefetching: boolean
  handleRefetchData: () => Promise<void>
}

const AttributeGroupContext = createContext<AttributeGroupContext>({
  attributeGroups: [],
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

export const AttributeGroupProvider = ({ children }: Props) => {
  const search = useSearch({
    from: "/_authorize/product-management/attributes/group/",
  })

  const navigate = useNavigate({
    from: "/product-management/attributes/group",
  })

  const [isRefetching, setIsRefetching] = useState(false)

  const {
    data = { attributeGroups: [], rowCount: 0, pageCount: 0 },
    isPending,
    refetch,
  } = useQueryPod(
    staffListGMAttributeGroup,
    {
      filter: {
        statuses: search.statuses ? search.statuses.map((v) => Number(v)) : [],
      },
      paging: {
        page: search.page,
        limit: search.limit,
      },
      search: {
        search: {
          case: "searchText",
          value: search.searchText ? search.searchText : "",
        },
      },
    },
    {
      select: (data) => {
        return {
          attributeGroups: data.data,
          rowCount: Number(data.paging?.total || 0),
          pageCount: Number(data.paging?.totalPage || 0),
        }
      },
    },
  )

  const handleSetFilter = (filter: AttributesGroupSearchType) => {
    navigate({
      to: "/product-management/attributes/group",
      search: (old) => ({
        ...old,
        ...filter,
        page: 1,
      }),
      replace: true,
    })
  }

  const handleRefetchData = useCallback(async () => {
    setIsRefetching(true)
    await Promise.all([refetch()])
    setIsRefetching(false)
  }, [refetch])

  return (
    <AttributeGroupContext.Provider
      value={{
        attributeGroups: data?.attributeGroups,
        rowCount: data?.rowCount,
        pageCount: data?.pageCount,
        loading: isPending,
        handleSetFilter,
        isRefetching,
        handleRefetchData,
      }}
    >
      {children}
    </AttributeGroupContext.Provider>
  )
}

export const useAttributeGroup = () => {
  const content = useContext(AttributeGroupContext)
  if (!content) {
    throw Error("AttributeGroupContext is not created")
  }

  return content
}
