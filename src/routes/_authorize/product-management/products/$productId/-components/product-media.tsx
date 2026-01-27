import Image from "@/components/common/image/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@gearment/ui3"
import { ImageIcon } from "lucide-react"
import { useState } from "react"
import { useProductDetail } from "../-product-detail-context"
import { buildCategoryTree, Category, findAllLeafPaths } from "./helper"

export function ProductMedia() {
  const { productDetail } = useProductDetail()

  const categoryTree = buildCategoryTree(productDetail.categories)

  return (
    <div className="p-4 rounded-md bg-background">
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            <p className="text-lg font-medium">Product Media</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Product images displayed on your storefront.
          </p>
        </div>
        {categoryTree.length > 0 ? (
          <CategoryTabs categories={categoryTree} />
        ) : (
          <p className="text-sm text-muted-foreground">
            No categories available.
          </p>
        )}
      </div>
    </div>
  )
}

function CategoryTabs({ categories }: { categories: Category[] }) {
  const leafPaths = findAllLeafPaths(categories)
  const firstPathId = leafPaths[0]?.pathId ?? ""
  const [activeTab, setActiveTab] = useState<string>(firstPathId)

  if (leafPaths.length === 0) return null

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-2">
        {leafPaths.map((leafPath) => {
          const breadcrumb = leafPath.path
            .map((cat) => cat.categoryName || `Category ${cat.categoryId}`)
            .join(" > ")

          return (
            <TabsTrigger
              key={leafPath.pathId}
              value={leafPath.pathId}
              className="min-w-40"
            >
              {breadcrumb}
            </TabsTrigger>
          )
        })}
      </TabsList>
      {leafPaths.map((leafPath) => {
        return (
          <TabsContent key={leafPath.pathId} value={leafPath.pathId}>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1 border border-border rounded-md p-4">
                <p className="font-semibold">Primary image</p>
                <Image
                  url={leafPath.leaf.productAvatarUrl}
                  height={400}
                  responsive="h"
                />
              </div>
              <div className="col-span-1 border border-border rounded-md p-4">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">Hover image</p>
                  <p className="text-sm text-muted-foreground">
                    Shown on hover in Next App
                  </p>
                </div>
                <Image
                  url={leafPath.leaf.productAvatarHoverUrl}
                  height={400}
                  responsive="h"
                />
              </div>
              <div className="col-span-2 border border-border rounded-md p-4 space-y-4">
                <p className="font-semibold">Gallery images</p>
                <div className="h-40">
                  <div className="flex flex-col items-center justify-center h-full text-md text-muted-foreground text-center gap-2">
                    <ImageIcon className="size-12 mx-auto" />
                    No gallery images uploaded yet.
                  </div>
                </div>
                <p className="text-sm text-muted-foreground/80">
                  Images shown here are used as main visuals for this product on
                  Next App.
                </p>
              </div>
            </div>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
