import {
  GMPrintLocationStatus,
  GMProductPrintTypeStatus,
} from "@/services/connect-rpc/types"
import { z } from "zod"

export const PrintTabSchema = z.enum(["location", "type"])

export const PrintLocationSearchSchema = z.object({
  page: z.number().min(1).default(1).catch(1),
  limit: z.number().min(1).default(100).catch(100),
  searchText: z.string().optional(),
  statuses: z.array(z.nativeEnum(GMPrintLocationStatus)).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
})

export type PrintLocationSearchType = z.infer<typeof PrintLocationSearchSchema>

export const PrintTypeSearchSchema = z.object({
  page: z.number().min(1).default(1).catch(1),
  limit: z.number().min(1).default(100).catch(100),
  searchText: z.string().optional(),
  statuses: z.array(z.nativeEnum(GMProductPrintTypeStatus)).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
})

export type PrintTypeSearchType = z.infer<typeof PrintTypeSearchSchema>

export const PrintTypeDetailSearchSchema = z.object({
  page: z.number().min(1).default(1).catch(1),
  limit: z.number().min(1).default(50).catch(50),
  searchText: z.string().optional(),
  statuses: z.array(z.nativeEnum(GMProductPrintTypeStatus)).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
})

export type PrintTypeDetailSearchType = z.infer<
  typeof PrintTypeDetailSearchSchema
>

export const PrintLocationDetailSearchSchema = z.object({
  page: z.number().min(1).default(1).catch(1),
  limit: z.number().min(1).default(50).catch(50),
  searchText: z.string().optional(),
  statuses: z.array(z.nativeEnum(GMPrintLocationStatus)).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
})

export type PrintLocationDetailSearchType = z.infer<
  typeof PrintLocationDetailSearchSchema
>
