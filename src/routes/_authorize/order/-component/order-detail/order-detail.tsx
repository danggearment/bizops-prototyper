import { AllOrderPriority } from "@/constants/all-orders-status"
import { AllGiftMessageType } from "@/constants/gift-message-type.ts"
import { OrderPriority } from "@/constants/order"
import OrderGiftMessage from "@/routes/_authorize/order/-component/order-detail/gift-message"
import OrderLogs from "@/routes/_authorize/order/-component/order-detail/order-logs.tsx"
import PaymentInformation from "@/routes/_authorize/order/-component/order-detail/payment-information"
import TableProduct from "@/routes/_authorize/order/-component/order-detail/table-product.tsx"
import {
  MarketplacePlatform,
  Order_Address_Type,
  Order_GiftMessage,
  Order_OrderStatus,
} from "@/services/connect-rpc/types"
import {
  OrderAdmin,
  OrderAdmin_OrderPaymentStatus,
} from "@gearment/nextapi/api/pod/v1/admin_api_type_pb"
import { LoadingCircle } from "@gearment/ui3"
import { useMemo, useState } from "react"
import OrderInformation from "../../-component/order-detail/order-information"
import ShippingInformation from "./shipping-information/shipping-information"

export interface OrderGiftMessageType
  extends Partial<Omit<Order_GiftMessage, "type">> {
  draftId?: string
  giftMessageId: string
  type: AllGiftMessageType
  content: string
}

interface Props {
  order: OrderAdmin
  loading: boolean
  orderId: string
  isApproved: boolean
  isProductMatched: boolean
  isAddressVerified: boolean
}
export default function OrderDetails({
  order,
  loading,
  orderId,
  isApproved,
  isProductMatched,
  isAddressVerified,
}: Props) {
  const priceQuote = {
    orderShippingFee: order?.orderShippingFee,
    orderFee: order?.orderFee,
    orderTax: order?.orderTax,
    orderSubTotal: order?.orderSubtotal,
    orderTotal: order?.orderTotal,
    orderDiscount: order?.orderDiscount,
    orderGiftMessageFee: order?.orderGiftMessageFee,
    orderHandleFee: order?.orderHandleFee,
    fees: order?.orderFee,
    lineItems: order?.lineItems,
  }

  const addressShippingTo = useMemo(() => {
    return (order?.addresses || []).find(
      (address) => address.type === Order_Address_Type.SHIP_TO,
    )
  }, [order])

  const addressShippingToUpdate = useMemo(() => {
    return (order?.addresses || []).find(
      (address) => address.type === Order_Address_Type.SHIP_TO_UPDATE,
    )
  }, [order])

  const [openByPassModal, setOpenByPassModal] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingCircle size={"lg"} />
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-4">
      <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
        <OrderInformation
          fulfillmentOrderId={order.fulfillmentOrderId}
          orderPlatform={order.orderPlatform as MarketplacePlatform}
          platformRef={order.platformRef}
          teamCode={order.teamId}
          storeName={order.storeName}
          paymentMethodCode={order.checkoutRequest?.paymentMethodCode || ""}
          orderLocation={""}
          priority={OrderPriority[order.priority]}
          isApproved={isApproved}
          isProductMatched={isProductMatched}
          isAddressVerified={isAddressVerified}
          isCheckedOut={order?.status !== Order_OrderStatus.PAYMENT_FAILED}
          approvedAt={order.approvedAt}
          createdAt={order.createdAt}
          paidAt={order.paidAt}
          orderId={orderId}
          shippingOption={order.shippingOption}
          billingOption={order.billingOption}
          openByPassModal={openByPassModal}
          setOpenByPassModal={setOpenByPassModal}
          fulfillmentVendor={order.fulfillmentVendor}
          storeId={order.storeId}
          teamOwnerEmail={order.teamOwnerEmail}
          createdByEmail={order.createdByEmail}
          isRushOrder={order.priority === AllOrderPriority.RUSH || order.isRush}
          isMarkFulfilled={order.isMarkFulfilled}
          createdMethod={order.createdMethod}
          teamName={order.teamName}
        />
        <PaymentInformation
          isCheckedOut={
            order.paymentStatus ===
            OrderAdmin_OrderPaymentStatus.PAYMENT_STATUS_SUCCESS
          }
          totalAmount={order?.orderTotal}
          totalUnit={order.lineItems.reduce(
            (sum, item) => sum + Number(item.quantity),
            0,
          )}
          shippingFee={order.orderShippingFee}
          subTotal={order.orderSubtotal}
          handleFee={order.orderHandleFee}
          taxFee={order.orderTax}
          giftMessageFee={order.orderGiftMessageFee}
          surchargeFee={order.orderSurcharge}
          discountFee={order.orderDiscount}
          rushFee={order.orderRushFee}
          extraFee={undefined}
          refundStatus={order.refundStatus}
          refundTransactionIds={order.refundTransactionIds}
          paymentMethodCode={order.checkoutRequest?.paymentMethodCode || ""}
          txnId={order.checkoutRequest?.txnId || ""}
        />
        <div className="bg-background rounded-lg">
          <ShippingInformation
            address={addressShippingTo}
            shippingOption={order.shippingOption}
            isLabelOrder={order?.isLabelAttached}
            shippingLabels={order.shippingLabels}
            orderId={orderId}
            orderTrackings={order.orderTrackings}
            billingOption={order.billingOption}
            addressUpdate={addressShippingToUpdate}
          />
        </div>
      </div>

      <TableProduct
        loading={loading}
        priceQuote={priceQuote}
        lineItems={order.lineItems}
        teamId={order.teamId}
      />
      <OrderGiftMessage
        orderId={orderId}
        orderGiftMessages={
          (order.giftMessages || []) as unknown as OrderGiftMessageType[]
        }
      />
      <OrderLogs orderId={orderId} />
    </div>
  )
}
