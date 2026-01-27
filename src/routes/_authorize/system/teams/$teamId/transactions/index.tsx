import LayoutTeam from "@/components/layout-team"
import {
  AllListTeamTransactionSearchKeys,
  StaffListTeamTransactionSchema,
} from "@/schemas/schemas/payment"
import { useQueryFinance } from "@/services/connect-rpc/transport"
import { formatDateForCallApi } from "@/utils/format-date"
import { staffListTeamTransaction } from "@gearment/nextapi/api/payment/v1/payment_admin-PaymentAdminAPI_connectquery"
import { PageHeader } from "@gearment/ui3"
import { createFileRoute, useParams, useSearch } from "@tanstack/react-router"
import Export from "./-component/export/export"
import TableTransactionManagement from "./-component/table-transaction/table-transaction-management"

export const Route = createFileRoute(
  "/_authorize/system/teams/$teamId/transactions/",
)({
  validateSearch: (search) => StaffListTeamTransactionSchema.parse(search),
  beforeLoad: () => ({
    breadcrumb: [
      {
        name: "System",
        link: "/system/teams",
      },
      {
        name: "Teams",
        link: "/system/teams",
      },
      {
        name: "Transactions",
        link: "#",
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const params = useParams({
    from: "/_authorize/system/teams/$teamId/transactions/",
  })
  const search = useSearch({
    from: "/_authorize/system/teams/$teamId/transactions/",
  })

  const { data, isLoading } = useQueryFinance(
    staffListTeamTransaction,
    {
      page: search.page,
      limit: search.limit,
      teamId: params.teamId,
      filter: {
        from: search.from ? formatDateForCallApi(search.from) : undefined,
        to: search.to ? formatDateForCallApi(search.to, "endOfDay") : undefined,
        type: search.type,
      },
      search: {
        search: search.searchText
          ? {
              case:
                search.searchKey ||
                AllListTeamTransactionSearchKeys.Values.txnId,
              value: search.searchText,
            }
          : undefined,
      },
    },
    {},
  )

  return (
    <>
      <LayoutTeam>
        <PageHeader>
          <PageHeader.Title>Transaction list</PageHeader.Title>
          <PageHeader.Action>
            <Export
              allRecordCount={Number(data?.totalExportAll)}
              filteredRecordCount={Number(data?.totalExportFilter)}
              teamId={params.teamId}
            />
          </PageHeader.Action>
        </PageHeader>

        <TableTransactionManagement
          data={data}
          isLoading={isLoading}
          teamId={params.teamId}
        />
      </LayoutTeam>
    </>
  )
}
