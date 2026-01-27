import { cn } from "@gearment/ui3"
import { EarthIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import { useMemo } from "react"
import { useProductDetail } from "../-product-detail-context"

export function ProductExternalVisibility() {
  const { productDetail } = useProductDetail()

  const externalVisibility = useMemo(() => {
    return [
      {
        id: "website",
        label: "Website visibility",
        value: productDetail.isWebsiteVisible,
      },
      {
        id: "next-app",
        label: "Next App visibility",
        value: productDetail.isNaVisible,
      },
      {
        id: "next-app-order-creation",
        label: "Order creation",
        value: productDetail.isOrderCreation,
      },
      {
        id: "next-app-product-creation",
        label: "Next App product creation",
        value: productDetail.isNaSellerProductCreation,
      },
    ]
  }, [productDetail])
  return (
    <div className="p-4 rounded-md bg-background">
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <EarthIcon className="size-5 text-primary" />
            <p className="text-lg font-medium">External visibility</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Control product visibility across Website, Next App, and order
            creation channels.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {externalVisibility.map((item) => (
            <div key={item.id}>
              <div className="space-y-2 flex items-start flex-col">
                <p className="font-medium">{item.label}</p>
                <div
                  className={cn(
                    "text-sm text-muted-foreground font-medium py-1 px-2 rounded-full flex items-center gap-2",
                    item.value
                      ? "text-primary bg-primary/10"
                      : "text-destructive bg-destructive/10",
                  )}
                >
                  {item.value ? (
                    <EyeIcon className="size-4 text-primary" />
                  ) : (
                    <EyeOffIcon className="size-4 text-destructive" />
                  )}

                  {item.value ? "Visible" : "Hidden"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
