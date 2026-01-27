import { DateTime } from "@/components/common/date-time"
import {
  mappingColor,
  TeamTransactionTypeColorMapping,
} from "@/constants/map-color"
import {
  AllTransactionType,
  G_CREDIT_METHOD_CODE,
  TRANSACTION_LIMIT_OPTIONS,
} from "@/constants/payment"
import { useQueryFinance } from "@/services/connect-rpc/transport"
import { Credit, Credit_BillingCycle } from "@/services/connect-rpc/types"
import type { TransactionListFilter } from "@/services/modals/modal-transaction-list"
import { useModalTransactionListStore } from "@/services/modals/modal-transaction-list"
import { formatPrice, getPrice } from "@/utils/format-currency"
import { staffListTransaction } from "@gearment/nextapi/api/payment/v1/payment_admin-PaymentAdminAPI_connectquery"
import { Badge, BoxEmpty, Button, Combobox } from "@gearment/ui3"
import { ExternalLinkIcon, TrendingUp } from "lucide-react"
import { useState } from "react"

interface Props {
  credit?: Credit
  billingCycle?: Credit_BillingCycle
}

export default function SectionUsage({ credit, billingCycle }: Props) {
  const { actions } = useModalTransactionListStore()
  const [selectedLimit, setSelectedLimit] = useState("3")

  const handleOpenModal = () => {
    const filter: TransactionListFilter = {
      teamId: credit?.teamId ? [credit.teamId] : [],
      methodCode: [G_CREDIT_METHOD_CODE],
      from: billingCycle?.statementStartDate?.toDate(),
      to: billingCycle?.statementEndDate?.toDate(),
    }

    actions.onOpen(filter)
  }

  const { data: listTransaction } = useQueryFinance(
    staffListTransaction,
    {
      filter: {
        teamId: [credit?.teamId || ""],
        methodCode: [G_CREDIT_METHOD_CODE],
        from: billingCycle?.statementStartDate,
        to: billingCycle?.statementEndDate,
      },
      page: 1,
      limit: parseInt(selectedLimit),
    },
    {
      select: (data) => data?.data,
    },
  )

  return (
    <div className="border p-4 rounded-lg space-y-4 bg-secondary/10">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        <span className="text-lg font-bold">Current usage</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-muted-foreground text-sm">G-Credit Used</div>
          <div className="text-lg font-bold text-red-500">
            {formatPrice(billingCycle?.usedAmount)}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground text-sm">Utilization</div>
          <div className="text-lg font-bold">
            {billingCycle?.creditUtilizationPercent}%
          </div>
        </div>
      </div>
      <div className="w-fit">
        <Combobox
          options={TRANSACTION_LIMIT_OPTIONS}
          onChange={(value) => setSelectedLimit(value)}
          placeholder="Select number of transactions"
          value={selectedLimit}
        />
      </div>
      <ul className="border p-4 rounded-lg space-y-2 min-h-[120px]">
        {listTransaction && listTransaction.length > 0 ? (
          listTransaction.map((txn) => (
            <li
              key={txn.txnId}
              className="flex items-center justify-between gap-2 border-b py-2 last:border-b-0"
            >
              <div>
                <div>{txn.txnId}</div>
                <div className="text-sm text-muted-foreground">
                  <DateTime date={txn.createdAt?.toDate() || new Date()} />
                </div>
              </div>
              <Badge
                variant={mappingColor(
                  TeamTransactionTypeColorMapping,
                  txn.type,
                )}
              >
                {AllTransactionType[txn.type]}
              </Badge>
              <Badge
                className="text-sm "
                variant={getPrice(txn.amount) < 0 ? "error" : "success"}
              >
                {formatPrice(txn.amount)}
              </Badge>
            </li>
          ))
        ) : (
          <BoxEmpty description="No data" />
        )}
      </ul>
      <Button variant={"outline"} className="w-full" onClick={handleOpenModal}>
        <ExternalLinkIcon className="w-4 h-4 text-muted-foreground" />
        View all transactions
      </Button>
    </div>
  )
}
