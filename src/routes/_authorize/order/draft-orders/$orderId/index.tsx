import { AllGiftMessageType } from "@/constants/gift-message-type"
import {
  mappingColor,
  OrderDraftStatusColorsMapping,
} from "@/constants/map-color"
import { OrderDraftStatusLabel } from "@/constants/order-draft-status"
import { useQueryPod } from "@/services/connect-rpc/transport"
import {
  Order_Address,
  Order_Address_Type,
  Order_CreatedMethod,
  Order_FulfillmentOption,
  Order_FulfillmentPriority,
  Order_FulfillmentVendor,
  Order_GiftMessage,
  Order_GiftMessage_GiftMessageType,
  Order_LineItem,
  Order_OrderRefundStatus,
  Order_OrderStatus,
  OrderDraftStatus,
  ProductMatchingStatus,
  ShippingVerificationStatus,
} from "@/services/connect-rpc/types"
import { OrderAdmin } from "@gearment/nextapi/api/pod/v1/admin_api_type_pb"
import { staffGetOrderDraft } from "@gearment/nextapi/api/pod/v1/order_draft_admin-OrderDraftAdminAPI_connectquery"
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  LoadingCircle,
  PageHeader,
} from "@gearment/ui3"
import { createFileRoute, Link, useRouterState } from "@tanstack/react-router"
import { ArrowLeftIcon } from "lucide-react"
import OrderDetails from "../../-component/order-detail/order-detail"

export interface OrderGiftMessageType extends Partial<
  Omit<Order_GiftMessage, "type">
> {
  draftId?: string
  giftMessageId: string
  type: AllGiftMessageType
  content: string
}

export const Route = createFileRoute(
  "/_authorize/order/draft-orders/$orderId/",
)({
  staticData: {
    breadcrumb: [
      {
        link: "/order/draft-orders",
        name: "Draft orders",
        search: undefined,
      },
      {
        link: "#",
        name: "Order details",
        search: undefined,
      },
    ],
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { orderId } = Route.useParams()

  const { data, isPending } = useQueryPod(
    staffGetOrderDraft,
    {
      draftId: orderId,
    },
    {
      enabled: !!orderId,
      select: (data) => data.data,
    },
  )

  const callbackHistory = useRouterState({
    select: (state) => state.location.state,
  })

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingCircle size={"lg"} />
      </div>
    )
  }
  if (!data) return <></>

  const order = new OrderAdmin({
    ...data,
    fulfillmentOrderId: "",
    fulfillmentVendor:
      data.fulfillmentVendor as unknown as Order_FulfillmentVendor,
    priority: data.priority as unknown as Order_FulfillmentPriority,
    fulfillmentOption: new Order_FulfillmentOption({
      ...data.fulfillmentOption,
    }),
    status: Order_OrderStatus.UNKNOWN,
    addresses: data.addresses.map(
      (address) =>
        new Order_Address({
          ...address,
          type: address.type as unknown as Order_Address_Type,
        }),
    ),
    giftMessages: data.giftMessages.map(
      (giftMessage) =>
        new Order_GiftMessage({
          ...giftMessage,
          type: giftMessage.type as unknown as Order_GiftMessage_GiftMessageType,
        }),
    ),
    teamId: data.teamId,
    shippingLabels: data.shippingLabel,
    refundStatus: Order_OrderRefundStatus.UNKNOWN,
    refundTransactionIds: [],
    createdAt: data.orderDate,
    approvedAt: data.approvedAt,
    paidAt: undefined,
    createdMethod: data.createMethod as unknown as Order_CreatedMethod,
    lineItems: data.lineItems.map(
      (lineItem) =>
        new Order_LineItem({
          ...lineItem,
          option1: lineItem.option1?.name,
          option2: lineItem.option2?.name,
          id: `${lineItem.id}`,
          quantity: BigInt(lineItem.quantity),
        }),
    ),
  })

  return (
    <>
      <div className="body-small mb-4">
        <Link
          to={callbackHistory.href || "/order/draft-orders"}
          className="inline-flex items-center gap-2"
        >
          <Button variant="outline" size="icon" className="p-0">
            <ArrowLeftIcon size={14} />
          </Button>
          <span>Back to list</span>
        </Link>
      </div>
      <PageHeader>
        <PageHeader.Title>
          <div className="flex items-center gap-3">
            <span className="heading-3 text-foreground">Order Details</span>

            {data.status && (
              <Badge
                variant={mappingColor<OrderDraftStatus>(
                  OrderDraftStatusColorsMapping,
                  data.status as unknown as OrderDraftStatus,
                )}
              >
                {OrderDraftStatusLabel[data.status]}
              </Badge>
            )}
          </div>
        </PageHeader.Title>
      </PageHeader>
      {data.notes.length > 0 && (
        <Alert
          variant="destructive"
          className="mb-4 flex bg-error border-red-200 items-center gap-3"
        >
          <div>
            <AlertTitle className="mb-1">⚠️ Note errors</AlertTitle>
            <AlertDescription>
              <div>
                <ul className="list-disc pl-4 text-error-foreground">
                  {data.notes.map((note) => (
                    <li key={note.key}>{note.errorMessage}</li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </div>
        </Alert>
      )}

      <OrderDetails
        order={order}
        loading={false}
        orderId={orderId}
        isApproved={data?.isApproved}
        isAddressVerified={
          data?.shippingVerificationStatus ===
          ShippingVerificationStatus.ADDRESS_VERIFIED
        }
        isProductMatched={
          data?.productMatchingStatus === ProductMatchingStatus.MATCHED
        }
      />
    </>
  )
}
