import { formatNumber } from "@gearment/utils"
import { BarChart3, Boxes, CheckCircle2, Layers, XCircle } from "lucide-react"
import { useMemo } from "react"
import { useProductDetail } from "../-product-detail-context"

export function ProductAnalytics() {
  const { productDetail } = useProductDetail()

  const analytics = useMemo(() => {
    return [
      {
        id: "total-variants",
        label: "Total Variants",
        value: productDetail.totalVariants,
        icon: <Layers className="h-6 w-6 text-primary" />,
      },
      {
        id: "total-stock",
        label: "Total Stock",
        value: productDetail.totalStockQuantity,
        icon: <Boxes className="h-6 w-6 text-blue-500" />,
      },
      {
        id: "total-active",
        label: "Total Active",
        value: productDetail.totalActiveVariants,
        icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
      },
      {
        id: "total-inactive",
        label: "Total Inactive",
        value: productDetail.totalInactiveVariants,
        icon: <XCircle className="h-6 w-6 text-warning-foreground" />,
      },
    ]
  }, [productDetail])

  return (
    <div className="p-4 rounded-md bg-background">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        <p className="text-lg font-medium">Statistics</p>
      </div>
      <p className="text-sm text-muted-foreground mt-1">
        Key performance indicators for this product
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {analytics.map((item) => (
          <div
            className="p-4 rounded-md bg-background border border-border space-y-2 flex flex-col items-start"
            key={item.id}
          >
            <div className="flex items-center gap-2">
              <div>{item.icon}</div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                {item.label}
              </p>
            </div>
            <p className="text-2xl font-medium tabular-nums">
              {formatNumber(Number(item.value))}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
