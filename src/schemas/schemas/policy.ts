import { z } from "zod"

export const SeedPolicySchema = z.object({
  from: z.date({
    required_error: "Date is required",
  }),
  to: z.date({
    required_error: "Date is required",
  }),
})

export type SeedPolicyFormData = z.infer<typeof SeedPolicySchema>
