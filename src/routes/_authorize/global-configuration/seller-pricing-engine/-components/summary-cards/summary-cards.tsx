import { Tooltip, TooltipContent, TooltipTrigger } from "@gearment/ui3"
import { HelpCircle, Package, Percent, Settings, Tags } from "lucide-react"
import { useSellerPricing } from "../../-seller-pricing-context"

interface SummaryCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  tooltip?: string
}

function SummaryCard({ title, value, icon, tooltip }: SummaryCardProps) {
  return (
    <div className="bg-background border border-border rounded-lg p-4 flex items-start justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[240px]">
                <p className="text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <p className="text-2xl font-bold tabular-nums">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>
      <div className="p-2 bg-muted rounded-md">{icon}</div>
    </div>
  )
}

export default function SummaryCards() {
  const { summaryStats } = useSellerPricing()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
      <SummaryCard
        title="Total Products"
        value={summaryStats.totalProducts}
        icon={<Package className="h-5 w-5 text-muted-foreground" />}
        tooltip="Total number of products with pricing configuration"
      />
      <SummaryCard
        title="Total Variants"
        value={summaryStats.totalVariants}
        icon={<Tags className="h-5 w-5 text-muted-foreground" />}
        tooltip="Total variants across all products"
      />
      <SummaryCard
        title="Inherited Pricing"
        value={summaryStats.inheritedPricing}
        icon={<Settings className="h-5 w-5 text-muted-foreground" />}
        tooltip="These variants automatically update when the product RSP changes."
      />
      <SummaryCard
        title="Pricing Overrides"
        value={summaryStats.pricingOverrides}
        icon={<Percent className="h-5 w-5 text-muted-foreground" />}
        tooltip="These variants do not follow product-level RSP updates."
      />
    </div>
  )
}
