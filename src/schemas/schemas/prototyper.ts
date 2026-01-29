import { z } from "zod"

export const PrototyperSearchSchema = z.object({
  page: z.number().default(1).catch(1),
  limit: z.number().default(20).catch(20),
  search: z.string().optional().default("").catch(""),
})

export type PrototyperSearchType = z.infer<typeof PrototyperSearchSchema>
