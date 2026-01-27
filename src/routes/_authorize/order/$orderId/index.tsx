import { useQueryPod } from "@/services/connect-rpc/transport"
import { ModalCancelOrder } from "@/services/modals/modal-cancel-order"
import { ModalExportOrders } from "@/services/modals/modal-export-orders/modal-export-orders.tsx"
import { ModalOnHoldOrders } from "@/services/modals/modal-on-hold-orders"
import { ModalReasonCancelOrders } from "@/services/modals/modal-reason-cancel-orders/modal-reason-cancel-orders.tsx"
import ModalRefundOrder from "@/services/modals/modal-refund-order/modal-refund-order"
import { staffGetOrder } from "@gearment/nextapi/api/pod/v1/admin_api-OrderAdminAPI_connectquery"
import { createFileRoute, useParams } from "@tanstack/react-router"
import OrderDetails from "../-component/order-detail/order-detail"
import OrderHeader from "./-component/order-header"

export const Route = createFileRoute("/_authorize/order/$orderId/")({
  beforeLoad: () => ({
    breadcrumb: [
      {
        link: "/order/sale-orders",
        name: "Sale orders",
        search: undefined,
      },
      {
        link: "#",
        name: "Order details",
        search: undefined,
      },
    ],
  }),
  component: Index,
})

function Index() {
  const params = useParams({
    from: "/_authorize/order/$orderId/",
  })

  const { data, isPending } = useQueryPod(staffGetOrder, {
    orderId: params.orderId,
  })

  if (!data?.order) return <></>
  return (
    <>
      <div>
        <OrderHeader order={data?.order} orderRefunds={data?.orderRefunds} />
      </div>

      <OrderDetails
        order={data?.order}
        loading={isPending}
        orderId={params.orderId}
        isApproved
        isProductMatched
        isAddressVerified
      />
      <ModalExportOrders />
      <ModalRefundOrder />
      <ModalCancelOrder />
      <ModalReasonCancelOrders />
      <ModalOnHoldOrders />
    </>
  )
}
