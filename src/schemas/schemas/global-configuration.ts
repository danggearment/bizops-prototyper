import { ProductPriceTierType } from "@/constants/order"
import { UpdateTeamTierStep } from "@/constants/product-tier"
import { TeamPriceTierAction } from "@/services/connect-rpc/types"
import { RushProductGroupStatus } from "@gearment/nextapi/api/pod/v1/product_admin_pb"
import { z } from "zod"

export const RushOrderSearchSchema = z.object({
  page: z.number().min(1).default(1).catch(1),
  limit: z.number().min(1).default(10).catch(10),
  status: z
    .string()
    .optional()
    .default(RushProductGroupStatus.ALL.toString())
    .catch(RushProductGroupStatus.ALL.toString()),
  search: z.string().optional().default("").catch(""),
})

export const TierManagementSearchSchema = z.object({
  page: z.number().min(1).default(1).catch(1),
  limit: z.number().min(1).default(100).catch(100),
  search: z.string().optional().default("").catch(""),
  type: z
    .nativeEnum(ProductPriceTierType)
    .optional()
    .default(ProductPriceTierType.FBM)
    .catch(ProductPriceTierType.FBM),
})

export type TierManagementSearchSchemaType = z.infer<
  typeof TierManagementSearchSchema
>

export const UpdateTeamTierSearchSchema = z.object({
  teamIds: z.array(z.string()).optional().default([]),
  newTier: z.string().optional().default(""),
  step: z.nativeEnum(UpdateTeamTierStep).default(UpdateTeamTierStep.SelectTeam),
  selectedTiers: z.record(z.string(), z.string()).optional().default({}),
})

export type UpdateTeamTierSearchType = z.infer<
  typeof UpdateTeamTierSearchSchema
>

export const UpdateTeamTierLogsSearchSchema = z.object({
  page: z.number().min(1).default(1).catch(1),
  limit: z.number().min(1).default(100).catch(100),
  teamIds: z.array(z.string()).optional().default([]),
  staffIds: z.array(z.string()).optional().default([]),
  newTierIds: z.array(z.string()).optional().default([]),
  actions: z.array(z.nativeEnum(TeamPriceTierAction)).optional().default([]),
  from: z.string().optional(),
  to: z.string().optional(),
})

export type UpdateTeamTierLogsSearchType = z.infer<
  typeof UpdateTeamTierLogsSearchSchema
>
