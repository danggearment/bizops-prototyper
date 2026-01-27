import { z } from "zod"
import { AllStoreStatus } from "@/constants/store.ts"

export const StoreSearchSchema = z.object({
  page: z.number().default(1).catch(1),
  limit: z.number().default(100).catch(100),
  searchText: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  status: z.nativeEnum(AllStoreStatus).optional(),
})

export type FilterStoreType = z.infer<typeof StoreSearchSchema>
