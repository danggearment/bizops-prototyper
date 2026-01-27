import Image from "@/components/common/image/image"
import { AllGiftMessageTypeLabel } from "@/constants/gift-message-type"
import { formatPrice } from "@/utils"
import { Badge } from "@gearment/ui3"
import { OrderGiftMessageType } from "./order-detail"

interface Props {
  orderId: string
  orderGiftMessages: OrderGiftMessageType[]
}

export default function OrderGiftMessage(props: Props) {
  const giftMessage = props.orderGiftMessages
  return (
    <>
      <div className="p-4 rounded-lg bg-background overflow-auto">
        <div className="flex items-center justify-between">
          <h3 className="heading-3 mb-4 flex items-center gap-2">
            Gift Message
          </h3>
          <p className="text-medium">
            <span className="text-muted-foreground">Total quantity: </span>
            {giftMessage?.length}
          </p>
        </div>
        {giftMessage &&
          giftMessage.map((gift, index) => (
            <div
              key={index}
              className="space-y-2 border-b py-4 last:border-none"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <Image url={gift.avatarUrl || ""} width={56} height={56} />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {gift.giftMessageName}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {AllGiftMessageTypeLabel[gift.type]}
                      </Badge>
                    </div>
                    <p className="text-medium text-muted-foreground">
                      ID: {gift.giftMessageId}
                    </p>
                  </div>
                </div>

                <div className="text-right text-medium">
                  <p className="font-medium">
                    {formatPrice(gift?.price) || "--"} per card
                  </p>
                  <p className="text-muted-foreground">
                    Quantity: {gift.quantity?.toString()}
                  </p>
                </div>
              </div>

              {gift.content && (
                <>
                  <p className="text-medium text-muted-foreground">Content</p>
                  <p className="text-medium">{gift.content}</p>
                </>
              )}
            </div>
          ))}
      </div>
    </>
  )
}
