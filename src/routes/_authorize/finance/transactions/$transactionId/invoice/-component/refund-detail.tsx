import { AllRefundRequestTypeLabel } from "@/constants/order"
import { formatPrice } from "@/utils"
import { StaffGetInvoice_InvoiceDetail } from "@gearment/nextapi/api/payment/v1/payment_admin_pb"
import RowItem from "./row-item"

interface Props {
  data?: StaffGetInvoice_InvoiceDetail
}

export default function RefundDetails({ data }: Props) {
  if (!data) {
    return null
  }

  return (
    <div className=" bg-white rounded-md p-4 h-full">
      <h2 className="text-xl font-semibold mb-4">Payment details</h2>

      <RowItem label="Transaction ID" value={data.txnId} />
      <RowItem label="Refund amount" value={formatPrice(data.refundAmount)} />
      <RowItem
        label="Refund type"
        value={data.refundRequestType.map((refundType, index) => (
          <span key={index}>
            {AllRefundRequestTypeLabel[refundType]}
            {index < data.refundRequestType.length - 1 ? ", " : ""}
          </span>
        ))}
      />
    </div>
  )
}
