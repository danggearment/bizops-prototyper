import { CategoryDetailSearchType } from "@/schemas/schemas/categories"
import { useQueryPod } from "@/services/connect-rpc/transport"
import {
  GMProduct_Admin_Short,
  GMProductCategory_Admin_Detail,
} from "@/services/connect-rpc/types"
import {
  staffGetGMProductCategoryDetail,
  staffListProduct,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { useNavigate, useParams, useSearch } from "@tanstack/react-router"
import { createContext, useCallback, useContext, useState } from "react"

interface CategoryDetailContextType {
  category: GMProductCategory_Admin_Detail
  loading: boolean
  products: GMProduct_Admin_Short[]
  rowCount: number
  pageCount: number
  handleSetFilter: (filter: CategoryDetailSearchType) => void
  handleRefetchData: () => Promise<void>
  isRefetching: boolean
}

const CategoryDetailContext = createContext<CategoryDetailContextType>({
  category: new GMProductCategory_Admin_Detail(),
  loading: false,
  products: [],
  rowCount: 0,
  pageCount: 0,
  handleSetFilter: () => {},
  handleRefetchData: () => Promise.resolve(),
  isRefetching: false,
})

interface Props {
  children: React.ReactNode
}

export function CategoryDetailProvider(props: Props) {
  const { children } = props

  const [isRefetching, setIsRefetching] = useState(false)

  const { categoryId } = useParams({
    from: "/_authorize/product-management/categories/$categoryId/",
  })

  const navigate = useNavigate({
    from: "/product-management/categories/$categoryId",
  })

  const search = useSearch({
    from: "/_authorize/product-management/categories/$categoryId/",
  })

  const { data: category, isLoading } = useQueryPod(
    staffGetGMProductCategoryDetail,
    {
      categoryCode: categoryId,
    },
    {
      enabled: !!categoryId,
      select: (data) => data.data,
    },
  )

  const {
    data: products = { data: [], rowCount: 0, pageCount: 0 },
    isPending: isProductsLoading,
    refetch,
  } = useQueryPod(
    staffListProduct,
    {
      filter: {
        categoryIds: category ? [BigInt(category.id)] : [],
        statuses: search.statuses ? search.statuses.map((v) => Number(v)) : [],
      },
      search: {
        search: {
          case: "token",
          value: search.searchText ? search.searchText : "",
        },
      },
      paging: {
        page: search.page,
        limit: search.limit,
      },
    },
    {
      enabled: !!categoryId && !!category,
      select: (data) => ({
        data: data.data,
        rowCount: data.paging?.total || 0,
        pageCount: data.paging?.totalPage || 0,
      }),
    },
  )

  const loading = isLoading || isProductsLoading

  const handleSetFilter = (filter: CategoryDetailSearchType) => {
    navigate({
      to: "/product-management/categories/$categoryId",
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
    <CategoryDetailContext.Provider
      value={{
        category: new GMProductCategory_Admin_Detail(category),
        products: products.data,
        rowCount: Number(products.rowCount),
        pageCount: Number(products.pageCount),
        loading,
        handleSetFilter,
        handleRefetchData,
        isRefetching,
      }}
    >
      {children}
    </CategoryDetailContext.Provider>
  )
}
export const useCategoryDetail = () => {
  const context = useContext(CategoryDetailContext)
  if (!context) {
    throw new Error(
      "useCategoryDetail must be used within a CategoryDetailProvider",
    )
  }
  return context
}
