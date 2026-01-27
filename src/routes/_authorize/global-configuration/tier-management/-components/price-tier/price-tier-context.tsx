import { useQueryPod } from "@/services/connect-rpc/transport"
import {
  ProductPriceTierAdmin,
  ProductPriceTierAdmin_SortCriterion_SortBy,
  ProductPriceTierAdmin_SortCriterion_SortDirection,
  StaffCountTeamPriceTierResponse_TeamPriceTierCount,
  StaffListProductPriceTierKeyResponse_Key,
} from "@/services/connect-rpc/types"
import {
  staffCountTeamPriceTier,
  staffListProductPriceTier,
  staffListProductPriceTierKey,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { useSearch } from "@tanstack/react-router"
import { createContext, useContext } from "react"

interface PriceTierContextType {
  tierPrices: ProductPriceTierAdmin[]
  rowCount: number
  pageCount: number
  isLoading: boolean
  priceTierKeys: StaffListProductPriceTierKeyResponse_Key[]
  isLoadingKey: boolean
  countTeamPriceTier: StaffCountTeamPriceTierResponse_TeamPriceTierCount[]
}

const PriceTierContext = createContext<PriceTierContextType>({
  tierPrices: [],
  rowCount: 0,
  pageCount: 0,
  isLoading: false,
  priceTierKeys: [],
  isLoadingKey: false,
  countTeamPriceTier: [],
})

export function PriceTierProvider({ children }: { children: React.ReactNode }) {
  const search = useSearch({
    from: "/_authorize/global-configuration/tier-management/",
  })

  const { data: tierPrices, isLoading } = useQueryPod(
    staffListProductPriceTier,
    {
      paging: {
        page: search.page,
        limit: search.limit,
      },
      search: {
        searchTokens: search.search || undefined,
      },
      sortCriterion: [
        {
          sortBy:
            ProductPriceTierAdmin_SortCriterion_SortBy.PRODUCT_TYPE_APPAREL,
          sortDirection: ProductPriceTierAdmin_SortCriterion_SortDirection.DESC,
        },
      ],
    },
  )
  const { data: priceTierKeys = [], isLoading: isLoadingKey } = useQueryPod(
    staffListProductPriceTierKey,
    {},
    {
      select: (data) => data.keys,
    },
  )

  const { data: countTeamPriceTier = [] } = useQueryPod(
    staffCountTeamPriceTier,
    {},
    {
      select: (data) => data.data,
    },
  )

  return (
    <PriceTierContext.Provider
      value={{
        tierPrices: tierPrices?.data || [],
        rowCount: Number(tierPrices?.paging?.total) || 0,
        pageCount: Number(tierPrices?.paging?.totalPage) || 0,
        isLoading: isLoading,
        priceTierKeys: priceTierKeys,
        isLoadingKey: isLoadingKey,
        countTeamPriceTier: countTeamPriceTier,
      }}
    >
      {children}
    </PriceTierContext.Provider>
  )
}

export function usePriceTier() {
  const context = useContext(PriceTierContext)
  if (!context) {
    throw new Error("usePriceTier must be used within a PriceTierProvider")
  }
  return context
}
