import { ProductSearchType } from "@/schemas/schemas/product"
import { useQueryPod } from "@/services/connect-rpc/transport"
import {
  GMProduct_Admin_Short,
  ProductStatus,
  StaffCountProductStatusResponse_Record,
  StaffListProductRequest_SortCriterion,
  StaffListProductRequest_SortCriterion_SortBy,
  StaffListProductRequest_SortCriterion_SortDirection,
} from "@/services/connect-rpc/types"
import { formatDateForCallApi } from "@/utils"
import {
  staffCountProductStatus,
  staffListProduct,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { createContext, useCallback, useContext, useState } from "react"

interface ProductManagementContext {
  products: GMProduct_Admin_Short[]
  loading: boolean
  rowCount: number
  pageCount: number
  totalAnalytics: number
  handleSetFilter: (filter: ProductSearchType) => void
  handleRefetchData: () => Promise<void>
  productAnalytics: StaffCountProductStatusResponse_Record[]
  isRefetching: boolean
}

const ProductManagementContext = createContext<ProductManagementContext>({
  products: [],
  loading: false,
  rowCount: 0,
  pageCount: 0,
  totalAnalytics: 0,
  handleSetFilter: () => {},
  handleRefetchData: () => Promise.resolve(),
  productAnalytics: [],
  isRefetching: false,
})

export const ProductManagementProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const search = useSearch({
    from: "/_authorize/product-management/products/",
  })
  const navigate = useNavigate({
    from: "/product-management/products",
  })

  const [isRefetching, setIsRefetching] = useState(false)

  const { data, isPending, refetch } = useQueryPod(staffListProduct, {
    paging: {
      page: search.page,
      limit: search.limit,
    },
    filter: {
      statuses: search.statuses ? search.statuses.map((v) => Number(v)) : [],
      createdFrom: search.from ? formatDateForCallApi(search.from) : undefined,
      createdTo: search.to
        ? formatDateForCallApi(search.to, "endOfDay")
        : undefined,
    },
    search: {
      search: {
        case: "token",
        value: search.searchText ? search.searchText : "",
      },
    },
    sortCriterion: (search.sortBy || []).reduce<
      StaffListProductRequest_SortCriterion[]
    >((acc, key, idx) => {
      const mapped = sortByMapping[key]
      if (!mapped) return acc
      acc.push(
        new StaffListProductRequest_SortCriterion({
          sortBy: mapped,
          sortDirection: sortDirectionMapping[
            search.sortDirection?.[idx] ?? "desc"
          ] as unknown as StaffListProductRequest_SortCriterion_SortDirection,
        }),
      )
      return acc
    }, []),
  })

  const PRODUCT_STATUSES = [
    ProductStatus.ACTIVE,
    ProductStatus.INACTIVE,
    ProductStatus.DRAFT,
    ProductStatus.UNKNOWN,
  ]

  const defaultProductAnalytics: StaffCountProductStatusResponse_Record[] =
    PRODUCT_STATUSES.map(
      (status) =>
        new StaffCountProductStatusResponse_Record({
          status,
          count: BigInt(0),
        }),
    )

  const { data: analytics = { data: [], total: BigInt(0) } } = useQueryPod(
    staffCountProductStatus,
    {},
    {
      select: ({ data, total }) => {
        const analytics = data.map(
          (record) =>
            new StaffCountProductStatusResponse_Record({
              status: record.status,
              count: record.count,
            }),
        )
        return {
          data: [
            ...[...defaultProductAnalytics, ...analytics]
              .reduce(
                (acc, record) => acc.set(record.status, record),
                new Map(),
              )
              .values(),
          ],
          total: total,
        }
      },
    },
  )

  const productAnalytics = analytics.data
    ? analytics.data.map(
        (record) =>
          new StaffCountProductStatusResponse_Record({
            status: record.status,
            count: BigInt(record.count),
          }),
      )
    : []

  const handleSetFilter = (filter: ProductSearchType) => {
    navigate({
      to: "/product-management/products",
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
    <ProductManagementContext.Provider
      value={{
        products: data?.data || [],
        loading: isPending,
        rowCount: Number(data?.paging?.total) || 0,
        pageCount: Number(data?.paging?.totalPage) || 0,
        totalAnalytics: Number(analytics.total) || 0,
        handleSetFilter,
        handleRefetchData,
        productAnalytics,
        isRefetching,
      }}
    >
      {children}
    </ProductManagementContext.Provider>
  )
}

export const useProductManagement = () => {
  const context = useContext(ProductManagementContext)
  if (!context) {
    throw new Error(
      "useProductManagement must be used within a ProductManagementProvider",
    )
  }
  return context
}

const sortByMapping: Record<
  string,
  StaffListProductRequest_SortCriterion_SortBy
> = {
  updatedAt: StaffListProductRequest_SortCriterion_SortBy.UPDATED_AT,
  createdAt: StaffListProductRequest_SortCriterion_SortBy.CREATED_AT,
}

const sortDirectionMapping: Record<
  string,
  StaffListProductRequest_SortCriterion_SortDirection
> = {
  asc: StaffListProductRequest_SortCriterion_SortDirection.ASC,
  desc: StaffListProductRequest_SortCriterion_SortDirection.DESC,
}
