import { TeamTransactionType } from "@/services/connect-rpc/types"
import { StaffGetInvoice_InvoiceDetail } from "@gearment/nextapi/api/payment/v1/payment_admin_pb"
import PaymentDetails from "./payment-detail"
import RefundDetails from "./refund-detail"

interface Props {
  data?: StaffGetInvoice_InvoiceDetail
}

export default function InvoiceDetails({ data }: Props) {
  if (!data) {
    return null
  }

  switch (data.txnType) {
    case TeamTransactionType.PAYMENT:
      return <PaymentDetails data={data} />
    case TeamTransactionType.REFUND:
      return <RefundDetails data={data} />
    default:
      return <PaymentDetails data={data} />
  }
}
