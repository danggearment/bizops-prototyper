import { COMMON_FORMAT_DATETIME_CREDIT } from "@/constants/payment"
import { Credit, Credit_BillingCycle } from "@/services/connect-rpc/types"
import { formatDateString } from "@/utils/format-date"
import { Alert, AlertDescription, cn } from "@gearment/ui3"
import { Calendar, Clock } from "lucide-react"

interface Props {
  credit?: Credit
  currentBillingCycle?: Credit_BillingCycle
}
const Box = ({
  title,
  value,
  className,
}: {
  title: string
  value: string
  className?: string
}) => {
  return (
    <div
      className={cn(
        "bg-background rounded-lg p-4 font-bold text-center",
        className,
      )}
    >
      <div className="space-y-2">
        <div className="font-medium text-muted-foreground">
          <span>{title}</span>
        </div>
        <div className="text-lg">{value}</div>
      </div>
    </div>
  )
}

export default function SectionBillingSummary({
  credit,
  currentBillingCycle,
}: Props) {
  return (
    <div className="border p-4 rounded-lg space-y-4 bg-secondary/10">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        <span className="text-lg font-bold">Billing Summary</span>
      </div>
      <section className="grid grid-cols-3 gap-4">
        <Box
          title="Billing Start Date"
          value={formatDateString(
            currentBillingCycle?.statementStartDate?.toDate() || "",
            COMMON_FORMAT_DATETIME_CREDIT,
          )}
          className="bg-blue-50"
        />

        <Box
          title="Statement Date"
          value={formatDateString(
            currentBillingCycle?.statementEndDate?.toDate() || "",
            COMMON_FORMAT_DATETIME_CREDIT,
          )}
          className="bg-orange-50"
        />
        <Box
          title="Due Date"
          value={formatDateString(
            currentBillingCycle?.dueDate?.toDate() || "",
            COMMON_FORMAT_DATETIME_CREDIT,
          )}
          className="bg-red-50"
        />
      </section>
      <Alert className="bg-primary/10 border-primary/10 font-medium text-left text-primary/80">
        <AlertDescription className="text-primary/100 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <p className="font-bold">
            {credit?.daysUntilNextStatement} day(s) until next statement
          </p>
        </AlertDescription>
      </Alert>
    </div>
  )
}
