import { AllOrderStatus } from "@/constants/all-orders-status.ts"
import {
  AllCreationMethodsAllOrder,
  AllOptionsFilterAllOrder,
  AllOrderLocationAllOrder,
  MarkFulfilledOptionsAllOrderEnum,
} from "@/constants/order"
import { AllPlatform } from "@/constants/platform"
import { Order_OrderRefundStatus } from "@/services/connect-rpc/types"
import { ReasonCancelOrdersType } from "@/services/modals/modal-reason-cancel-orders"
import { AllOrder_Type } from "@gearment/nextapi/api/pod/v1/order_pb"
import { z } from "zod"

export const AllOrderSearchKeys = z.enum([
  "orderId",
  "fulfillmentOrderId",
  "referenceId",
  "teamId",
  "customerName",
  "createdByEmails",
  "trackingNumber",
])

export const AllOrderSearchSchema = z.object({
  page: z.number().default(1).catch(1),
  limit: z.number().default(100).catch(100),
  processingStatus: z
    .nativeEnum(AllOrderStatus)
    .default(AllOrderStatus.ALL)
    .catch(AllOrderStatus.ALL),
  from: z.string().optional(),
  to: z.string().optional(),
  platforms: z.array(z.nativeEnum(AllPlatform)).optional(),
  createdMethods: z.array(z.nativeEnum(AllCreationMethodsAllOrder)).optional(),
  productIds: z.array(z.string()).optional(),
  colorCodes: z.array(z.string()).optional(),
  sizeCodes: z.array(z.string()).optional(),
  shippingMethods: z.array(z.string()).optional(),
  options: z.array(z.nativeEnum(AllOptionsFilterAllOrder)).optional(),
  orderLocation: z.nativeEnum(AllOrderLocationAllOrder).optional(),
  carrier: z.array(z.string()).optional(),
  productType: z.string().optional().default(""),
  priority: z.string().optional(),
  refundStatus: z.array(z.nativeEnum(Order_OrderRefundStatus)).optional(),
  positionPrint: z.array(z.string()).optional(),
  storeId: z.string().optional(),
  storeIds: z.array(z.string()).optional(),
  variant: z.string().optional(),
  variantId: z.string().optional(),
  ioss: z.string().optional(),
  searchKey: AllOrderSearchKeys.default(AllOrderSearchKeys.Enum.orderId).catch(
    AllOrderSearchKeys.Enum.orderId,
  ),
  searchText: z.string().optional().default(""),
  markFulfilled: z
    .nativeEnum(MarkFulfilledOptionsAllOrderEnum)
    .optional()
    .nullable(),
  sortBy: z.array(z.string()).optional(),
  sortDirection: z.array(z.string()).optional(),
  fulfillmentVendors: z.array(z.string()).optional(),
  processingStatuses: z.array(z.nativeEnum(AllOrderStatus)).optional(),
})

export const ReasonCancelOrdersSchema = z
  .object({
    reasonId: z
      .string({
        required_error:
          "Please provide a valid reason (minimum 1 characters) to proceed with the cancellation",
      })
      .min(1)
      .max(255),
    customReason: z
      .string()
      .max(155, "Limit is 155 characters. Please reduce your text.")
      .optional(),
  })
  .refine(
    (data) => {
      if (
        data.reasonId === ReasonCancelOrdersType.ANOTHER_REASON &&
        !data.customReason
      ) {
        return false
      }
      return true
    },
    {
      message:
        "Please provide a valid reason (minimum 1 characters) to proceed with the cancellation",
      path: ["customReason"],
    },
  )

export const TabsEnum = z.enum(["product", "gift-message", "logs"])

export type ReasonCancelOrders = z.infer<typeof ReasonCancelOrdersSchema>
export type AllOrderSearchType = z.infer<typeof AllOrderSearchSchema>
export type AllOrderSearchKeysType = z.infer<typeof AllOrderSearchKeys>
export type TabsEnumType = z.infer<typeof TabsEnum>

export const AllOrderSearchOrdersSchema = z.object({
  orderIds: z.array(z.string()).default([]).catch([]),
  type: z
    .nativeEnum(AllOrder_Type)
    .default(AllOrder_Type.ALL)
    .catch(AllOrder_Type.ALL),
})

export type AllOrderSearchOrdersType = z.infer<
  typeof AllOrderSearchOrdersSchema
>
