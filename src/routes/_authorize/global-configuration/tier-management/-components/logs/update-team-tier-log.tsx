import { UpdateTeamTierLogsSearchType } from "@/schemas/schemas/global-configuration"
import { useQueryAudit, useQueryPod } from "@/services/connect-rpc/transport"
import { formatDateForCallApi } from "@/utils/format-date.ts"
import { staffListTeamPriceTierActivity } from "@gearment/nextapi/api/audit/v1/activity-ActivityAPI_connectquery"
import { staffListProductPriceTierKey } from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { useMemo } from "react"
import { Filter } from "./filter/filter"
import { UpdateTeamTierLogTable } from "./table/table"

export function UpdateTeamTierLog() {
  const navigate = useNavigate()
  const search = useSearch({
    from: "/_authorize/global-configuration/tier-management/tier-update-logs",
  })

  const { data: priceKeys } = useQueryPod(staffListProductPriceTierKey, {})

  const { data, isLoading } = useQueryAudit(staffListTeamPriceTierActivity, {
    paging: {
      limit: search.limit,
      page: search.page,
    },
    filter: {
      teamIds: search.teamIds,
      staffIds: search.staffIds,
      newTierIds: search.newTierIds,
      actions: search.actions,
      createdAtFrom: search.from
        ? formatDateForCallApi(search.from)
        : undefined,
      createdAtTo: search.to
        ? formatDateForCallApi(search.to, "endOfDay")
        : undefined,
    },
  })

  const handleSetNewSearch = (newSearch: UpdateTeamTierLogsSearchType) => {
    navigate({
      to: "/global-configuration/tier-management/tier-update-logs",
      search: {
        ...newSearch,
      },
      replace: true,
    })
  }

  const priceKeyOptions = useMemo(() => {
    return (
      priceKeys?.keys?.map((key) => ({
        label: key.tierName,
        value: key.tierId,
      })) || []
    )
  }, [priceKeys?.keys])

  return (
    <div>
      <Filter
        handleSetNewSearch={handleSetNewSearch}
        search={search}
        priceKeyOptions={priceKeyOptions}
      />
      <UpdateTeamTierLogTable
        data={data}
        isLoading={isLoading}
        priceKeys={priceKeys?.keys}
        handleSetNewSearch={handleSetNewSearch}
        search={search}
      />
    </div>
  )
}
