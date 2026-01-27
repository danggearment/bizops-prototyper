import {
  GMAttributeStatus,
  GMAttributeValueStatus,
} from "@/services/connect-rpc/types"
import { z } from "zod"

export const AttributeTabSchema = z.enum(["group", "library"])

export const AttributesGroupSchema = z.object({
  page: z.number().min(1).default(1).catch(1),
  limit: z.number().min(1).default(50).catch(50),
  searchText: z.string().optional(),
  statuses: z.array(z.nativeEnum(GMAttributeStatus)).optional(),
})

export type AttributesGroupSearchType = z.infer<typeof AttributesGroupSchema>

export const AttributeGroupValueSchema = z.object({
  page: z.number().min(1).default(1).catch(1),
  limit: z.number().min(1).default(10).catch(10),
  searchText: z.string().optional(),
  statuses: z.array(z.nativeEnum(GMAttributeValueStatus)).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
})

export type AttributeGroupValueSearchType = z.infer<
  typeof AttributeGroupValueSchema
>

export const AttributeLibrarySchema = z.object({
  page: z.number().min(1).default(1).catch(1),
  limit: z.number().min(1).default(50).catch(50),
  searchText: z.string().optional(),
  statuses: z.array(z.nativeEnum(GMAttributeValueStatus)).optional(),
  attributeGroupKeys: z.array(z.string()).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
})

export type AttributeLibrarySearchType = z.infer<typeof AttributeLibrarySchema>

export const AttributeLibraryDetailSchema = z.object({
  page: z.number().min(1).default(1).catch(1),
  limit: z.number().min(1).default(50).catch(50),
  searchText: z.string().optional(),
})

export type AttributeLibraryDetailSearchType = z.infer<
  typeof AttributeLibraryDetailSchema
>
