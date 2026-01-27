import { StaffGetInvoice_InvoiceDetail } from "@gearment/nextapi/api/payment/v1/payment_admin_pb"
import { formatPrice } from "@/utils"
import RowItem from "./row-item"

interface Props {
  data?: StaffGetInvoice_InvoiceDetail
}

export default function PaymentDetails({ data }: Props) {
  if (!data) {
    return null
  }

  return (
    <div className="p-4 h-full">
      <h2 className="text-xl font-semibold mb-4">Payment details</h2>

      <RowItem label="Transaction ID" value={data.txnId} />
      <RowItem label="Subtotal" value={formatPrice(data.subtotal)} />
      <RowItem label="Shipping fee" value={formatPrice(data.shippingFee)} />
      <RowItem label="Handle fee" value={formatPrice(data.handleFee)} />
      <RowItem
        label="Gift message fee"
        value={formatPrice(data.giftMessageFee)}
      />
      <RowItem label="Tax" value={formatPrice(data.tax)} />
      <RowItem label="Total due" value={formatPrice(data.total)} />
    </div>
  )
}
