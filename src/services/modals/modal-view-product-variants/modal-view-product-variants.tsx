import VariantTable from "@/routes/_authorize/product-management/products/-components/variant-table/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@gearment/ui3"
import ProductVariantsFilter from "./components/filter"
import { useViewProductVariants } from "./modal-view-product-variants-store"
import {
  ProductVariantsProvider,
  useProductVariants,
} from "./product-variants-context"

export default function ModalViewProductVariants() {
  const { product } = useViewProductVariants()

  if (!product) {
    return null
  }

  return (
    <ProductVariantsProvider productId={product?.productId}>
      <ProductVariantsContent />
    </ProductVariantsProvider>
  )
}

const ProductVariantsContent = () => {
  const { open, actions, product } = useViewProductVariants()

  const { variants, loading, search, handleChangeSearch, total } =
    useProductVariants()

  const { productName } = product!

  const handleClose = () => {
    actions.onClose()
    handleChangeSearch({
      ...search,
      variantSearchText: "",
    })
  }

  const from = (search.page - 1) * search.limit + 1
  const to = Math.min(search.page * search.limit, total)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="min-w-[80vw] w-full">
        <DialogHeader>
          <DialogTitle>Variants for {productName}</DialogTitle>
          <DialogDescription>
            Showing {from}–{to} of {total} variants
          </DialogDescription>
        </DialogHeader>
        <ProductVariantsFilter />
        <div className="h-[400px] overflow-y-auto">
          <VariantTable
            variants={variants}
            loading={loading}
            handleChangeSearch={handleChangeSearch}
            search={search}
            total={total}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
