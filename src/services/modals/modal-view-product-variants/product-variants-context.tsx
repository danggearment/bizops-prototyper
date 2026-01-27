import { ProductStockStatus } from "@/constants/product"
import {
  ProductVariantsSearchSchema,
  ProductVariantsSearchType,
} from "@/schemas/schemas/product"
import { useQueryPod } from "@/services/connect-rpc/transport"
import {
  GMProduct_TeamProductDetail_Variant,
  StaffListProductVariantRequest_SortCriterion,
  StaffListProductVariantRequest_SortCriterion_SortBy,
  StaffListProductVariantRequest_SortCriterion_SortDirection,
} from "@/services/connect-rpc/types"
import { staffListProductVariant } from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { createContext, useContext, useState } from "react"
interface ProductVariantsContext {
  variants: GMProduct_TeamProductDetail_Variant[]
  loading: boolean
  search: ProductVariantsSearchType
  handleChangeSearch: (search: ProductVariantsSearchType) => void
  total: number
}

const ProductVariantsContext = createContext<ProductVariantsContext>({
  variants: [],
  loading: false,
  search: ProductVariantsSearchSchema.parse({}),
  handleChangeSearch: () => {},
  total: 0,
})

interface Props {
  children: React.ReactNode
  productId: string
}

export const ProductVariantsProvider = ({ children, productId }: Props) => {
  const [search, setSearch] = useState<ProductVariantsSearchType>(
    ProductVariantsSearchSchema.parse({}),
  )

  const { data, isPending } = useQueryPod(
    staffListProductVariant,
    {
      paging: {
        page: search.page,
        limit: search.limit,
      },
      sortCriterion: (search.sortBy || []).reduce<
        StaffListProductVariantRequest_SortCriterion[]
      >((acc, key, idx) => {
        const mapped = sortByMapping[key]
        if (!mapped) return acc
        acc.push(
          new StaffListProductVariantRequest_SortCriterion({
            sortBy: mapped,
            sortDirection:
              sortDirectionMapping[search.sortDirection?.[idx] ?? "desc"],
          }),
        )
        return acc
      }, []),

      search: {
        search: {
          case: "variantToken",
          value: search.variantSearchText ?? "",
        },
      },
      filter: {
        productIds: [productId],
        statuses: search.statuses,

        minStock:
          search.stockStatus === ProductStockStatus.IN_STOCK ||
          search.stockStatus === ProductStockStatus.LOW_STOCK
            ? BigInt(1)
            : undefined,
        maxStock:
          search.stockStatus === ProductStockStatus.LOW_STOCK
            ? BigInt(10)
            : search.stockStatus === ProductStockStatus.OUT_OF_STOCK
              ? BigInt(0)
              : undefined,
      },
    },
    {
      enabled: !!productId,
    },
  )

  const variants = data?.data ?? []
  const total = Number(data?.paging?.total ?? 0)

  const handleChangeSearch = (
    newSearch: Partial<ProductVariantsSearchType>,
  ) => {
    setSearch((prev) => {
      return {
        ...prev,
        ...newSearch,
      }
    })
  }

  return (
    <ProductVariantsContext.Provider
      value={{
        variants,
        loading: isPending,
        search,
        handleChangeSearch,
        total,
      }}
    >
      {children}
    </ProductVariantsContext.Provider>
  )
}

export const useProductVariants = () => {
  const context = useContext(ProductVariantsContext)
  if (!context) {
    throw new Error("ProductVariantsContext is not created")
  }
  return context
}

const sortByMapping: Record<
  string,
  StaffListProductVariantRequest_SortCriterion_SortBy
> = {
  updatedAt: StaffListProductVariantRequest_SortCriterion_SortBy.UPDATED_AT,
}

const sortDirectionMapping: Record<
  string,
  StaffListProductVariantRequest_SortCriterion_SortDirection
> = {
  asc: StaffListProductVariantRequest_SortCriterion_SortDirection.ASC,
  desc: StaffListProductVariantRequest_SortCriterion_SortDirection.DESC,
}
