import { ProductStatus } from "@/services/connect-rpc/types"

export const CategoryStatusOptions = [
  { label: "Active", value: ProductStatus.ACTIVE.toString() },
  { label: "Inactive", value: ProductStatus.INACTIVE.toString() },
]
