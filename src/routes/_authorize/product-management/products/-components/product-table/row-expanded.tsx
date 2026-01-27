import {
  GMProduct_Admin_Short,
  GMProduct_Admin_Variant_Short,
} from "@/services/connect-rpc/types"
import { useViewProductVariants } from "@/services/modals/modal-view-product-variants"
import { Button, TableCell, TableRow } from "@gearment/ui3"
import { ChevronDown } from "lucide-react"
import VariantTable from "../variant-table/table"

interface Props {
  colSpan: number
  variants: GMProduct_Admin_Variant_Short[]
  product: GMProduct_Admin_Short
  loading: boolean
  totalVariants: number
  maxVariantsToShow: number
}

export default function RowExpanded(props: Props) {
  const {
    colSpan,
    variants,
    product,
    loading,
    totalVariants,
    maxVariantsToShow,
  } = props
  const { actions } = useViewProductVariants()

  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="py-6 !px-4 bg-gray-50">
        <div className="space-y-2">
          <div className="text-lg font-medium">
            Variants for {product.productName}
          </div>
          <p className="text-sm text-gray-500">
            Manage variants, pricing, and inventory for this product
          </p>
          <div className="bg-background rounded-lg p-4">
            <VariantTable
              variants={variants.slice(0, maxVariantsToShow)}
              loading={loading}
            />
          </div>
          {totalVariants > maxVariantsToShow && (
            <Button
              variant="outline"
              className="mx-auto mt-4 flex items-center gap-1"
              onClick={() => {
                actions.onOpen({ product })
              }}
            >
              <ChevronDown className="size-4" />
              See more ({totalVariants - maxVariantsToShow} more)
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}
