import {
  PricingSourceColor,
  PricingSourceLabel,
  PricingSourceTooltip,
  ProductStatusColor,
  ProductStatusLabel,
} from "@/constants/seller-pricing"
import { SellerVariant } from "@/schemas/schemas/seller-pricing"
import {
  Badge,
  Button,
  ButtonIconCopy,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@gearment/ui3"
import { Edit, Eye, HelpCircle, MoreHorizontal } from "lucide-react"

interface Props {
  variant: SellerVariant
  isLast: boolean
}

export default function VariantRow({ variant, isLast }: Props) {
  const handleViewBreakdown = () => {
    console.log("View breakdown:", variant.variantId)
  }

  const handleEditOverride = () => {
    console.log("Edit override:", variant.variantId)
  }

  // Format options as string
  const optionsString = Object.entries(variant.options)
    .map(([key, value]) => `${key}: ${value}`)
    .join(" / ")

  return (
    <tr
      className={`bg-muted/30 hover:bg-muted/50 transition-colors ${
        !isLast ? "border-b border-border/50" : ""
      }`}
    >
      {/* Empty cells for expand and select columns */}
      <td className="w-10" />
      <td className="w-10" />

      {/* SKU */}
      <td className="py-3 px-4">
        <div className="pl-4 border-l-2 border-muted-foreground/20">
          <div className="flex items-center gap-1">
            <span className="font-mono text-sm">{variant.sku}</span>
            <ButtonIconCopy copyValue={variant.sku} size="sm" />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {optionsString}
          </p>
        </div>
      </td>

      {/* Empty cell for product type column alignment */}
      <td className="py-3 px-4" />

      {/* RSP */}
      <td className="py-3 px-4">
        <span className="tabular-nums text-sm font-medium">
          ${variant.rsp.toFixed(2)}
        </span>
      </td>

      {/* Pricing Source */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-1">
          <Badge
            variant="secondary"
            className={`${PricingSourceColor[variant.pricingSource]} border-0 text-xs`}
          >
            {PricingSourceLabel[variant.pricingSource]}
          </Badge>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[240px]">
              <p className="text-xs">
                {PricingSourceTooltip[variant.pricingSource]}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </td>

      {/* Status */}
      <td className="py-3 px-4">
        <Badge
          variant="secondary"
          className={`${ProductStatusColor[variant.status]} border-0 text-xs`}
        >
          {ProductStatusLabel[variant.status]}
        </Badge>
      </td>

      {/* Final Seller Price with formula hint */}
      <td className="py-3 px-4">
        <div>
          <span className="tabular-nums text-sm font-semibold text-green-700">
            ${variant.finalSellerPrice.toFixed(2)}
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-xs text-muted-foreground cursor-help">
                {variant.tierDiscount > 0 && `-${variant.tierDiscount}%`}
                {variant.customDiscount > 0 && ` -${variant.customDiscount}%`}
                {variant.fixedAddons > 0 &&
                  ` +$${variant.fixedAddons.toFixed(2)}`}
              </p>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[320px]">
              <div className="text-xs space-y-1">
                <p className="font-semibold">Price Calculation:</p>
                <p>RSP × (1 − Tier − Custom) + Add-ons</p>
                <p className="text-muted-foreground">
                  ${variant.rsp.toFixed(2)} × (1 − {variant.tierDiscount}% −{" "}
                  {variant.customDiscount}%) + ${variant.fixedAddons.toFixed(2)}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
      </td>

      {/* Actions */}
      <td className="py-3 px-4">
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-3.5 w-3.5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuItem onClick={handleViewBreakdown}>
                <Eye className="h-4 w-4 mr-2" />
                View breakdown
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEditOverride}>
                <Edit className="h-4 w-4 mr-2" />
                Edit override
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  )
}
