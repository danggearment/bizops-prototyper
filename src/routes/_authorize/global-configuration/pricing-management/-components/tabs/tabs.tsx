import { TeamPriceCustomRuleStatusLabel } from "@/constants/product-tier"
import { useQueryPod } from "@/services/connect-rpc/transport"
import { GMTeamPriceCustomStatus } from "@/services/connect-rpc/types"
import { formatDateForCallApi } from "@/utils"
import { staffCountPriceCustomRuleStatus } from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@gearment/ui3"
import { useSearch } from "@tanstack/react-router"
import { PricingRuleTabs } from "../../-helper"
import { usePricingRule } from "../../-pricing-rule-context"

interface Props {
  children: React.ReactNode
}
export default function PriceCustomTabs({ children }: Props) {
  const search = useSearch({
    from: "/_authorize/global-configuration/pricing-management/",
  })

  const { handleSetFilter } = usePricingRule()

  const { data: dataCount } = useQueryPod(staffCountPriceCustomRuleStatus, {
    filter: {
      from: search.from ? formatDateForCallApi(search.from) : undefined,
      to: search.to ? formatDateForCallApi(search.to) : undefined,
      createdByIds: search.createdByIds,
      teamIds: search.teamIds,
    },
  })

  const mapStatusToCount = () => {
    const data = dataCount?.data ?? []
    const result: Record<GMTeamPriceCustomStatus, number> = {
      [GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_UNSPECIFIED]: Number(
        dataCount?.totalCount ?? 0,
      ),
      [GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_ACTIVE]: 0,
      [GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_INACTIVE]: 0,
      [GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_DELETED]: 0,
      [GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_PENDING]: 0,
      [GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_EXPIRED]: 0,
    }

    if (data?.length) {
      for (const item of data) {
        result[item.status] = Number(item.count) || 0
      }
    }

    return result
  }

  const handleSelectTab = (statusValue: string) => {
    const status = Number(statusValue) as GMTeamPriceCustomStatus
    handleSetFilter({
      ...search,
      status: status,
    })
  }

  return (
    <Tabs value={search.status.toString()} onValueChange={handleSelectTab}>
      <TabsList className="bg-sidebar">
        {PricingRuleTabs.map((tab) => (
          <TabsTrigger
            key={tab.key}
            value={tab.value.toString()}
            className="w-[100px]"
          >
            {TeamPriceCustomRuleStatusLabel[tab.value]} (
            {mapStatusToCount()[tab.key]})
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent
        value={
          search.status.toString() ||
          GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_UNSPECIFIED.toString()
        }
      >
        {children}
      </TabsContent>
    </Tabs>
  )
}
