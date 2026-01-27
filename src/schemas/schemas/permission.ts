import { z } from "zod"

export const PermissionFilterSchema = z.object({
  page: z.number().default(1).catch(1),
  limit: z.number().default(100).catch(100),
  searchText: z.string().optional(),
  type: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
})

export type PermissionFilterType = z.infer<typeof PermissionFilterSchema>
