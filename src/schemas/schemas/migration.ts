import {
  Migration_DataType,
  Migration_Job_Status,
} from "@/services/connect-rpc/types"
import { z } from "zod"

export const MigrationSearchKeys = z.enum(["cusId", "nextUserId"])

export enum MigrationTabs {
  MigrationAccounts = "migration-accounts",
  MigrationJobs = "migration-jobs",
}

export const MigrationSearchSchema = z.object({
  page: z.number().default(1).catch(1),
  limit: z.number().default(100).catch(100),
  cusIds: z.array(z.string().regex(/^\d+$/)).optional().default([]),
  dataTypes: z.array(z.nativeEnum(Migration_DataType)).default([]),
  status: z
    .nativeEnum(Migration_Job_Status)
    .default(Migration_Job_Status.UNSPECIFIED)
    .catch(Migration_Job_Status.UNSPECIFIED),
  from: z.string().optional(),
  to: z.string().optional(),
  searchText: z.string().optional(),
  searchKey: MigrationSearchKeys.default(
    MigrationSearchKeys.Enum.nextUserId,
  ).catch(MigrationSearchKeys.Enum.nextUserId),
  tab: z.nativeEnum(MigrationTabs).default(MigrationTabs.MigrationAccounts),
})

export type MigrationSearchType = z.infer<typeof MigrationSearchSchema>
