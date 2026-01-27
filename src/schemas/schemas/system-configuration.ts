import { z } from "zod"

export const UpdateAutoApproveDepositConfigSchema = z.object({
  applyToAllTeams: z.boolean(),
  teamIds: z.array(z.string()).optional(),
  paymentMethods: z
    .array(
      z.object({
        methodCode: z.string(),
        enable: z.boolean(),
      }),
    )
    .default([]),
})

export type UpdateAutoApproveDepositConfigType = z.infer<
  typeof UpdateAutoApproveDepositConfigSchema
>
