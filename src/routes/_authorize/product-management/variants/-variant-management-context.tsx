import { ProductVariantsSearchType } from "@/schemas/schemas/product"
import { useQueryPod } from "@/services/connect-rpc/transport"
import {
  GMProduct_Admin_Variant_Short,
  StaffCountProductVariantResponse,
  StaffListProductVariantRequest_SortCriterion,
  StaffListProductVariantRequest_SortCriterion_SortBy,
  StaffListProductVariantRequest_SortCriterion_SortDirection,
} from "@/services/connect-rpc/types"
import { formatDateForCallApi } from "@/utils"
import {
  staffCountProductVariant,
  staffListProductVariant,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { createContext, useCallback, useContext, useState } from "react"

const LOW_STOCK_THRESHOLD = BigInt(20)

interface VariantManagementContext {
  variantAnalytics?: StaffCountProductVariantResponse
  lowStockThreshHold: number
  loading: boolean
  variants: GMProduct_Admin_Variant_Short[]
  handleSetFilter: (filter: ProductVariantsSearchType) => void
  handleRefetchData: () => Promise<void>
  isRefetching: boolean
  totalVariants: number
  totalPage: number
}

const VariantManagementContext = createContext<VariantManagementContext>({
  variantAnalytics: undefined,
  lowStockThreshHold: Number(LOW_STOCK_THRESHOLD),
  loading: false,
  variants: [],
  handleSetFilter: () => {},
  handleRefetchData: () => Promise.resolve(),
  isRefetching: false,
  totalVariants: 0,
  totalPage: 0,
})

export const VariantManagementProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const search = useSearch({
    from: "/_authorize/product-management/variants/",
  })

  const navigate = useNavigate({
    from: "/product-management/variants",
  })

  const [isRefetching, setIsRefetching] = useState(false)

  const { data: variantAnalytics } = useQueryPod(
    staffCountProductVariant,
    {
      selector: {
        lowStockThreshold: LOW_STOCK_THRESHOLD,
      },
    },
    {
      select: (data) => data,
    },
  )

  const {
    data: variants,
    isPending,
    refetch,
  } = useQueryPod(staffListProductVariant, {
    paging: {
      page: search.page,
      limit: search.limit,
    },
    filter: {
      statuses: search.statuses,
      fromCreatedAt: search.from
        ? formatDateForCallApi(search.from)
        : undefined,
      toCreatedAt: search.to
        ? formatDateForCallApi(search.to, "endOfDay")
        : undefined,
      productIds: search.productIds,
    },
    search: {
      search: {
        case: "variantToken",
        value: search.variantSearchText ? search.variantSearchText : "",
      },
    },
    sortCriterion: (search.sortBy || []).reduce<
      StaffListProductVariantRequest_SortCriterion[]
    >((acc, key, idx) => {
      const mapped = sortByMapping[key]
      if (!mapped) return acc
      acc.push(
        new StaffListProductVariantRequest_SortCriterion({
          sortBy: mapped,
          sortDirection: sortDirectionMapping[
            search.sortDirection?.[idx] ?? "desc"
          ] as unknown as StaffListProductVariantRequest_SortCriterion_SortDirection,
        }),
      )
      return acc
    }, []),
  })

  const handleSetFilter = (filter: ProductVariantsSearchType) => {
    navigate({
      to: "/product-management/variants",
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
    <VariantManagementContext.Provider
      value={{
        variantAnalytics: variantAnalytics,
        lowStockThreshHold: Number(LOW_STOCK_THRESHOLD),
        loading: isPending,
        variants: variants?.data || [],
        handleSetFilter,
        handleRefetchData,
        isRefetching,
        totalVariants: Number(variants?.paging?.total) || 0,
        totalPage: Number(variants?.paging?.totalPage) || 0,
      }}
    >
      {children}
    </VariantManagementContext.Provider>
  )
}

export const useVariantManagement = () => {
  const context = useContext(VariantManagementContext)
  if (!context) {
    throw new Error(
      "useVariantManagement must be used within a VariantManagementProvider",
    )
  }
  return context
}

const sortByMapping: Record<
  string,
  StaffListProductVariantRequest_SortCriterion_SortBy
> = {
  // createdAt: StaffListProductVariantRequest_SortCriterion_SortBy.CREATED_AT, // Not supported
  updatedAt: StaffListProductVariantRequest_SortCriterion_SortBy.UPDATED_AT,
}

const sortDirectionMapping: Record<
  string,
  StaffListProductVariantRequest_SortCriterion_SortDirection
> = {
  asc: StaffListProductVariantRequest_SortCriterion_SortDirection.ASC,
  desc: StaffListProductVariantRequest_SortCriterion_SortDirection.DESC,
}
