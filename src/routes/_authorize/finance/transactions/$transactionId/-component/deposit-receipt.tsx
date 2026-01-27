import { DateTime } from "@/components/common/date-time"
import Image from "@/components/common/image/image"
import { useNotificationModal } from "@/services/modals/modal-notification"
import { formatPrice } from "@/utils"
import { StaffGetTeamTransactionDetailResponse_TransactionDetailCommon } from "@gearment/nextapi/api/payment/v1/payment_admin_pb"
import { Badge, Button, ButtonIconCopy, Card, CardContent } from "@gearment/ui3"
import { ArrowBigRight, CreditCard, Receipt, TrendingUp } from "lucide-react"

export default function DepositReceipt({
  data,
}: {
  data: StaffGetTeamTransactionDetailResponse_TransactionDetailCommon
}) {
  const [setOpen, onClose] = useNotificationModal((state) => [
    state.setOpen,
    state.onClose,
  ])

  const handleViewImage = (fileUrls: string[]) => {
    if (!fileUrls || fileUrls.length === 0) return

    setOpen({
      title: "",
      OK: "Close",
      description: (
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          {fileUrls.map((url) => (
            <div key={url} className="mx-auto">
              <Image responsive="h" url={url} />
            </div>
          ))}
        </div>
      ),
      onConfirm: () => {
        onClose()
      },
    })
  }

  return (
    <Card className="p-0 shadow-none border rounded-lg">
      <div className="grid grid-cols-3">
        <CardContent className="py-6 px-6">
          <div className="flex items-center gap-2 mb-5">
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
          <div className="flex items-center gap-2 mb-5">
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
          <div className="flex items-center gap-2 mb-5">
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
              <p className="text-sm text-muted-foreground mb-1">
                Payment receipt
              </p>
              {data.deposit?.fileUrls && data.deposit.fileUrls.length > 0 ? (
                <Button
                  variant="link"
                  onClick={() => handleViewImage(data.deposit?.fileUrls || [])}
                  className="text-primary p-0 px-0 h-auto"
                >
                  <span className="flex items-center gap-1 cursor-pointer">
                    <Receipt className="h-4 w-4" />
                    View Receipt
                  </span>
                </Button>
              ) : (
                <p className="text-sm text-gray-500">No receipt available</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Approval by</p>
              <p className="text-sm font-medium">
                {data.deposit?.resolveByName || "--"}
              </p>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
