import { ProductStatus } from "@/services/connect-rpc/types"
import { cn } from "@gearment/ui3"
import { CircleAlert, CircleCheckBig, CircleX, Package } from "lucide-react"
import { useMemo } from "react"
import { useProductManagement } from "../-product-management-context"

export default function ProductAnalytics() {
  const { productAnalytics, totalAnalytics } = useProductManagement()

  const getProductCount = (status?: ProductStatus) => {
    if (status === undefined) {
      return productAnalytics.reduce((acc, item) => acc + Number(item.count), 0)
    }
    return productAnalytics.find((item) => item.status === status)?.count || 0
  }

  const analytics = useMemo(() => {
    return [
      {
        id: "total-products",
        label: "Total products",
        count: totalAnalytics,
        icon: (
          <Icon
            icon={<Package className="size-8 text-primary" />}
            bgColor="bg-primary/10"
          />
        ),
      },
      {
        id: "active-products",
        label: "Active products",
        count: getProductCount(ProductStatus.ACTIVE),
        icon: (
          <Icon
            icon={<CircleCheckBig className="size-8 text-success-foreground" />}
            bgColor="bg-success-foreground/10"
          />
        ),
      },
      {
        id: "inactive-products",
        label: "Inactive products",
        count: getProductCount(ProductStatus.INACTIVE),
        icon: (
          <Icon
            icon={<CircleX className="size-8 text-error-foreground" />}
            bgColor="bg-error-foreground/10"
          />
        ),
      },
      {
        id: "draft-products",
        label: "Draft products",
        count: getProductCount(ProductStatus.DRAFT),
        icon: (
          <Icon
            icon={<CircleAlert className="size-8 text-warning-foreground" />}
            bgColor="bg-warning-foreground/10"
          />
        ),
      },
    ]
  }, [productAnalytics])

  return (
    <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
      {analytics.map((item) => (
        <div
          className="col-span-1 rounded-md p-4 bg-background border"
          key={item.id}
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <div className="">
              <div className="text-lg font-bold">{item.count}</div>
              <div className="font-medium text-foreground/50">{item.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const Icon = ({
  icon,
  bgColor,
}: {
  icon: React.ReactNode
  bgColor: string
}) => {
  return (
    <div
      className={cn(
        "size-14 rounded-full flex items-center justify-center min-w-14",
        bgColor,
      )}
    >
      {icon}
    </div>
  )
}
