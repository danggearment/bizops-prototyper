import {
  CreationMethodsOrderDraft,
  OptionsFilterOrderDraft,
  OrderDraftStatus,
  OrderLocationOrderDraft,
} from "@/constants/order-draft-status.ts"
import { AllPlatform } from "@/constants/platform"
import { z } from "zod"

import { Order_OrderRefundStatus } from "@/services/connect-rpc/types"
import { ReasonCancelOrdersType } from "@/services/modals/modal-reason-cancel-orders"

export const OrderDraftSearchKeys = z.enum([
  "draftId",
  "originDraftId",
  "orderId",
  "originOrderId",
  "referenceId",
  "teamId",
  "createdByEmails",
  "customerName",
  "customerEmail",
])

export const OrderDraftSearchSchema = z.object({
  page: z.number().default(1).catch(1),
  limit: z.number().default(100).catch(100),
  status: z
    .nativeEnum(OrderDraftStatus)
    .default(OrderDraftStatus.ALL)
    .catch(OrderDraftStatus.ALL),
  from: z.string().optional(),
  to: z.string().optional(),
  storeId: z.string().optional().default(""),
  platforms: z.array(z.nativeEnum(AllPlatform)).optional(),
  createdMethods: z
    .array(z.nativeEnum(CreationMethodsOrderDraft))
    .optional()
    .default([]),
  productIds: z.array(z.string()).optional(),
  colorCodes: z.array(z.string()).optional(),
  sizeCodes: z.array(z.string()).optional(),
  shippingMethods: z.array(z.string()).optional(),
  options: z.array(z.nativeEnum(OptionsFilterOrderDraft)).optional(),
  orderLocation: z.nativeEnum(OrderLocationOrderDraft).optional(),
  carrier: z.array(z.string()).optional(),
  productType: z.string().optional().default(""),
  priority: z.string().optional(),
  refundStatus: z.array(z.nativeEnum(Order_OrderRefundStatus)).optional(),
  positionPrint: z.array(z.string()).optional(),
  storeIds: z.array(z.string()).optional(),
  variant: z.string().optional().default(""),
  ioss: z.string().optional(),
  searchKey: OrderDraftSearchKeys.default(
    OrderDraftSearchKeys.Enum.draftId,
  ).catch(OrderDraftSearchKeys.Enum.draftId),
  searchText: z.string().optional().default(""),
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
      .min(
        1,
        "Please provide a valid reason (minimum 1 characters) to proceed with the cancellation",
      )
      .max(155, "Limit is 155 characters. Please reduce your text.")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.reasonId === ReasonCancelOrdersType.ANOTHER_REASON) {
        return true
      }
      return true
    },
    {
      message:
        "Please provide a valid reason (minimum 1 characters) to proceed with the cancellation",
      path: ["customReason"],
    },
  )

export type ReasonCancelOrders = z.infer<typeof ReasonCancelOrdersSchema>
export type OrderDraftSearchType = z.infer<typeof OrderDraftSearchSchema>
export type OrderDraftSearchKeysType = z.infer<typeof OrderDraftSearchKeys>
