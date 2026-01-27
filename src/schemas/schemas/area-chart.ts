import { z } from "zod"

export const AreaChartSearchSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  fromSalesUnits: z.string().optional(),
  toSalesUnits: z.string().optional(),
})

export type AreaChartType = z.infer<typeof AreaChartSearchSchema>
