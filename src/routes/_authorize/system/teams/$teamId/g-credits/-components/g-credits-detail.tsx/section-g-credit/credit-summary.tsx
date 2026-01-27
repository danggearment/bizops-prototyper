import { COMMON_FORMAT_DATETIME_CREDIT } from "@/constants/payment"
import { Credit, Credit_BillingCycle } from "@/services/connect-rpc/types"
import { formatPrice } from "@/utils/format-currency"
import { formatDateString } from "@/utils/format-date"
import {
  Badge,
  Progress,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { HandCoins } from "lucide-react"

interface Props {
  credit?: Credit
  currentBillingCycle?: Credit_BillingCycle
}

export default function CreditSummary({ credit, currentBillingCycle }: Props) {
  return (
    <div className="border p-4 rounded-lg space-y-4 bg-secondary/10">
      <div className="flex items-center gap-2">
        <HandCoins className="w-4 h-4" />
        <span className="font-bold text-lg">
          Credit Usage For Current Billing Cycle
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-muted-foreground text-sm">Billing period</div>
          <div>
            {currentBillingCycle?.statementStartDate &&
              currentBillingCycle?.statementEndDate && (
                <span className="font-medium text-base">
                  {formatDateString(
                    currentBillingCycle?.statementStartDate.toDate(),
                    COMMON_FORMAT_DATETIME_CREDIT,
                  )}{" "}
                  -{" "}
                  {formatDateString(
                    currentBillingCycle?.statementEndDate.toDate(),
                    COMMON_FORMAT_DATETIME_CREDIT,
                  )}
                </span>
              )}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground text-sm">
            G-Credit used (this cycle)
          </div>
          <div>
            <Badge className="text-base" variant={"error"}>
              {formatPrice(credit?.usedAmount)}
            </Badge>
          </div>
        </div>
        <div>
          <div className="text-muted-foreground text-sm">
            Remaining limit (this cycle)
          </div>
          <div>
            <Badge className="text-base" variant={"success"}>
              {formatPrice(credit?.availableAmount)}
            </Badge>
          </div>
        </div>
        <div>
          <div className="text-muted-foreground text-sm">
            Utilization (this cycle)
          </div>
          <div>
            <span className="font-medium text-base">
              {credit?.creditUtilizationPercent}%
            </span>
          </div>
        </div>
      </div>
      <div>
        <div className="text-muted-foreground text-sm mb-2">
          Utilization bar
        </div>
        <div className="relative">
          <Progress value={Number(credit?.creditUtilizationPercent)} />
          <span className="absolute -top-5 right-0">
            {credit?.creditUtilizationPercent}%
          </span>
          {credit?.isNotifyThresholdExceeded && (
            <Tooltip>
              <TooltipTrigger
                style={{ left: `${credit?.notificationThresholdPercent}%` }}
                className="absolute top-0 bottom-0 w-1 bg-red-500"
              >
                <TooltipContent>
                  Alert threshold:{" "}
                  <strong>{credit?.notificationThresholdPercent}%</strong>
                  <br />
                  Email notifications will be sent when usage reaches or exceeds
                  this threshold.
                </TooltipContent>
              </TooltipTrigger>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  )
}
