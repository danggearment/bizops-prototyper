import {
  COMMON_FORMAT_DATETIME_CREDIT,
  CreditIntervalUnitLabel,
  DueDateOptions,
} from "@/constants/payment"
import {
  Credit,
  Credit_BillingCycle,
  CreditIntervalUnit,
} from "@/services/connect-rpc/types"
import { formatDateString } from "@/utils/format-date"
import { Alert, AlertDescription } from "@gearment/ui3"
import { Calendar, Clock } from "lucide-react"

const formatStatementCycle = (
  offset?: number,
  unit?: CreditIntervalUnit,
): string => {
  if (!offset || !unit) return ""

  const unitLabel = CreditIntervalUnitLabel[unit] || "Day"
  const pluralizedUnit = offset > 1 ? `${unitLabel}s` : unitLabel

  return `${offset} ${pluralizedUnit.toLowerCase()} after activation date`
}

interface Props {
  credit?: Credit
  currentBillingCycle?: Credit_BillingCycle
  nextBillingCycle?: Credit_BillingCycle
}

const findDateOption = (
  options: Array<{ value: string; label: string }>,
  offset: number,
  unit: number,
) => {
  return options.find((option) => {
    const parsed = JSON.parse(option.value)
    return parsed.offset === offset && parsed.unit === unit
  })
}

export default function BillingCycleInformation({
  nextBillingCycle,
  credit,
}: Props) {
  return (
    <div className="border p-4 rounded-lg space-y-4 bg-secondary/10">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        <span className="font-bold text-lg">Billing Cycle Configuration</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-muted-foreground text-sm">Activation date</div>
          {credit?.billingStartDate && (
            <div className="font-medium text-base">
              {formatDateString(
                credit?.billingStartDate.toDate(),
                COMMON_FORMAT_DATETIME_CREDIT,
              )}
            </div>
          )}
        </div>

        <div>
          <div className="text-muted-foreground text-sm">Statement cycle</div>
          <div>
            {formatStatementCycle(
              credit?.statementOffset,
              credit?.statementUnit,
            )}
          </div>
        </div>

        <div>
          <div className="text-muted-foreground text-sm">
            Next statement date
          </div>
          {nextBillingCycle?.statementStartDate && (
            <div>
              {formatDateString(
                nextBillingCycle?.statementStartDate?.toDate(),
                COMMON_FORMAT_DATETIME_CREDIT,
              )}
            </div>
          )}
        </div>

        <div>
          <div className="text-muted-foreground text-sm">Due date</div>
          {
            findDateOption(
              DueDateOptions,
              credit?.dueOffset || 0,
              credit?.dueUnit || 0,
            )?.label
          }
        </div>
      </div>
      <Alert className="bg-primary/10 border-primary/10 font-medium text-left text-primary/80">
        <AlertDescription className="text-primary/100 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <p className="font-bold">
            {credit?.daysUntilNextStatement} days after the billing start date
          </p>
        </AlertDescription>
      </Alert>
    </div>
  )
}
