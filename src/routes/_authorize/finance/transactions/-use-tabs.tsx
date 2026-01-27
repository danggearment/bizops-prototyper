import { AllTransactionType, TransactionTypeLabel } from "@/constants/payment"
import { TeamTransactionType } from "@/services/connect-rpc/types"
import { BizIcons } from "@gearment/ui3"
import { HandCoins } from "lucide-react"
import { useMemo } from "react"
import { useAllTransaction } from "./-all-transactions-context.tsx"

export default function useTabs() {
  const { countTransactionType } = useAllTransaction()
  const countMap = useMemo(() => {
    const result: Record<TeamTransactionType, number> = {
      [TeamTransactionType.ALL]: 0,
      [TeamTransactionType.DEPOSIT]: 0,
      [TeamTransactionType.PAYMENT]: 0,
      [TeamTransactionType.REFUND]: 0,
      [TeamTransactionType.TRANSFER]: 0,
      [TeamTransactionType.UNSPECIFIED]: 0,
      [TeamTransactionType.ADJUST]: 0,
      [TeamTransactionType.SETTLEMENT]: 0,
      [TeamTransactionType.CASHBACK]: 0,
    }

    countTransactionType.forEach((item) => {
      result[item.type] = Number(item.count)
    })

    return result
  }, [countTransactionType])

  const tabs = [
    {
      key: AllTransactionType.ALL,
      text: "All",
      icon: (isActive: boolean) => <BizIcons.All solid={isActive} />,
      count: countMap[TeamTransactionType.ALL],
    },
    {
      key: AllTransactionType.DEPOSIT,
      text: TransactionTypeLabel[AllTransactionType.DEPOSIT],
      icon: (isActive: boolean) => <BizIcons.Deposit solid={isActive} />,
      count: countMap[TeamTransactionType.DEPOSIT],
    },
    {
      key: AllTransactionType.PAYMENT,
      text: TransactionTypeLabel[AllTransactionType.PAYMENT],
      icon: (isActive: boolean) => <BizIcons.Payment solid={isActive} />,
      count: countMap[TeamTransactionType.PAYMENT],
    },
    {
      key: AllTransactionType.REFUND,
      text: TransactionTypeLabel[AllTransactionType.REFUND],
      icon: (isActive: boolean) => <BizIcons.Refund solid={isActive} />,
      count: countMap[TeamTransactionType.REFUND],
    },
    {
      key: AllTransactionType.SETTLEMENT,
      text: TransactionTypeLabel[AllTransactionType.SETTLEMENT],
      icon: (isActive: boolean) => (
        <HandCoins className={`${isActive && "text-primary"}`} />
      ),
      count: countMap[TeamTransactionType.SETTLEMENT],
    },
  ]

  return tabs
}
