import { ButtonIconCopy } from "@gearment/ui3"

export default function PaymentInformation({
  paymentId,
  totalAmount,
}: {
  paymentId: string
  totalAmount: number
}) {
  return (
    <div className="bg-background border rounded-md p-6 space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-2xl">💳</span>
        <h2 className="text-xl font-bold">Manual Payment Instructions</h2>
      </div>

      <p className="text-muted-foreground">
        To complete your order, please make a manual payment using one of the
        following channels:
      </p>

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Payment Channels:</h3>
          <ul className="space-y-1 text-sm">
            <li>• PayPal</li>
            <li>• LianLian</li>
            <li>• Payoneer</li>
            <li>• PingPong</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Recipient Account:</h3>
          <div className="flex bg-muted p-2 rounded justify-between items-center gap-2">
            <p className="text-sm font-mono ">payment@gearment.com</p>
            <ButtonIconCopy
              copyValue={"payment@gearment.com"}
              size={"sm"}
              className="ml-2"
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Transaction Note:</h3>
          <div className="flex bg-muted   p-2 rounded justify-between items-center gap-2">
            <p className="text-sm font-mono ">Invoice #{paymentId}</p>
            <ButtonIconCopy
              copyValue={`  Invoice #${paymentId}`}
              size={"sm"}
              className="ml-2"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            (Please include this exact note to match your payment with the
            order.)
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Amount to Pay:</h3>
          <p className="text-lg font-bold text-primary">{totalAmount} USD</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">📤</span>
          <h3 className="font-semibold">After Payment:</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Send your payment proof (screenshot or receipt) to{" "}
          <span className="font-mono">billing@gearment.com</span>. We'll process
          your order as soon as the payment is verified.
        </p>
      </div>

      <div className="text-xs text-muted-foreground">
        For questions, contact{" "}
        <span className="font-mono">support@gearment.com</span>.
      </div>
    </div>
  )
}
