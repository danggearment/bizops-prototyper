import { DateTime } from "@/components/common/date-time"
import { formatPrice } from "@/utils"
import { StaffGetTeamTransactionDetailResponse_TransactionDetailCommon } from "@gearment/nextapi/api/payment/v1/payment_admin_pb"
import { Badge, ButtonIconCopy, Card, CardContent } from "@gearment/ui3"
import { Link } from "@tanstack/react-router"
import { ChevronRight, CreditCard, Receipt, TrendingUp } from "lucide-react"

export default function DepositReceipt({
  data,
}: {
  data: StaffGetTeamTransactionDetailResponse_TransactionDetailCommon
}) {
  return (
    <Card className="p-0 shadow-none border rounded-lg">
      <div className="grid grid-cols-3">
        <CardContent className="py-6 px-6">
          <div className="flex items-center gap-2 mb-4">
            <Receipt />
            <h2 className="text-base font-semibold">
              Transaction Identification
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Team information
              </p>
              <ul>
                <li>
                  <p className="text-sm">{data.teamName || "--"}</p>
                </li>
                <li>
                  <p className="text-sm font-medium text-muted-foreground">
                    {data.teamId || "--"}
                  </p>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Transaction ID
              </p>
              <p className="flex gap-1 items-center">
                <span>{data.txnId || "--"}</span>
                {data.txnId && (
                  <ButtonIconCopy size="sm" copyValue={data.txnId || ""} />
                )}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Email address
              </p>
              <p className="text-sm">{data.email || "--"}</p>
            </div>
          </div>
        </CardContent>

        {/* Payment Information */}
        <CardContent className="py-6 px-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard />
            <h2 className="text-base font-semibold">Payment Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Amount</p>
              <p className="font-medium">
                {data.amount ? (
                  <Badge variant="error">{formatPrice(data.amount)}</Badge>
                ) : (
                  "--"
                )}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Payment method
              </p>
              <div className="flex items-center">
                {data.methodIconUrls && (
                  <img
                    src={data.methodIconUrls}
                    alt="Payment method"
                    className="h-6 mr-2"
                  />
                )}
              </div>
            </div>
          </div>
        </CardContent>

        <CardContent className="py-6 px-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp />
            <h2 className="text-base font-semibold">Transaction Status</h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Created date</p>
              <p className="text-sm font-medium">
                {data.createdAt ? (
                  <DateTime date={data.createdAt.toDate()} />
                ) : (
                  "--"
                )}
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-1">Invoice</p>
              {data.txnId ? (
                <Link
                  to="/finance/transactions/$transactionId/invoice"
                  params={{
                    transactionId: data.txnId,
                  }}
                  className="w-full text-primary text-sm flex items-center gap-1"
                >
                  View detail <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <p className="text-sm font-medium">--</p>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
