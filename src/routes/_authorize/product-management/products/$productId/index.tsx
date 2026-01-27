import { mappingColor, ProductStatusColorsMapping } from "@/constants/map-color"
import { ProductStatusLabel } from "@/constants/product"
import ModalViewProductVariants from "@/services/modals/modal-view-product-variants/modal-view-product-variants"
import { Badge, Button, PageHeader } from "@gearment/ui3"
import { createFileRoute, Link, useRouterState } from "@tanstack/react-router"
import { ArrowLeftIcon } from "lucide-react"
import { ProductActions } from "./-components/product-actions"
import { ProductAnalytics } from "./-components/product-analytics"
import { ProductDescription } from "./-components/product-description"
import { ProductDescriptionSpecification } from "./-components/product-description-specification"
import { ProductExternalVisibility } from "./-components/product-external-visibility"
import { ProductInformation } from "./-components/product-information"
import { ProductMedia } from "./-components/product-media"
import { ProductVariantConfiguration } from "./-components/product-variant-configuration"
import { ProductVariantSummary } from "./-components/product-variant-summary"
import {
  ProductDetailProvider,
  useProductDetail,
} from "./-product-detail-context"

export const Route = createFileRoute(
  "/_authorize/product-management/products/$productId/",
)({
  beforeLoad: async ({ params: { productId } }) => {
    return {
      breadcrumb: [
        {
          name: "Product management",
          link: "/product-management",
        },
        {
          name: "Products",
          link: "/product-management/products",
        },
        {
          name: productId,
          link: "/product-management/products/$productId",
        },
      ],
    }
  },
  component: () => (
    <ProductDetailProvider>
      <Index />
    </ProductDetailProvider>
  ),
})

function Index() {
  const callbackHistory = useRouterState({
    select: (state) => state.location.state,
  })
  const { productDetail } = useProductDetail()
  const { status } = productDetail

  return (
    <div>
      <PageHeader>
        <div className="flex items-center justify-between w-full gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Link
              to={callbackHistory.href || "/product-management/prints/location"}
              className="inline-flex items-center gap-2"
            >
              <Button variant="outline" size="icon" className="p-0">
                <ArrowLeftIcon size={14} />
              </Button>
            </Link>
            <div>
              <PageHeader.Title>
                <div className="flex items-center gap-2">
                  {productDetail.name}
                  <Badge
                    variant={mappingColor(ProductStatusColorsMapping, status)}
                  >
                    {ProductStatusLabel[status]}
                  </Badge>
                </div>
              </PageHeader.Title>
            </div>
          </div>
          <ProductActions />
        </div>
      </PageHeader>
      <div className="space-y-4 mb-4">
        <ProductInformation />
        <ProductAnalytics />
        <ProductVariantSummary />
        <ProductVariantConfiguration />
        <ProductDescription />
        <ProductMedia />
        <ProductDescriptionSpecification />
        <ProductExternalVisibility />
      </div>
      <ModalViewProductVariants />
    </div>
  )
}
