import {
  mappingColor,
  PricingRuleStatusColorsMapping,
} from "@/constants/map-color"
import { PricingRuleStatusLabel } from "@/constants/pricing"
import {
  GMTeamPriceCustomStatus,
  StaffListPriceCustomRuleResponse_PriceCustomRule,
} from "@/services/connect-rpc/types"
import { Badge } from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"
import { AlarmClockOffIcon } from "lucide-react"

export default function CellStatus(
  props: CellContext<StaffListPriceCustomRuleResponse_PriceCustomRule, unknown>,
) {
  const { status } = props.row.original
  return (
    <div>
      <Badge variant={mappingColor(PricingRuleStatusColorsMapping, status)}>
        {PricingRuleStatusLabel[status]}
      </Badge>
      {status ===
        GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_EXPIRED && (
        <div className="flex items-center gap-1 text-red-500 px-2">
          <AlarmClockOffIcon className="size-3" />
          <span className="text-sm">Expired</span>
        </div>
      )}
    </div>
  )
}
