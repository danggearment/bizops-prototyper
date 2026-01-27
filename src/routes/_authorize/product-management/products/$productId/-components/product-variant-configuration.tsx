import { cn } from "@/utils"
import { Button } from "@gearment/ui3"
import { ChevronDown, Settings } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useProductDetail } from "../-product-detail-context"

export function ProductVariantConfiguration() {
  const { productDetail } = useProductDetail()
  const [viewMoreColors, setViewMoreColors] = useState(false)
  const [colorsOverflow, setColorsOverflow] = useState(false)
  const colorsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = colorsContainerRef.current
    if (!node) return

    function checkOverflow() {
      // Only check overflow when not viewing more
      if (!viewMoreColors) {
        setColorsOverflow((node?.scrollHeight ?? 0) > 100)
      } else {
        setColorsOverflow(false)
      }
    }
    checkOverflow()
    const resizeObserver = new window.ResizeObserver(() => {
      checkOverflow()
    })
    resizeObserver.observe(node)
    return () => {
      resizeObserver.disconnect()
    }
  }, [productDetail.colors, viewMoreColors])

  return (
    <div className="p-4 rounded-md bg-background">
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Settings className="size-5 text-primary" />
            <p className="text-lg font-medium">Variant configuration</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Variant combinations are automatically generated based on selected
            options
          </p>
        </div>
        {!!productDetail.colors.length || !!productDetail.sizes.length ? (
          <>
            <div className="rounded-lg border border-border p-4 space-y-2">
              <p className="font-medium">Colors</p>
              <div className="space-y-4">
                <div
                  className={cn(
                    "flex flex-wrap gap-2 transition-all h-auto duration-500 overflow-hidden",
                    !viewMoreColors ? "max-h-[100px]" : "max-h-[2000px]",
                  )}
                  ref={colorsContainerRef}
                >
                  {productDetail.colors.length > 0 ? (
                    productDetail.colors.map((color, index) => (
                      <div
                        key={color.code + color.value + color.name + index}
                        className="text-sm text-muted-foreground font-medium bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1"
                      >
                        <div
                          className="size-5 rounded-full border border-border"
                          style={{ backgroundColor: `#${color.value}` }}
                        />
                        <div className="text-sm text-muted-foreground font-medium bg-gray-100 rounded-full">
                          {color.name}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground font-medium">
                      Product doesn&apos;t have any colors. Please add some
                      colors to the product.
                    </div>
                  )}
                </div>
                {productDetail.colors.length > 0 &&
                  (colorsOverflow || viewMoreColors) && (
                    <Button
                      variant="outline"
                      className="mx-auto flex items-center gap-1 w-[170px]"
                      onClick={() => setViewMoreColors(!viewMoreColors)}
                    >
                      <ChevronDown
                        className={cn(
                          "size-4 transition-all duration-500",
                          viewMoreColors ? "rotate-180" : "",
                        )}
                      />
                      {viewMoreColors ? "View less colors" : "View all colors"}
                    </Button>
                  )}
              </div>
            </div>
            <div className="rounded-lg border border-border p-4 space-y-2">
              <p className="font-medium">Sizes</p>
              <div className="flex flex-wrap gap-2">
                {productDetail.sizes.length > 0 ? (
                  productDetail.sizes.map((size, index) => (
                    <div
                      key={size.code + size.value + size.name + index}
                      className="text-sm text-muted-foreground font-medium bg-gray-100 px-2 py-1 rounded-full min-w-18 text-center"
                    >
                      <p className="text-sm font-medium">{size.name}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground font-medium">
                    Product doesn&apos;t have any sizes. Please add some sizes
                    to the product.
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          "No variant configuration found"
        )}
      </div>
    </div>
  )
}
