import { DateTime } from "@/components/common/date-time"
import {
  CreditStatementPaymentStatusColorsMapping,
  mappingColor,
} from "@/constants/map-color"
import {
  COMMON_FORMAT_DATETIME_CREDIT,
  StatementPaymentLabel,
} from "@/constants/payment"
import { CreditStatementPaymentStatus } from "@/services/connect-rpc/types"
import {
  ModalPaymentStatement,
  usePaymentStatementModal,
} from "@/services/modals/modal-payment-statement"
import { formatDateString, formatPrice } from "@/utils"
import { StaffGetTeamTransactionDetailResponse_TransactionDetailCommon } from "@gearment/nextapi/api/payment/v1/payment_admin_pb"
import { Badge, Button, ButtonIconCopy, Card, CardContent } from "@gearment/ui3"
import { ChevronRight, CreditCard, Receipt, TrendingUp } from "lucide-react"

export default function SettlementReceipt({
  data,
}: {
  data: StaffGetTeamTransactionDetailResponse_TransactionDetailCommon
}) {
  const { setOpen: openPaymentStatementModal } = usePaymentStatementModal()

  const handleApprovePayment = (statementId: string) => {
    openPaymentStatementModal({
      onConfirm: () => {},
      statementId: statementId,
      viewOnly: true,
    })
  }

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
                Billing cycle
              </p>
              <p className="text-sm">
                {data.settlement?.statementStartDate &&
                data.settlement?.statementEndDate ? (
                  <>
                    {formatDateString(
                      data.settlement?.statementStartDate.toDate(),
                      COMMON_FORMAT_DATETIME_CREDIT,
                    )}{" "}
                    -{" "}
                    {formatDateString(
                      data.settlement?.statementEndDate?.toDate(),
                      COMMON_FORMAT_DATETIME_CREDIT,
                    )}
                  </>
                ) : (
                  "--"
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
              <p className="text-sm text-muted-foreground mb-1">Total amount</p>
              <p className="font-medium">
                {data.settlement?.totalAmount ? (
                  <Badge variant="default">
                    {formatPrice(data.settlement?.totalAmount)}
                  </Badge>
                ) : (
                  "--"
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Total paid before
              </p>
              <p className="font-medium">
                {data.settlement?.totalPaidBefore ? (
                  <Badge variant="error">
                    {formatPrice(data.settlement?.totalPaidBefore)}
                  </Badge>
                ) : (
                  "--"
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Paid amount</p>
              <p className="font-medium">
                {data.settlement?.paidAmount ? (
                  <Badge variant="error">
                    {formatPrice(data.settlement?.paidAmount)}
                  </Badge>
                ) : (
                  "--"
                )}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Outstanding amount
              </p>
              <p className="font-medium">
                {data.settlement?.outstandingAmount ? (
                  <Badge variant="default">
                    {formatPrice(data.settlement?.outstandingAmount)}
                  </Badge>
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
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <Badge
                className="text-base"
                variant={mappingColor(
                  CreditStatementPaymentStatusColorsMapping,
                  data?.settlement?.paymentStatus,
                )}
              >
                {
                  StatementPaymentLabel[
                    data?.settlement?.paymentStatus ||
                      CreditStatementPaymentStatus.UNSPECIFIED
                  ]
                }
              </Badge>
            </div>
            <div className="space-y-4">
              {data?.settlement?.statementId ? (
                <Button
                  onClick={() =>
                    handleApprovePayment(data?.settlement?.statementId || "")
                  }
                  variant={"outline"}
                  className="cursor-pointer"
                >
                  View billing <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <p className="text-sm font-medium">--</p>
              )}
            </div>
          </div>
        </CardContent>
      </div>
      <ModalPaymentStatement />
    </Card>
  )
}
