import { z } from "zod"

export const OpenFeaturesSearchSchema = z.object({
  page: z.number().default(1).catch(1),
  limit: z.number().default(100).catch(100),
})

export type OpenFeaturesSearchType = z.infer<typeof OpenFeaturesSearchSchema>
