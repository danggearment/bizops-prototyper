import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@gearment/ui3"
import { FileTextIcon } from "lucide-react"
import { useProductDetail } from "../-product-detail-context"
import { handleHTMLUnescape } from "./helper"
import { TableProductShipping } from "./product-shipping"
import { TableProductSizeGuideline } from "./product-sizeguideline"

export function ProductDescriptionSpecification() {
  const { productDetail } = useProductDetail()

  return (
    <div className="p-4 rounded-md bg-background">
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5 text-primary" />
            <p className="text-lg font-medium">
              Product description & specification
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Detailed product information for customers and manufacturing teams
          </p>
        </div>
        <Accordion
          type="multiple"
          defaultValue={["item-1", "item-2"]}
          className="space-y-4 pb-5"
        >
          <AccordionItem
            value="item-1"
            className="px-4 rounded-lg bg-background-secondary border border-border"
          >
            <AccordionTrigger>
              <div className="text-base font-medium">Shipping services</div>
            </AccordionTrigger>
            <AccordionContent>
              {productDetail.shippingPolicies.length > 0 ? (
                <TableProductShipping
                  shippingPolicies={productDetail.shippingPolicies}
                />
              ) : (
                <div className="text-sm text-muted-foreground">
                  No shipping policy found
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-2"
            className="px-4 rounded-lg bg-background-secondary border border-border"
          >
            <AccordionTrigger>
              <div className="text-base font-medium">Size Guideline</div>
            </AccordionTrigger>
            <AccordionContent>
              {productDetail.sizeGuides.length > 0 ? (
                <TableProductSizeGuideline
                  product={productDetail.sizeGuides?.[0] ?? []}
                />
              ) : (
                <div className="text-sm text-muted-foreground">
                  No size guideline found
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-3"
            className="px-4 rounded-lg bg-background-secondary border border-border !border-b-1"
          >
            <AccordionTrigger>
              <div className="text-base font-medium">
                File & Artwork Guideline
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div
                dangerouslySetInnerHTML={{
                  __html: handleHTMLUnescape(productDetail.fileGuidelines),
                }}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
