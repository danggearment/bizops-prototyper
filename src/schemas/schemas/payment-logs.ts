import {
  StaffCheckoutRequest_Status,
  StaffCheckoutRequest_Type,
} from "@gearment/nextapi/api/payment/v1/data_staff_checkout_request_pb"
import { z } from "zod"

export const PaymentLogsSearchKeys = z.enum(["anyOrderIds"])

export const PaymentLogsSearchSchema = z.object({
  page: z.number().default(1).catch(1),
  limit: z.number().default(100).catch(100),
  searchKey: PaymentLogsSearchKeys.optional().default(
    PaymentLogsSearchKeys.Values.anyOrderIds,
  ),
  search: z.string().optional(),
  statuses: z
    .array(z.nativeEnum(StaffCheckoutRequest_Status))
    .optional()
    .default([]),
  types: z
    .array(z.nativeEnum(StaffCheckoutRequest_Type))
    .optional()
    .default([]),
  paymentMethodCodes: z.array(z.string()).optional().default([]),
  teamIds: z.array(z.string()).optional().default([]),
  ids: z.array(z.string()).optional().default([]),
  anyOrderIds: z.array(z.string()).optional().default([]),
  createdFrom: z.string().optional(),
  createdTo: z.string().optional(),
  updatedFrom: z.string().optional(),
  updatedTo: z.string().optional(),
  expiredFrom: z.string().optional(),
  expiredTo: z.string().optional(),
  sortBy: z.array(z.string()).optional(),
  sortDirection: z.array(z.string()).optional(),
})

export type PaymentLogsSearchType = z.infer<typeof PaymentLogsSearchSchema>
