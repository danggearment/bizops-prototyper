import { TransactionTypeLabel } from "@/constants/payment"
import { useQueryFinance } from "@/services/connect-rpc/transport"
import { staffGetTeamTransactionDetail } from "@gearment/nextapi/api/payment/v1/payment_admin-PaymentAdminAPI_connectquery"
import { Badge, Button, LoadingCircle } from "@gearment/ui3"
import { createFileRoute, Link, useRouterState } from "@tanstack/react-router"
import { ArrowLeftIcon } from "lucide-react"
import OrderTable from "./-component/order-table"
import TransactionDetail from "./-component/transaction-detail"

export const Route = createFileRoute(
  "/_authorize/finance/transactions/$transactionId/",
)({
  beforeLoad: () => ({
    breadcrumb: [
      {
        link: "/transactions",
        name: "Transactions",
        search: undefined,
      },
      {
        link: "#",
        name: "Transaction detail",
        search: undefined,
      },
    ],
  }),

  component: Index,
})

function Index() {
  const state = useRouterState({
    select: (state) => state.location.state,
  })
  const { transactionId } = Route.useParams()

  const { data, isPending } = useQueryFinance(
    staffGetTeamTransactionDetail,
    { txnId: transactionId },
    { select: (data) => data },
  )

  return (
    <div className={"pb-8"}>
      <div className="mb-4">
        <Link
          to={state.href || "/finance/transactions"}
          className={"flex items-center gap-2  hover:text-secondary-foreground"}
        >
          <Button variant="outline" size="icon">
            <ArrowLeftIcon size={20} />
          </Button>
          <span>Back to list</span>
        </Link>
      </div>

      <div className="flex flex-col mb-4 gap-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Transactions details
          <Badge variant="outline">
            {data?.txnDetail?.txnType !== undefined
              ? TransactionTypeLabel[data.txnDetail.txnType]
              : "--"}
          </Badge>
        </h1>
      </div>

      {isPending && (
        <div className="flex justify-center items-center h-full">
          <LoadingCircle />
        </div>
      )}

      <div className="flex flex-col gap-4">
        {data && (
          <>
            <TransactionDetail data={data.txnDetail} />
            <OrderTable data={data} />
          </>
        )}
      </div>
    </div>
  )
}
