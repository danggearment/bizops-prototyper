import { DateTime } from "@/components/common/date-time"
import { Badge } from "@gearment/ui3"
import { useCategoryDetail } from "../-category-detail-context"

export function CategoryInformation() {
  const { category } = useCategoryDetail()

  const info = [
    {
      id: "category-name",
      label: "Category name",
      value: category.categoryName,
    },
    {
      id: "parent-category",
      label: "Parent category",
      value: category.parentName || (
        <i className="text-foreground/40 text-sm">Not set</i>
      ),
    },
    {
      id: "display-name",
      label: "Display name",
      value: category.internalCategoryName || (
        <i className="text-foreground/40 text-sm">Not set</i>
      ),
    },
    {
      id: "display-order",
      label: "Display order",
      value: category.displayOrder,
    },
    {
      id: "slug",
      label: "Slug",
      value: category.categoryCode,
    },
    {
      id: "created-at",
      label: "Created at",
      value: category.createdAt ? (
        <DateTime date={category.createdAt.toDate()} />
      ) : (
        "N/A"
      ),
    },
    {
      id: "status",
      label: "Status",
      value: (
        <div className="flex items-center gap-2">
          <Badge variant={category.isActive ? "success" : "warning"}>
            {category.isActive ? "Active" : "Inactive"}
          </Badge>
          <span className="text-sm text-foreground/40">
            Category is visible to customers
          </span>
        </div>
      ),
    },
    {
      id: "last-updated",
      label: "Last updated",
      value: category.updatedAt ? (
        <DateTime date={category.updatedAt.toDate()} />
      ) : (
        "N/A"
      ),
    },
    {
      id: "description",
      label: "Description",
      value: category.description,
    },
  ]

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="text-lg font-semibold mb-2">Category information</div>
      <div className="grid grid-cols-2 gap-4">
        {info.map((item) => (
          <div className="col-span-1 flex items-center gap-2" key={item.id}>
            <p className="text-foreground/60 w-[200px]">{item.label}</p>
            <p>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
