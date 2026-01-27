import { GMTeamPriceCustomStatus } from "@/services/connect-rpc/types"

export const PricingRuleStatusLabel = Object.freeze({
  [GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_UNSPECIFIED]:
    "Unspecified",
  [GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_ACTIVE]: "Active",
  [GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_INACTIVE]: "Inactive",
  [GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_EXPIRED]: "Inactive", // Expired is the same as inactive
  [GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_DELETED]: "Deleted",
  [GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_PENDING]: "Upcoming",
})
