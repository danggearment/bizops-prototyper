import { z } from "zod"

export const ProductListingSearchSchema = z.object({
  page: z.number().default(1).catch(1),
  limit: z.number().default(20).catch(20),
  search: z.string().optional().default("").catch(""),
  status: z.enum(["all", "active", "draft", "archived"]).default("all").catch("all"),
  category: z.string().optional().default("").catch(""),
})

export type ProductListingSearchType = z.infer<typeof ProductListingSearchSchema>