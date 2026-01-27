import { useQueryPod } from "@/services/connect-rpc/transport"
import {
  GMProduct_TeamProductDetail,
  GMProduct_TeamProductDetail_Variant,
} from "@/services/connect-rpc/types"
import {
  staffGetProductDetail,
  staffListProductVariant,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { useParams } from "@tanstack/react-router"
import { createContext, useContext } from "react"

interface ProductDetailContextType {
  productDetail: GMProduct_TeamProductDetail
  loading: boolean
  variants: GMProduct_TeamProductDetail_Variant[]
  isLoadingVariants: boolean
  totalVariants: number
}

export const ProductDetailContext = createContext<ProductDetailContextType>({
  productDetail: new GMProduct_TeamProductDetail(),
  loading: false,
  variants: [],
  isLoadingVariants: false,
  totalVariants: 0,
})

interface Props {
  children: React.ReactNode
}

export const ProductDetailProvider = (props: Props) => {
  const { children } = props

  const { productId } = useParams({
    from: "/_authorize/product-management/products/$productId/",
  })

  const { data: productDetail, isLoading } = useQueryPod(
    staffGetProductDetail,
    {
      productId: productId,
    },
    {
      enabled: !!productId,
      select: (data) => data.data,
    },
  )

  const {
    data: variants = { data: [], totalVariants: 0 },
    isLoading: isLoadingVariants,
  } = useQueryPod(
    staffListProductVariant,
    {
      filter: {
        productIds: [productId],
      },
    },
    {
      enabled: !!productId,
      select: (data) => ({
        data: data.data,
        totalVariants: Number(data.paging?.total ?? 0),
      }),
    },
  )

  console.log(variants)

  const loading = isLoading

  return (
    <ProductDetailContext.Provider
      value={{
        productDetail: new GMProduct_TeamProductDetail(productDetail),
        loading,
        variants: variants.data,
        totalVariants: variants.totalVariants,
        isLoadingVariants,
      }}
    >
      {children}
    </ProductDetailContext.Provider>
  )
}
export const useProductDetail = () => {
  const context = useContext(ProductDetailContext)
  if (!context) {
    throw new Error(
      "useProductDetail must be used within a ProductDetailProvider",
    )
  }
  return context
}
