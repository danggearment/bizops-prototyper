import { ProductStatus } from "@/services/connect-rpc/types"
import { z } from "zod"

export const CategorySchema = z.object({
  page: z.number().default(1).catch(1),
  limit: z.number().default(100).catch(100),
  searchText: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  statuses: z.array(z.nativeEnum(ProductStatus)).optional(),
})

export type CategorySearchSchema = z.infer<typeof CategorySchema>

export const CategoryDetailSearchSchema = z.object({
  page: z.number().default(1).catch(1),
  limit: z.number().default(100).catch(100),
  statuses: z.array(z.nativeEnum(ProductStatus)).optional(),
  searchText: z.string().optional(),
})

export type CategoryDetailSearchType = z.infer<
  typeof CategoryDetailSearchSchema
>
