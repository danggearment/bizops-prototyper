import { TeamTransactionType } from "@/services/connect-rpc/types"
import { StaffGetTeamTransactionDetailResponse_TransactionDetailCommon } from "@gearment/nextapi/api/payment/v1/payment_admin_pb"
import DepositReceipt from "./deposit-receipt"
import PaymentReceipt from "./payment-receipt"
import RefundReceipt from "./refund-receipt"
import SettlementReceipt from "./settlement-receipt"

interface Props {
  data?: StaffGetTeamTransactionDetailResponse_TransactionDetailCommon
}

export default function TransactionDetails({ data }: Props) {
  if (!data) {
    return null
  }

  switch (data.txnType) {
    case TeamTransactionType.DEPOSIT:
      return <DepositReceipt data={data} />
    case TeamTransactionType.PAYMENT:
      return <PaymentReceipt data={data} />
    case TeamTransactionType.REFUND:
      return <RefundReceipt data={data} />
    case TeamTransactionType.SETTLEMENT:
      return <SettlementReceipt data={data} />
  }
}
