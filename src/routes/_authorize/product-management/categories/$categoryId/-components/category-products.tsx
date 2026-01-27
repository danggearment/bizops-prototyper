import { Button } from "@gearment/ui3"
import { PackagePlusIcon } from "lucide-react"
import { useCategoryDetail } from "../-category-detail-context"
import { ProductTable } from "./product-table"
import { ProductFilter } from "./pruduct-filter"

export function CategoryProducts() {
  const { category } = useCategoryDetail()
  return (
    <div className="bg-white rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-lg font-semibold">
            Linked Products – {category.categoryName}
          </p>
          <p className="text-sm text-foreground/60">
            Manage product assignments for this category
          </p>
        </div>
        <Button size="sm">
          <PackagePlusIcon size={14} /> Add Product
        </Button>
      </div>
      <ProductFilter />
      <ProductTable />
    </div>
  )
}
