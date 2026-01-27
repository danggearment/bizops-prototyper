import LayoutTeam from "@/components/layout-team"
import { TeamLinkedPaymentMethodSchema } from "@/schemas/schemas/payment"
import { PageHeader } from "@gearment/ui3"
import { createFileRoute, useParams } from "@tanstack/react-router"
import TablePaymentMethodsManagement from "./-component/table-payment/table-payment-methods-management"

export const Route = createFileRoute(
  "/_authorize/system/teams/$teamId/payment-methods/",
)({
  validateSearch: (search) => TeamLinkedPaymentMethodSchema.parse(search),
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
        name: "Payment methods",
        link: "#",
      },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const params = useParams({
    from: "/_authorize/system/teams/$teamId/payment-methods/",
  })
  return (
    <>
      <LayoutTeam>
        <PageHeader>
          <PageHeader.Title>Team's payment methods</PageHeader.Title>
        </PageHeader>
        <TablePaymentMethodsManagement teamId={params.teamId} />
      </LayoutTeam>
    </>
  )
}
