import { AllPlatform } from "@/constants/platform"
import { ProductStockStatus } from "@/constants/product"
import {
  GMProductVariantStatus,
  ProductStatus,
} from "@/services/connect-rpc/types"
import { RushProductGroupStatus } from "@gearment/nextapi/api/pod/v1/product_admin_pb"
import { z } from "zod"

export const SyncCatalogSchema = z.object({
  from: z.date({
    required_error: "Date is required",
  }),
  to: z.date({
    required_error: "Date is required",
  }),
})

export type SyncCatalogFormData = z.infer<typeof SyncCatalogSchema>

export const CreateProductGroupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  quantity: z.number().min(1, "Quantity is required"),
  description: z.string().optional(),
  platforms: z.array(z.nativeEnum(AllPlatform)).min(1, "Platform is required"),
  status: z.nativeEnum(RushProductGroupStatus),
})

export type CreateProductGroupFormData = z.infer<
  typeof CreateProductGroupSchema
>

export const ProductSearchSchema = z.object({
  page: z.number().min(1).default(1).catch(1),
  limit: z.number().min(1).default(50).catch(50),
  statuses: z.array(z.nativeEnum(ProductStatus)).optional(),
  searchText: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  sortBy: z.array(z.string()).optional(),
  sortDirection: z.array(z.string()).optional(),
})

export type ProductSearchType = z.infer<typeof ProductSearchSchema>

export const ProductVariantsSearchSchema = z.object({
  page: z.number().min(1).default(1).catch(1),
  limit: z.number().min(1).default(100).catch(100),
  statuses: z.array(z.nativeEnum(GMProductVariantStatus)).optional(),
  variantSearchText: z.string().optional(),
  sortBy: z.array(z.string()).optional(),
  sortDirection: z.array(z.string()).optional(),
  stockStatus: z
    .nativeEnum(ProductStockStatus)
    .optional()
    .default(ProductStockStatus.ALL)
    .catch(ProductStockStatus.ALL),
  from: z.string().optional(),
  to: z.string().optional(),
  productIds: z.array(z.string()).optional(),
})

export type ProductVariantsSearchType = z.infer<
  typeof ProductVariantsSearchSchema
>
