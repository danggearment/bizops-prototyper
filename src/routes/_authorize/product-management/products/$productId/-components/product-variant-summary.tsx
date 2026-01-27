import { GMProduct_Admin_Short } from "@/services/connect-rpc/types"
import { useViewProductVariants } from "@/services/modals/modal-view-product-variants"
import { Button } from "@gearment/ui3"
import { ChevronDown, Package } from "lucide-react"
import { useProductDetail } from "../-product-detail-context"
import VariantTable from "../../-components/variant-table/table"

const MAX_VARIANTS_TO_SHOW = 5

export function ProductVariantSummary() {
  const { variants, isLoadingVariants, totalVariants, productDetail } =
    useProductDetail()
  const { actions } = useViewProductVariants()

  return (
    <div className="p-4 rounded-md bg-background">
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Package className="size-5 text-primary" />
            <p className="text-lg font-medium">Variant summary</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage variants, pricing, and inventory for this product
          </p>
        </div>
        <VariantTable
          variants={variants.slice(0, MAX_VARIANTS_TO_SHOW)}
          loading={isLoadingVariants}
        />
        {totalVariants > MAX_VARIANTS_TO_SHOW && (
          <Button
            variant="outline"
            className="mx-auto flex items-center gap-1"
            onClick={() => {
              actions.onOpen({
                product: new GMProduct_Admin_Short({
                  ...productDetail,
                  productId: productDetail.productId,
                  productName: productDetail.name,
                }),
              })
            }}
          >
            <ChevronDown className="size-4" />
            See more ({totalVariants - MAX_VARIANTS_TO_SHOW} more)
          </Button>
        )}
      </div>
    </div>
  )
}
