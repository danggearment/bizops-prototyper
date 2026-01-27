import { AllTransactionType } from "@/constants/payment.ts"
import {
  CreditIntervalUnit,
  CreditStatementPaymentRequestStatus,
  DepositRequestStatus,
  LinkedPaymentMethodStatus,
  TeamTransactionType,
} from "@/services/connect-rpc/types"
import { getNumberFromInputMask } from "@gearment/utils"
import { z } from "zod"

export const TeamLinkedPaymentMethodSchema = z.object({
  page: z.number().default(1).catch(1),
  limit: z.number().default(100).catch(100),
  payment_methods: z.array(z.string()).optional(),
  status: z.array(z.nativeEnum(LinkedPaymentMethodStatus)).optional(),
})

export type TeamLinkedPaymentMethodType = z.infer<
  typeof TeamLinkedPaymentMethodSchema
>

export const AllDepositRequestSearchKeys = z.enum([
  "transactionId",
  "teamId",
  "emailAddress",
  "referenceId",
])

export const StaffListDepositRequestSchema = z.object({
  page: z.number().default(1).catch(1),
  limit: z.number().default(100).catch(100),
  methodCode: z.array(z.string()).optional(),
  status: z.array(z.nativeEnum(DepositRequestStatus)).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  searchKey: AllDepositRequestSearchKeys.default(
    AllDepositRequestSearchKeys.Enum.referenceId,
  ).catch(AllDepositRequestSearchKeys.Enum.referenceId),
  searchText: z.string().optional(),
  sortBy: z.array(z.string()).optional(),
  sortDirection: z.array(z.string()).optional(),
})

export type AllDepositRequestSearchKeysType = z.infer<
  typeof AllDepositRequestSearchKeys
>

export type StaffListDepositRequestType = z.infer<
  typeof StaffListDepositRequestSchema
>

export const AllListTeamTransactionSearchKeys = z.enum(["txnId", "email"])

export const StaffListTeamTransactionSchema = z.object({
  page: z.number().default(1).catch(1),
  limit: z.number().default(100).catch(100),
  type: z.nativeEnum(TeamTransactionType).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  searchKey: AllListTeamTransactionSearchKeys.default(
    AllListTeamTransactionSearchKeys.Enum.txnId,
  ).catch(AllListTeamTransactionSearchKeys.Enum.txnId),
  searchText: z.string().optional(),
})

export type StaffListTeamTransactionType = z.infer<
  typeof StaffListTeamTransactionSchema
>

export const CreateRefundSchema = z
  .object({
    reasonId: z
      .string({
        required_error:
          "Please provide a valid reason to proceed with the refund",
      })
      .min(1, "Reason is required")
      .max(255, "Reason must be less than 255 characters"),
    reason: z.string(),
    isOtherReason: z.boolean().default(false),
    customReason: z.string().max(255).optional(),
    customAmounts: z.record(z.string(), z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isOtherReason && !data.customReason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Please provide a valid reason (minimum 1 characters) to proceed with the refund",
        path: ["customReason"],
      })
    }

    // Validate custom amounts if they exist
    if (data.customAmounts) {
      for (const [orderId, amount] of Object.entries(data.customAmounts)) {
        if (amount && getNumberFromInputMask(amount) <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Amount must be greater than 0",
            path: ["customAmounts", orderId],
          })
        }
      }
    }
  })

export type RefundFormType = z.infer<typeof CreateRefundSchema>

export const AllTransactionSearchKeys = z.enum(["transactionId", "email"])

export const AllTransactionSearchSchema = z.object({
  page: z.number().default(1).catch(1),
  limit: z.number().default(100).catch(100),
  from: z.string().optional(),
  to: z.string().optional(),
  type: z
    .nativeEnum(AllTransactionType)
    .default(AllTransactionType.ALL)
    .catch(AllTransactionType.ALL),
  methodCode: z.array(z.string()).optional(),
  approvalBy: z.array(z.string()).optional(),

  searchKey: AllTransactionSearchKeys.default(
    AllTransactionSearchKeys.Enum.transactionId,
  ).catch(AllTransactionSearchKeys.Enum.transactionId),
  searchText: z.string().optional().catch("").default(""),
})

export type AllTransactionSearchType = z.infer<
  typeof AllTransactionSearchSchema
>

