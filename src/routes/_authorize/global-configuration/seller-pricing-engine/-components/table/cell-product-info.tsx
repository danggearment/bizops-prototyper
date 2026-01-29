import { SellerProduct } from "@/schemas/schemas/seller-pricing"
import { ButtonIconCopy } from "@gearment/ui3"

interface Props {
  product: SellerProduct
}

export default function CellProductInfo({ product }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0">
        <img
          src={product.productImage}
          alt={product.productName}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="min-w-0">
        <p className="font-medium text-sm truncate" title={product.productName}>
          {product.productName}
        </p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="truncate">{product.productCode}</span>
          <ButtonIconCopy copyValue={product.productCode} size="sm" />
        </div>
      </div>
    </div>
  )
}
