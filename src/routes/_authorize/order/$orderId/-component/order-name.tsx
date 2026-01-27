import { ButtonIconCopy } from "@gearment/ui3"
import React from "react"

interface Props {
  orderId: string
  children?: React.ReactNode
}

export default function OrderName({ orderId, children }: Props) {
  return (
    <div className="space-y-1">
      <div className="body-medium font-medium flex gap-1 items-center">
        <a
          className="text-medium font-bold text-primary"
          href={
            import.meta.env.VITE_CRM_URL +
            "/acp/?site=order&act=show&id=" +
            (orderId.split("-")[1] ? orderId.split("-")[1] : orderId) // Split TW-xxxxxx
          }
          target="_blank"
          rel="noreferrer"
        >
          {orderId}
        </a>
        {orderId && <ButtonIconCopy size="sm" copyValue={orderId} />}
      </div>
      {children}
    </div>
  )
}