export const CreateCreditSchema = z
  .object({
    teamId: z
      .string({
        required_error: "Please provide a valid team id",
      })
      .min(1, "Team ID is required"),
    limit: z
      .string()
      .min(1, "Credit limit is required")
      .refine((value) => getNumberFromInputMask(value) > 0, {
        message: "Credit limit must be greater than 0",
      }),
    statementOffset: z.number().min(1, "Statement date is required"),
    statementUnit: z.nativeEnum(CreditIntervalUnit, {
      required_error: "Statement date is required",
    }),
    dueUnit: z.nativeEnum(CreditIntervalUnit, {
      required_error: "Due date is required",
    }),
    dueOffset: z.number().min(1, "Due date is required"),
    policyNote: z
      .string()
      .min(5, "Policy note is required (minimum 5 characters)")
      .max(1000, "Policy note must be less than 1000 characters"),
    enableNotification: z.boolean().default(false),
    usageThreshold: z.number().default(0).catch(0).optional(),
    files: z
      .array(
        z.object({
          fileName: z.string(),
          fileSize: z.number(),
          fileType: z.string(),
          fileUrl: z.string(),
        }),
      )
      .min(1, "At least one attachment is required"),
  })
  .superRefine((data, ctx) => {
    if (data.enableNotification) {
      const threshold = data.usageThreshold
      if (threshold === undefined || threshold === null || threshold === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Usage threshold is required when notifications are enabled",
          path: ["usageThreshold"],
        })
      } else if (threshold < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Usage threshold must be at least 1%",
          path: ["usageThreshold"],
        })
      } else if (threshold > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Usage threshold cannot exceed 100%",
          path: ["usageThreshold"],
        })
      }
    }
  })

export type CreateCreditType = z.infer<typeof CreateCreditSchema>

export const UpdateCreditSchema = z
  .object({
    teamId: z
      .string({
        required_error: "Please provide a valid team id",
      })
      .min(1, "Team ID is required"),
    limit: z
      .string()
      .min(1, "Credit limit is required")
      .refine((value) => getNumberFromInputMask(value) > 0, {
        message: "Credit limit must be greater than 0",
      }),
    statementOffset: z.number().min(1, "Statement date is required"),
    statementUnit: z.nativeEnum(CreditIntervalUnit, {
      required_error: "Statement date is required",
    }),
    dueUnit: z.nativeEnum(CreditIntervalUnit, {
      required_error: "Due date is required",
    }),
    dueOffset: z.number().min(1, "Due date is required"),
    enableNotification: z.boolean().default(false),
    usageThreshold: z.number().default(0).catch(0).optional(),
    reasonId: z.string().min(5, "Reason is required"),
    reason: z
      .string({
        required_error:
          "Please provide a detailed reason for this G-credit modification",
      })
      .min(5, "Reason must be at least 5 characters to ensure clarity"),
  })
  .superRefine((data, ctx) => {
    if (data.enableNotification) {
      const threshold = data.usageThreshold
      if (threshold === undefined || threshold === null || threshold === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Usage threshold is required when notifications are enabled",
          path: ["usageThreshold"],
        })
      } else if (threshold < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Usage threshold must be at least 1%",
          path: ["usageThreshold"],
        })
      } else if (threshold > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Usage threshold cannot exceed 100%",
          path: ["usageThreshold"],
        })
      }
    }
  })

export type UpdateCreditType = z.infer<typeof UpdateCreditSchema>

export const ApproveCreditStatementSchema = z
  .object({
    statementId: z.string().min(1, "Statement ID is required"),
    amountReceived: z
      .string()
      .min(1, "Amount received is required")
      .refine((value) => getNumberFromInputMask(value) > 0, {
        message: "Amount received must be greater than 0",
      }),
    methodCode: z.string().min(1, "Method code is required"),
    files: z.array(z.string()).optional(),
    creditStatementPaymentRequestId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      !data.creditStatementPaymentRequestId &&
      (!data.files || data.files.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Payment proof is required when processing payment without a payment request",
        path: ["files"],
      })
    }
  })

export type ApproveCreditStatementType = z.infer<
  typeof ApproveCreditStatementSchema
>

export const ReasonRejectStatementSchema = z.object({
  reasonId: z
    .string({
      required_error:
        "Please provide a valid reason (minimum 1 characters) to proceed with the cancellation",
    })
    .min(1)
    .max(255),
  customReason: z
    .string()
    .min(5, "Custom reason must be at least 5 characters long.")
    .max(155, "Limit is 155 characters. Please reduce your text.")
    .optional(),
})

export type ReasonRejectStatement = z.infer<typeof ReasonRejectStatementSchema>

export const StaffListStatementPaymentRequestSchema = z.object({
  page: z.number().default(1).catch(1),
  limit: z.number().default(100).catch(100),
  status: z
    .nativeEnum(CreditStatementPaymentRequestStatus)
    .optional()
    .default(CreditStatementPaymentRequestStatus.UNKNOWN),
  resolverIds: z.array(z.string()).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  searchTokens: z.array(z.string()).optional(),
  sortBy: z.array(z.string()).optional(),
  sortDirection: z.array(z.string()).optional(),
  teamIds: z.array(z.string()).optional(),
})

export type StaffListStatementPaymentRequestType = z.infer<
  typeof StaffListStatementPaymentRequestSchema
>
