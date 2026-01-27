export const Route = createFileRoute(
  "/_authorize/fulfillment/shipping-plans/(shipping-detail)/$shippingId/",
)({
  component: RouteComponent,
  staticData: {
    breadcrumb: [
      {
        name: "Shipping plans",
        link: "/shipping-plans",
      },
      {
        name: "Shipping plans detail",
        link: "/shipping-plans/(shipping-detail)/$shippingId",
      },
    ],
  },
})

import { ShippingPlanStatusLabel } from "@/constants/enum-label"
import {
  mappingColor,
  ShippingPlanStatusColorsMapping,
} from "@/constants/map-color"
import { UserListShippingPlanRequestSchema } from "@/schemas/schemas/shipping-plan"
import { useQueryFfm } from "@/services/connect-rpc/transport"
import { staffGetShippingPlan } from "@gearment/nextapi/api/ffm/v1/cross_dock_admin-CrossDockingFulfillmentAdminAPI_connectquery"
import {
  Badge,
  Button,
  ButtonIconCopy,
  DefaultNotFoundComponent,
  PageHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@gearment/ui3"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeftIcon } from "lucide-react"
import BoxList from "./-components/box-list"
import ConfirmShippingPlanPaid from "./-components/confirm-shipping-plan-paid"
import ParcelList from "./-components/pacel-list/parcel-list"
import ShippingRoute from "./-components/shipping-route"

function RouteComponent() {
  const { shippingId } = Route.useParams()
  const { data: shippingPlan, isPending } = useQueryFfm(
    staffGetShippingPlan,
    {
      shippingPlanId: shippingId,
    },
    {
      enabled: !!shippingId,
    },
  )
  if (isPending) {
    return <div>Loading...</div>
  }

  if (!shippingPlan) {
    return <DefaultNotFoundComponent as={Link} />
  }

  const data = shippingPlan.shippingPlan
  if (!data) {
    return <DefaultNotFoundComponent as={Link} />
  }

  return (
    <div className="pb-4">
      <Link
        to="/fulfillment/shipping-plans"
        search={UserListShippingPlanRequestSchema.parse({})}
        className="inline-block mb-4"
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ArrowLeftIcon size={16} />
          </Button>
          Back to shipping plans
        </div>
      </Link>
      <PageHeader>
        <div>
          <PageHeader.Title>{data.planName}</PageHeader.Title>
          <PageHeader.Description>
            <div className="flex gap-2">
              <div className="flex gap-2 items-center">
                <span className="text-secondary-foreground">
                  #{data.planId}
                </span>
                <ButtonIconCopy
                  size={"sm"}
                  copyValue={data.planId || ""}
                  className="ml-2"
                />
              </div>
              {data.status && (
                <Badge
                  variant={mappingColor(
                    ShippingPlanStatusColorsMapping,
                    data.status,
                  )}
                >
                  {ShippingPlanStatusLabel[data.status]}
                </Badge>
              )}
            </div>
          </PageHeader.Description>
        </div>
      </PageHeader>
      <div className="bg-background border rounded-md p-4 mb-4">
        <ShippingRoute shippingPlan={data} />
      </div>
      <Tabs defaultValue="parcels-information">
        <div className="flex justify-between items-center">
          <TabsList className="bg-sidebar">
            <TabsTrigger value="box-information">Box information</TabsTrigger>
            <TabsTrigger value="parcels-information">
              Parcels information
            </TabsTrigger>
          </TabsList>
          <div>
            <ConfirmShippingPlanPaid shippingPlan={data} />
          </div>
        </div>
        <TabsContent value="box-information">
          <div className="bg-background rounded-md p-4">
            <h2 className="text-lg font-bold mb-4">Box information</h2>
            <BoxList shippingPlan={data} />
          </div>
        </TabsContent>
        <TabsContent value="parcels-information">
          <ParcelList shippingPlan={data} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
