import { TeamStatus } from "@gearment/nextapi/api/iam/v1/team_pb.ts"
import { TeamRushOrder } from "@gearment/nextapi/common/option/v1/enum_pb"
import { z } from "zod"

export const TeamSearchSchema = z.object({
  page: z.number().default(1).catch(1),
  limit: z.number().default(100).catch(100),
  searchText: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  status: z.nativeEnum(TeamStatus).optional(),
  tier: z.string().optional(),
  enableMassPayment: z.string().optional(),
  enablePayPalFee: z.string().optional(),
  ordered: z.string().optional(),
  isRushOrder: z.nativeEnum(TeamRushOrder).optional(),
  tierIds: z.array(z.string()).optional(),
})

export type FilterTeamType = z.infer<typeof TeamSearchSchema>
