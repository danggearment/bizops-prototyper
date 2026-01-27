import { StatementPaymentRequestStatusLabel } from "@/constants/payment"
import { useQueryFinance } from "@/services/connect-rpc/transport"
import { CreditStatementPaymentRequestStatus } from "@/services/connect-rpc/types"
import { formatDateForCallApi } from "@/utils"
import { staffCountStatementPaymentRequestStatus } from "@gearment/nextapi/api/credit/v1/credit_admin-CreditAdminAPI_connectquery"
import { BizIcons } from "@gearment/ui3"
import { useSearch } from "@tanstack/react-router"
import { CircleCheckBig, CircleX, Clock4 } from "lucide-react"
import { useMemo } from "react"

export default function useTabs() {
  const search = useSearch({
    from: "/_authorize/finance/payment-request/",
  })

  const { data: paymentRequestsCount } = useQueryFinance(
    staffCountStatementPaymentRequestStatus,
    {
      filter: {
        resolverIds: search.resolverIds,
        teamIds: search.teamIds,
        requestedFrom: search.from
          ? formatDateForCallApi(search.from)
          : undefined,
        requestedTo: search.to
          ? formatDateForCallApi(search.to, "endOfDay")
          : undefined,
      },
      search: {
        searchTokens: search.searchTokens,
      },
    },
  )

  const paymentRequestsCountMap = useMemo<
    Partial<Record<CreditStatementPaymentRequestStatus, number>>
  >(() => {
    const baseMap =
      paymentRequestsCount?.data.reduce(
        (acc, item) => {
          acc[item.status] = Number(item.count)
          return acc
        },
        {} as Partial<Record<CreditStatementPaymentRequestStatus, number>>,
      ) ?? {}

    return {
      ...baseMap,
      [CreditStatementPaymentRequestStatus.UNKNOWN]: Number(
        paymentRequestsCount?.totalCount || 0,
      ),
    }
  }, [paymentRequestsCount])

  const tabs = [
    {
      key: CreditStatementPaymentRequestStatus.UNKNOWN,
      text: StatementPaymentRequestStatusLabel[
        CreditStatementPaymentRequestStatus.UNKNOWN
      ],
      icon: (isActive: boolean) => <BizIcons.All solid={isActive} />,
      count:
        paymentRequestsCountMap[CreditStatementPaymentRequestStatus.UNKNOWN],
    },
    {
      key: CreditStatementPaymentRequestStatus.REQUESTED,
      text: StatementPaymentRequestStatusLabel[
        CreditStatementPaymentRequestStatus.REQUESTED
      ],
      icon: (isActive: boolean) => (
        <Clock4 className={`${isActive && "text-primary"}`} />
      ),
      count:
        paymentRequestsCountMap[CreditStatementPaymentRequestStatus.REQUESTED],
    },
    {
      key: CreditStatementPaymentRequestStatus.APPROVED,
      text: StatementPaymentRequestStatusLabel[
        CreditStatementPaymentRequestStatus.APPROVED
      ],
      icon: (isActive: boolean) => (
        <CircleCheckBig className={`${isActive && "text-primary"}`} />
      ),
      count:
        paymentRequestsCountMap[CreditStatementPaymentRequestStatus.APPROVED],
    },
    {
      key: CreditStatementPaymentRequestStatus.REJECTED,
      text: StatementPaymentRequestStatusLabel[
        CreditStatementPaymentRequestStatus.REJECTED
      ],
      icon: (isActive: boolean) => (
        <CircleX className={`${isActive && "text-primary"}`} />
      ),
      count:
        paymentRequestsCountMap[CreditStatementPaymentRequestStatus.REJECTED],
    },
  ]

  return tabs
}
