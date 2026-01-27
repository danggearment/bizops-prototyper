import Image from "@/components/common/image/image"
import { GMProductFulfillmentChannelLabel } from "@/constants/product"
import { format } from "date-fns"
import { useMemo } from "react"
import { useProductDetail } from "../-product-detail-context"
import { buildCategoryTree, findAllLeafPaths } from "./helper"

export function ProductInformation() {
  const { productDetail } = useProductDetail()
  const { fulfillmentChannel, sku, categories, createdAt, updatedAt } =
    productDetail

  const categoryTree = useMemo(
    () => buildCategoryTree(categories),
    [categories],
  )
  const leafPaths = useMemo(
    () => findAllLeafPaths(categoryTree),
    [categoryTree],
  )

  const categoriesDisplay = useMemo(() => {
    return leafPaths.map((path) => {
      const breadcrumb = path.path
        .map((cat) => cat.categoryName || `Category ${cat.categoryId}`)
        .join(" > ")
      return {
        breadcrumb,
        nodeCount: path.path.length,
      }
    })
  }, [leafPaths])

  const information = useMemo(() => {
    return [
      {
        label: "SKU",
        value: sku,
      },
      {
        label: "Fulfillment type",
        value: GMProductFulfillmentChannelLabel[fulfillmentChannel],
      },
      {
        label: "Vendor",
        value: "--",
      },
      {
        label: "Categories",
        value: categoriesDisplay.map((item, index) => (
          <p
            key={index}
            className={item.nodeCount > 2 ? "block w-full" : "inline"}
          >
            {item.breadcrumb}
            {index < categoriesDisplay.length - 1 ? ", " : ""}
          </p>
        )),
      },
      {
        label: "Created at",
        value: createdAt ? format(createdAt.toDate(), "MMM dd, yyyy") : "--",
      },
      {
        label: "Updated at",
        value: updatedAt ? format(updatedAt.toDate(), "MMM dd, yyyy") : "--",
      },
    ]
  }, [sku, fulfillmentChannel, categoriesDisplay, createdAt, updatedAt])

  return (
    <div className="space-y-4 p-4 rounded-md bg-background">
      <div className="grid grid-cols-[200px_1fr] gap-4">
        <div className="rounded-lg overflow-hidden">
          <Image
            url={productDetail.avatarUrl || ""}
            width={200}
            responsive="w"
          />
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {information.map((item) => (
              <div className="space-y-1" key={item.label}>
                <p className="text-muted-foreground/80 uppercase">
                  {item.label}
                </p>
                <p className="font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
