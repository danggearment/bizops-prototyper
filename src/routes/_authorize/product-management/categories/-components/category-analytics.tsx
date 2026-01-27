import { cn } from "@gearment/ui3"
import { Box, FolderTree, Package } from "lucide-react"
import { useMemo } from "react"
import { useCategoryManagement } from "../-category-management-context"

export function CategoryAnalytics() {
  const { totalAnalytics } = useCategoryManagement()

  const analytics = useMemo(() => {
    return [
      {
        id: "total-categories",
        label: "Total categories",
        count: totalAnalytics.totalCategory,
        bgColor: "bg-primary/10",
        icon: <FolderTree className="h-6 w-6 text-primary" />,
      },
      {
        id: "active-categories",
        label: "Active categories",
        count: totalAnalytics.totalActiveCategory,
        bgColor: "bg-success-foreground/10",
        icon: <Box className="h-6 w-6 text-success-foreground" />,
      },
      {
        id: "linked-products",
        label: "Linked products",
        count: totalAnalytics.totalLinkedProduct,
        bgColor: "bg-blue-600/10",
        icon: <Package className="h-6 w-6 text-blue-600" />,
      },
    ]
  }, [totalAnalytics])

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {analytics.map((item) => (
          <div key={item.id} className="p-5 bg-white rounded-md cursor-pointer">
            <div className="flex items-center gap-4">
              <div className={cn(item.bgColor, "rounded-xl p-3")}>
                {item.icon}
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {item.count}
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  {item.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
