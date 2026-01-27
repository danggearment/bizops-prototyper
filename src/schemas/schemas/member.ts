import { z } from "zod"

export const FilterSchema = z.object({
  page: z.number().default(1).catch(1),
  limit: z.number().default(100).catch(100),
  searchText: z.string().optional(),
  role: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
})

export type FilterType = z.infer<typeof FilterSchema>
