import { CategorySearchSchema } from "@/schemas/schemas/categories"
import { useQueryPod } from "@/services/connect-rpc/transport"
import {
  GMProductCategory_Admin_Short,
  ProductStatus,
  StaffCountGMProductCategoryStatsResponse,
} from "@/services/connect-rpc/types"
import { formatDateForCallApi } from "@/utils"
import {
  staffCountGMProductCategoryStats,
  staffListGMProductCategory,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { createContext, useCallback, useContext, useState } from "react"

interface CategoryManagementContext {
  categories: GMProductCategory_Admin_Short[]
  loading: boolean
  rowCount: number
  pageCount: number
  totalAnalytics: StaffCountGMProductCategoryStatsResponse
  handleSetFilter: (filter: CategorySearchSchema) => void
  isRefetching: boolean
  handleRefetchData: () => Promise<void>
}

const CategoryManagementContext = createContext<CategoryManagementContext>({
  categories: [],
  loading: false,
  rowCount: 0,
  pageCount: 0,
  totalAnalytics: new StaffCountGMProductCategoryStatsResponse(),
  handleSetFilter: () => {},
  isRefetching: false,
  handleRefetchData: () => Promise.resolve(),
})

export const CategoryManagementProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const navigate = useNavigate({
    from: "/product-management/categories",
  })

  const [isRefetching, setIsRefetching] = useState(false)

  const search = useSearch({
    from: "/_authorize/product-management/categories/",
  })

  const { data, isPending, refetch } = useQueryPod(
    staffListGMProductCategory,
    {
      paging: {
        page: search.page,
        limit: search.limit,
      },
      filter: {
        onlyShowParent: true,
        isActive:
          Array.isArray(search.statuses) && search.statuses.length === 1
            ? search.statuses[0] === ProductStatus.ACTIVE
            : undefined,
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
    },
    {
      select: (data) => {
        return {
          categories: data.data,
          rowCount: Number(data.paging?.total) || 0,
          pageCount: Number(data.paging?.totalPage) || 0,
        }
      },
    },
  )

  const { data: analytics } = useQueryPod(
    staffCountGMProductCategoryStats,
    {},
    {
      select: (data) => {
        return {
          totalAnalytics: new StaffCountGMProductCategoryStatsResponse({
            totalCategory: data.totalCategory,
            totalActiveCategory: data.totalActiveCategory,
            totalInactiveCategory: data.totalInactiveCategory,
            totalLinkedProduct: data.totalLinkedProduct,
          }),
        }
      },
    },
  )

  const handleSetFilter = useCallback((filter: CategorySearchSchema) => {
    navigate({
      search: (old) => ({
        ...old,
        ...filter,
        page: 1,
      }),
      replace: true,
    })
  }, [])

  const loading = isPending

  const handleRefetchData = useCallback(async () => {
    setIsRefetching(true)
    await Promise.all([refetch()])
    setIsRefetching(false)
  }, [refetch])

  return (
    <CategoryManagementContext.Provider
      value={{
        categories: data?.categories || [],
        loading: loading,
        rowCount: data?.rowCount || 0,
        pageCount: data?.pageCount || 0,
        totalAnalytics: new StaffCountGMProductCategoryStatsResponse(
          analytics?.totalAnalytics,
        ),
        handleSetFilter,
        isRefetching,
        handleRefetchData,
      }}
    >
      {children}
    </CategoryManagementContext.Provider>
  )
}

export const useCategoryManagement = () => {
  const context = useContext(CategoryManagementContext)
  if (!context) {
    throw new Error(
      "useCategoryManagement must be used within a CategoryManagementProvider",
    )
  }
  return context
}
