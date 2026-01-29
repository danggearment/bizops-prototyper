import { z } from "zod"

export const ClientDetailSearchSchema = z.object({
  tab: z
    .enum(["overview", "orders", "payments", "notes"])
    .default("overview")
    .catch("overview"),
})

export type ClientDetailSearchType = z.infer<typeof ClientDetailSearchSchema>
