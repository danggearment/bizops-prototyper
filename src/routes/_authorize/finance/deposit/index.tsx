import { StaffListDepositRequestSchema } from "@/schemas/schemas/payment"
import { PageHeader } from "@gearment/ui3"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import TableDeposit from "./-components/table-billings/table-billings"

export const Route = createFileRoute("/_authorize/finance/deposit/")({
  validateSearch: zodValidator(StaffListDepositRequestSchema),
  search: {
    middlewares: [stripSearchParams(StaffListDepositRequestSchema.parse({}))],
  },
  beforeLoad: () => {
    return {
      breadcrumb: [
        {
          name: "Finance",
          link: "/finance",
          search: undefined,
        },
        {
          name: "Deposit request",
          link: "/finance/deposit",
          search: undefined,
        },
      ],
    }
  },
  component: Index,
})

function Index() {
  return (
    <>
      <PageHeader>
        <PageHeader.Title>Deposit request</PageHeader.Title>
      </PageHeader>
      <TableDeposit />
    </>
  )
}
