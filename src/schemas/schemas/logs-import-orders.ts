import { z } from "zod"

export const LogsImportOrdersSearchSchema = z.object({
  page: z.number().default(1).catch(1),
  limit: z.number().default(100).catch(100),
  from: z.string().optional(),
  to: z.string().optional(),
  status: z.array(z.number()).optional().catch([]),
  platform: z.string().optional(),
})

export type LogsImportOrdersSearchType = z.infer<
  typeof LogsImportOrdersSearchSchema
>
