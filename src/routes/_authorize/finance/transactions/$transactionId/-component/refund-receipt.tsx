import { DateTime } from "@/components/common/date-time"
import { AllRefundRequestTypeLabel } from "@/constants/order"
import { formatPrice } from "@/utils"
import { StaffGetTeamTransactionDetailResponse_TransactionDetailCommon } from "@gearment/nextapi/api/payment/v1/payment_admin_pb"
import { Badge, ButtonIconCopy, Card, CardContent } from "@gearment/ui3"
import { Link } from "@tanstack/react-router"
import {
  ArrowBigRight,
  ChevronRight,
  CreditCard,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react"

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
              <p className="text-sm text-muted-foreground mb-1">Reference ID</p>
              <p className="flex gap-1 items-center">
                <span>{data.refId || "--"}</span>
                {data.refId && (
                  <ButtonIconCopy size="sm" copyValue={data.refId || ""} />
                )}
              </p>
            </div>
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
                  <Badge variant="success">{formatPrice(data.amount)}</Badge>
                ) : (
                  "--"
                )}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground mb-1">
                  Balance before
                </p>
                <div className="text-sm font-medium">
                  {data.balanceBefore ? formatPrice(data.balanceBefore) : "--"}
                </div>
              </div>

              <ArrowBigRight className="text-primary" />

              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground mb-1">
                  Balance after
                </p>
                <span className="text-sm font-medium">
                  {data.balanceAfter ? formatPrice(data.balanceAfter) : "--"}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Refund type</p>
              <ul className="flex flex-wrap flex-col gap-2">
                {data.refund?.refundRequestType.map((refundType) => (
                  <li key={refundType}>
                    <Badge variant="outline">
                      {AllRefundRequestTypeLabel[refundType]}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Refund reason
              </p>
              <p className="text-sm font-medium">
                {data.refund?.refundReason || "--"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Destination account
              </p>
              <div className="flex items-center">
                {data.refund?.refundDestination ? (
                  <img
                    src={data.refund.refundDestination}
                    alt="Destination account"
                    className="h-6 mr-2"
                  />
                ) : (
                  <Wallet className="h-6 w-6 mr-2 text-blue-600" />
                )}
              </div>
            </div>
          </div>
        </CardContent>

        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp />
            <h2 className="text-base font-semibold">Transaction Status</h2>
          </div>

          <div className="space-y-4">
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
        </CardContent>
      </div>
    </Card>
  )
}
