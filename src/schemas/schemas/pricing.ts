import { PricingRuleDetailMode } from "@/routes/_authorize/global-configuration/pricing-management/-helper"
import { GMTeamPriceCustomStatus } from "@/services/connect-rpc/types"
import { z } from "zod"

export const CreatePricingRuleSchema = z.object({
  customPriceId: z.string().optional(),
  teamId: z.string().min(1, "Assigned team is required"),
  dateRange: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .superRefine((val, ctx) => {
      if (val.from && val.to) {
        const from = new Date(val.from)
        const to = new Date(val.to)
        if (isFinite(+from) && isFinite(+to)) {
          if (to < from) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["to"],
              message: "End date must be after start date",
            })
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["from"],
              message: "Start date must be before end date",
            })
          }

          const now = new Date()
          if (to < now) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["to"],
              message: "End date must be after now",
            })
          }
        }
      }
    }),
  internalNote: z
    .string()
    .max(500, "Internal note must be less than 500 characters")
    .optional(),
})

export type CreatePricingRuleType = z.infer<typeof CreatePricingRuleSchema>

export const ListPricingRuleSchema = z.object({
  page: z.number().min(1).default(1).catch(1),
  limit: z.number().min(1).default(50).catch(50),
  from: z.string().optional(),
  to: z.string().optional(),
  fromStartTime: z.string().optional(),
  toEndTime: z.string().optional(),
  createdByIds: z.array(z.string()).optional(),
  teamIds: z.array(z.string()).optional(),
  status: z
    .nativeEnum(GMTeamPriceCustomStatus)
    .optional()
    .default(GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_UNSPECIFIED),
  sortBy: z.array(z.string()).optional(),
  sortDirection: z.array(z.string()).optional(),
})

export type ListPricingRuleType = z.infer<typeof ListPricingRuleSchema>

export const DetailPricingRuleSchema = z.object({
  mode: z
    .nativeEnum(PricingRuleDetailMode)
    .default(PricingRuleDetailMode.DETAIL)
    .catch(PricingRuleDetailMode.DETAIL),
})

export type DetailPricingRuleType = z.infer<typeof DetailPricingRuleSchema>
