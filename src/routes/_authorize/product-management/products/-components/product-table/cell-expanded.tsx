import {
  GMProduct_Admin_Short,
  StaffListProductVariantResponse,
} from "@/services/connect-rpc/types"
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@gearment/ui3"
import { Row } from "@tanstack/react-table"
import { ChevronDown, ChevronRight } from "lucide-react"

interface Props {
  row: Row<GMProduct_Admin_Short>
  setVariantsData: (
    data: React.SetStateAction<Record<string, StaffListProductVariantResponse>>,
  ) => void
  setLoadingVariants: (
    data: React.SetStateAction<Record<string, boolean>>,
  ) => void
  loadingVariants: Record<string, boolean>
}

export default function CellExpanded(props: Props) {
  const { row, setVariantsData, setLoadingVariants, loadingVariants } = props
  const { totalVariants, productId } = row.original

  const disabled = !totalVariants || loadingVariants[productId]
  return (
    <TooltipToggleExpandedButton disabled={disabled}>
      <Button
        onClick={() => {
          row.toggleExpanded()

          if (row.getIsExpanded()) {
            setVariantsData((prev) => {
              const updated = { ...prev }
              delete updated[productId]
              return updated
            })
          }

          setLoadingVariants((prev) => ({
            ...prev,
            [productId]: !row.getIsExpanded(),
          }))
        }}
        disabled={disabled}
        variant="outline"
        className="cursor-pointer"
        size="icon"
      >
        {row.getIsExpanded() ? (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
      </Button>
    </TooltipToggleExpandedButton>
  )
}

function TooltipToggleExpandedButton({
  children,
  disabled,
}: {
  children: React.ReactNode
  disabled: boolean
}) {
  if (disabled) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="cursor-not-allowed opacity-50"
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Product has no variants</TooltipContent>
      </Tooltip>
    )
  }

  return children
}
