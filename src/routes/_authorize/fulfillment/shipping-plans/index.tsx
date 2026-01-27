import { UserListShippingPlanRequestSchema } from "@/schemas/schemas/shipping-plan"
import { PageHeader } from "@gearment/ui3"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import TableShippingPlans from "./-components/table"

export const Route = createFileRoute("/_authorize/fulfillment/shipping-plans/")(
  {
    validateSearch: zodValidator(UserListShippingPlanRequestSchema),
    search: {
      middlewares: [
        stripSearchParams(UserListShippingPlanRequestSchema.parse({})),
      ],
    },
    component: RouteComponent,
    staticData: {
      breadcrumb: [
        {
          name: "Fulfillment",
          link: "#",
        },
        {
          name: "Shipping plans",
          link: "/fulfillment/shipping-plans",
        },
      ],
    },
  },
)

function RouteComponent() {
  return (
    <div className="space-y-4 pb-4">
      <PageHeader>
        <PageHeader.Title>Shipping plans </PageHeader.Title>
      </PageHeader>
      <TableShippingPlans />
    </div>
  )
}
