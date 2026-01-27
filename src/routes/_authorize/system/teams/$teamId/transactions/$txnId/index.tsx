import LayoutTeam from "@/components/layout-team"
import { StaffListTeamTransactionSchema } from "@/schemas/schemas/payment"
import { PageHeader } from "@gearment/ui3"
import { createFileRoute, Link, useParams } from "@tanstack/react-router"
import { ArrowLeftIcon } from "lucide-react"
import TransactionDetail from "./-component/transaction-detail"

export const Route = createFileRoute(
  "/_authorize/system/teams/$teamId/transactions/$txnId/",
)({
  component: Index,
})

function Index() {
  const params = useParams({
    from: "/_authorize/system/teams/$teamId/transactions/$txnId/",
  })

  const teamId = params.teamId

  return (
    <LayoutTeam>
      <div className={"pb-8"}>
        <PageHeader>
          <div className={"flex items-center justify-center"}>
            <Link
              to="/system/teams/$teamId/transactions"
              params={{ teamId }}
              className={"mr-4 items-center flex"}
              search={StaffListTeamTransactionSchema.parse({})}
            >
              <button>
                <ArrowLeftIcon width={20} height={20} />
              </button>
            </Link>
            <PageHeader.Title>Transaction list</PageHeader.Title>
          </div>
        </PageHeader>

        <div className="border rounded-lg p-4">
          <TransactionDetail />
        </div>
      </div>
    </LayoutTeam>
  )
}
