import { SellerProduct } from "@/schemas/schemas/seller-pricing"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@gearment/ui3"
import { CellContext } from "@tanstack/react-table"
import { Edit, Eye, MoreHorizontal, Power, PowerOff, Trash } from "lucide-react"

export default function CellActions({
  row,
}: CellContext<SellerProduct, unknown>) {
  const product = row.original
  const isActive = product.status === "active"

  const handleViewDetails = () => {
    // In production, navigate to product details or open a drawer
    console.log("View details:", product.productId)
  }

  const handleEditPricing = () => {
    // In production, open edit pricing modal/drawer
    console.log("Edit pricing:", product.productId)
  }

  const handleToggleStatus = () => {
    // In production, call API to toggle status
    console.log("Toggle status:", product.productId)
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem onClick={handleViewDetails}>
            <Eye className="h-4 w-4 mr-2" />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEditPricing}>
            <Edit className="h-4 w-4 mr-2" />
            Edit pricing
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleToggleStatus}>
            {isActive ? (
              <>
                <PowerOff className="h-4 w-4 mr-2" />
                Deactivate
              </>
            ) : (
              <>
                <Power className="h-4 w-4 mr-2" />
                Activate
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
