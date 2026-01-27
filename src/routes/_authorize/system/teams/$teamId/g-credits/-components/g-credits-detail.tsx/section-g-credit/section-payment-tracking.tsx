import { DateTime } from "@/components/common/date-time"
import { Alert, AlertDescription, Badge } from "@gearment/ui3"
import { formatCurrency } from "@gearment/utils"
import { Calendar, CalendarCheck2 } from "lucide-react"

export default function SectionPaymentTracking() {
  return (
    <div className="border p-4 rounded-lg space-y-4 bg-secondary/10">
      <div className="flex items-center gap-2">
        <CalendarCheck2 className="w-4 h-4" />
        <span className="text-lg font-bold">Payment tracking</span>
      </div>

      <ul className="space-y-2">
        <li className="flex items-center justify-between gap-2 ">
          <div>Last statement amount</div>
          <div className="text-right">
            <div className="font-semibold">
              {formatCurrency(15, {
                currency: "USD",
              })}
            </div>
          </div>
        </li>
        <li className="flex items-center justify-between gap-2 ">
          <div>
            <div>Last payment received</div>
          </div>
          <div className="text-right">
            <div className="font-semibold">
              {formatCurrency(15, {
                currency: "USD",
              })}
            </div>
            <div className="text-sm text-muted-foreground">
              <DateTime date={new Date()} />
            </div>
          </div>
        </li>
        <li className="flex items-center justify-between gap-2 ">
          <div>
            <div>Cutstanding amount</div>
          </div>
          <div className="font-semibold text-right">
            {formatCurrency(15, {
              currency: "USD",
            })}
          </div>
        </li>
        <li className="flex items-center justify-between gap-2 ">
          <div>
            <div>Overdue amount</div>
          </div>
          <Badge variant="success">No</Badge>
        </li>
      </ul>

      <Alert className="bg-green-500/10 border-green-500/10 font-medium text-left">
        <AlertDescription className="text-green-500 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          All payments up to date
        </AlertDescription>
      </Alert>
    </div>
  )
}
