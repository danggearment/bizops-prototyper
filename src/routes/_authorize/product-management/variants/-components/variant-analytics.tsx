import { cn } from "@gearment/ui3"
import { CircleAlert, CircleCheckBig, CircleX, Package } from "lucide-react"
import { useMemo } from "react"
import { useVariantManagement } from "../-variant-management-context"

export default function VariantAnalytics() {
  const { variantAnalytics, lowStockThreshHold } = useVariantManagement()

  const analytics = useMemo(() => {
    return [
      {
        id: "total-variant",
        label: "Total variants",
        count: variantAnalytics?.totalVariants,
        icon: (
          <Icon
            icon={<Package className="size-8 text-primary" />}
            bgColor="bg-primary/10"
          />
        ),
      },
      {
        id: "active-variant",
        label: "Active variants",
        count: variantAnalytics?.activeVariants,
        icon: (
          <Icon
            icon={<CircleCheckBig className="size-8 text-success-foreground" />}
            bgColor="bg-success-foreground/10"
          />
        ),
      },
      {
        id: "inactive-variant",
        label: "Inactive variants",
        count: variantAnalytics?.inactiveVariants,
        icon: (
          <Icon
            icon={<CircleX className="size-8 text-error-foreground" />}
            bgColor="bg-error-foreground/10"
          />
        ),
      },
      {
        id: "low-stock-variant",
        label: `Low stock (<${lowStockThreshHold})`,
        count: variantAnalytics?.lowStockVariants,
        icon: (
          <Icon
            icon={<CircleAlert className="size-8 text-warning-foreground" />}
            bgColor="bg-warning-foreground/10"
          />
        ),
      },
    ]
  }, [variantAnalytics])

  return (
    <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
      {analytics.map((item) => (
        <div className="col-span-1 rounded-md p-4 bg-background" key={item.id}>
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
