import { Checkbox } from "@gearment/ui3"
import { Row } from "@tanstack/react-table"
import {
  ProductGroup,
  useProductGroupStore,
} from "../modal-product-group-store"

export default function CellName({ row }: { row: Row<ProductGroup> }) {
  const { productGroup, actions } = useProductGroupStore()
  const productId = row.original.productId
  const product = productGroup.find(
    (product) => product.productId === productId,
  )

  const variantAvailable = product?.listRushVariant.filter(
    (variant) => !variant.disabled,
  )

  const isChecked =
    variantAvailable && variantAvailable?.length > 0
      ? variantAvailable.every((variant) => variant.selected)
      : false

  const selectedLength = product?.listRushVariant.filter(
    (variant) => variant.selected,
  ).length

  return (
    <div className="flex gap-2 items-center justify-start">
      <Checkbox
        checked={isChecked}
        onCheckedChange={() => {
          const selected = !isChecked
          product?.listRushVariant.forEach((variant) => {
            actions.updateSelected(
              productId,
              variant.variantId,
              selected && !variant.disabled,
            )
          })
        }}
      />
      <div className="flex flex-col gap-1">
        <div className="text-sm">
          <div className="font-medium">
            {row.original.productName} ({selectedLength}/
            {product?.listRushVariant.length})
          </div>
        </div>
        <div className="text-sm text-foreground/50">
          {row.original.productSku}
        </div>
      </div>
    </div>
  )
}
