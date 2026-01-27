import {
  ShippingParcel_ShippingService,
  ShippingPlan_Status,
  ShippingParcel_Status,
} from "@gearment/nextapi/api/ffm/v1/cross_dock_pb"
import { z } from "zod"

export const UserListShippingPlanRequestSchema = z.object({
  teamId: z.string().optional(),
  userId: z.string().optional(),
  page: z.number().min(1).default(1).catch(1),
  limit: z.number().min(1).default(50).catch(50),
  searchText: z.string().optional(),
  status: z.array(z.nativeEnum(ShippingPlan_Status)).optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
})

export const UserCreateShippingPlanRequestSchema = z.object({
  orderIds: z.array(z.string()),
  maxParcelPerBox: z.number().min(1),
  defaultShippingService: z.nativeEnum(ShippingParcel_ShippingService),
  isRelabelingServiceEnabled: z.boolean().default(false),
  destination: z.object({
    country: z.string(),
    countryCode: z.string(),
    region: z.string(),
    regionCode: z.string(),
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    adminArea1: z.string().optional(),
    adminArea2: z.string().optional(),
    postalCode: z
      .string()
      .min(5, { message: "Postal code must be 5 digits" })
      .optional(),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    phoneNo: z.string().optional(),
    email: z.string().email().optional(),
    note: z.string().optional(),
  }),
  packagingBoxId: z.string().min(1, { message: "Packaging box is required" }),
})

export const UserUpdateShippingPlanRequestSchema = z
  .object({
    status: z.nativeEnum(ShippingPlan_Status),
    origin: z.object({
      country: z.string(),
      countryCode: z.string().min(1, { message: "Country code is required" }),
      region: z.string(),
      regionCode: z.string().min(1, { message: "Region code is required" }),
      addressLine1: z
        .string()
        .min(1, { message: "Address line 1 is required" }),
      addressLine2: z
        .string()
        .min(1, { message: "Address line 2 is required" }),
      adminArea1: z.string().optional(),
      adminArea2: z.string().optional(),
      postalCode: z
        .string()
        .min(5, { message: "Postal code must be 5 digits" })
        .optional(),
      firstName: z.string().min(1, { message: "First name is required" }),
      lastName: z.string().min(1, { message: "Last name is required" }),
      phoneNo: z.string().min(1, { message: "Phone number is required" }),
      email: z.string().email().min(1, { message: "Email is required" }),
      note: z.string().optional(),
    }),
    destination: z.object({
      country: z.string().optional(),
      countryCode: z.string().optional(),
      region: z.string().optional(),
      regionCode: z.string().optional(),
      addressLine1: z.string().optional(),
      addressLine2: z.string().optional(),
      adminArea1: z.string().optional(),
      postalCode: z.string().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phoneNo: z.string().optional(),
      email: z.string().optional(),
      note: z.string().optional(),
    }),
    shippingDate: z.string().min(1, { message: "Shipping date is required" }),
    eta: z.string().min(1, { message: "ETA is required" }),

    trackingInfo: z.object({
      trackingNumber: z.string(),
      trackingUrl: z.string(),
      trackingCarrier: z.string(),
      trackingService: z.string(),
      labelUrl: z.string(),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.status === ShippingPlan_Status.READY_FOR_SHIPPING) {
      if (data.trackingInfo.trackingNumber === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Tracking number is required",
          path: ["trackingInfo", "trackingNumber"],
        })
      }
      if (data.trackingInfo.trackingUrl === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Tracking URL is required",
          path: ["trackingInfo", "trackingUrl"],
        })
      }
      if (data.trackingInfo.trackingCarrier === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Tracking carrier is required",
          path: ["trackingInfo", "trackingCarrier"],
        })
      }
      if (data.trackingInfo.trackingService === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Tracking service is required",
          path: ["trackingInfo", "trackingService"],
        })
      }
    }
  })

export const ConfirmShippingPlanPaidSchema = z.object({
  shippingPlanId: z
    .string()
    .min(1, { message: "Shipping plan ID is required" }),
  paymentReferenceId: z
    .string()
    .min(1, { message: "Payment reference ID is required" }),
  paymentNote: z.string().min(1, { message: "Payment note is required" }),
})

export const UpdateShippingParcelTrackingInfoSchema = z.object({
  labelUrl: z.string().min(1, { message: "Label URL is required" }),
  trackingNumber: z.string().min(1, { message: "Tracking number is required" }),
  trackingUrl: z.string().min(1, { message: "Tracking URL is required" }),
  trackingCarrier: z
    .string()
    .min(1, { message: "Tracking carrier is required" }),
  trackingService: z
    .string()
    .min(1, { message: "Tracking service is required" }),
})

export const UpdateShippingPlanStatusSchema = z.object({
  status: z.nativeEnum(ShippingParcel_Status),
})

export type UserCreateShippingPlanRequestType = z.infer<
  typeof UserCreateShippingPlanRequestSchema
>

export type UserListShippingPlanRequestType = z.infer<
  typeof UserListShippingPlanRequestSchema
>

export type UserUpdateShippingPlanRequestType = z.infer<
  typeof UserUpdateShippingPlanRequestSchema
>

export type UpdateShippingPlanStatusType = z.infer<
  typeof UpdateShippingPlanStatusSchema
>

export type UpdateShippingParcelTrackingInfoType = z.infer<
  typeof UpdateShippingParcelTrackingInfoSchema
>

export type ConfirmShippingPlanPaidType = z.infer<
  typeof ConfirmShippingPlanPaidSchema
>
