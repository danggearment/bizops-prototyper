import { z } from "zod"
import { TransactionExportSessionStatus } from "@/services/connect-rpc/types"

export const ExportTransactionsSchema = z.object({
  page: z.number().default(1).catch(1),
  limit: z.number().default(100).catch(100),
  from: z.string().optional(),
  to: z.string().optional(),
  status: z.nativeEnum(TransactionExportSessionStatus).optional(),
})

export type ExportTransactionsSearchType = z.infer<
  typeof ExportTransactionsSchema
>
