import { ShippingOptionListAvailableShippingService_ShippingOptionStatus } from "@/services/connect-rpc/types"

export const AllShippingAvailableStatus = Object.freeze(
  ShippingOptionListAvailableShippingService_ShippingOptionStatus,
)

export type AllShippingAvailableStatusKeys =
  keyof typeof AllShippingAvailableStatus

export type AllShippingAvailableStatusValues =
  (typeof AllShippingAvailableStatus)[AllShippingAvailableStatusKeys]
