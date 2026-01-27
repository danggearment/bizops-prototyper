import {
  GMTeamPriceCustomStatus,
  TeamPriceTierAction,
} from "@/services/connect-rpc/types"
import { Option } from "@gearment/ui3"

export enum UpdateTeamTierStep {
  SelectTeam = "selectTeam",
  UpdateTier = "updateTier",
}

export const AllTeamPriceTierActionLabel = Object.freeze({
  [TeamPriceTierAction.DOWNGRADED]: "Downgraded",
  [TeamPriceTierAction.UPGRADED]: "Upgraded",
  [TeamPriceTierAction.UNSPECIFIED]: "Unknown",
})

export const TeamPriceTierActionOptions: Option[] = [
  {
    label:
      AllTeamPriceTierActionLabel[TeamPriceTierAction.DOWNGRADED].toString(),
    value: TeamPriceTierAction.DOWNGRADED.toString(),
  },
  {
    label: AllTeamPriceTierActionLabel[TeamPriceTierAction.UPGRADED].toString(),
    value: TeamPriceTierAction.UPGRADED.toString(),
  },
]

export const TeamPriceCustomRuleStatusLabel = Object.freeze({
  [GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_UNSPECIFIED]: "All",
  [GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_ACTIVE]: "Active",
  [GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_INACTIVE]: "Inactive",
  [GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_EXPIRED]: "Expired",
  [GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_DELETED]: "Deleted",
  [GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_PENDING]: "Upcoming",
})
