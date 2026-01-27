import { createFileRoute } from "@tanstack/react-router"
import TableTransactions from "./-components/table"

export const Route = createFileRoute("/_authorize/fulfillment/transactions/")({
  component: RouteComponent,
  staticData: {
    breadcrumb: [
      {
        name: "Fulfillment",
        link: "#",
      },
      {
        name: "Transactions",
        link: "/dev/fulfillment/transactions",
      },
    ],
  },
})

function RouteComponent() {
  return <TableTransactions />
}
