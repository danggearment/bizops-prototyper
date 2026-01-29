import { z } from "zod"

export const ClientSearchSchema = z.object({
  page: z.number().default(1).catch(1),
  limit: z.number().default(20).catch(20),
  search: z.string().optional().default("").catch(""),
})

export type ClientSearchType = z.infer<typeof ClientSearchSchema>

export const ClientFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
})

export type ClientFormType = z.infer<typeof ClientFormSchema>
