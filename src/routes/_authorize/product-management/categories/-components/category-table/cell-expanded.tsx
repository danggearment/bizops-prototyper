import { GMProductCategory_Admin_Short } from "@/services/connect-rpc/types"
import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@gearment/ui3"
import { Row } from "@tanstack/react-table"
import { ChevronDown, ChevronRight } from "lucide-react"

interface Props {
  row: Row<GMProductCategory_Admin_Short>
  setCategoriesData: (
    data: React.SetStateAction<Record<string, GMProductCategory_Admin_Short[]>>,
  ) => void
  setLoadingCategories: (
    data: React.SetStateAction<Record<string, boolean>>,
  ) => void
  loadingCategories: Record<string, boolean>
}

export function CellExpanded(props: Props) {
  const { row, setCategoriesData, setLoadingCategories, loadingCategories } =
    props
  const { id, childrenCount } = row.original

  const disabled = !id || loadingCategories[id.toString()] || childrenCount <= 0

  return (
    <TooltipToggleExpandedButton disabled={disabled}>
      <Button
        onClick={() => {
          row.toggleExpanded()

          if (row.getIsExpanded()) {
            setCategoriesData((prev) => {
              const updated = { ...prev }
              delete updated[id.toString()]
              return updated
            })
          }

          setLoadingCategories((prev) => ({
            ...prev,
            [id.toString()]: !row.getIsExpanded(),
          }))
        }}
        disabled={disabled}
        variant="outline"
        className="cursor-pointer"
        size="icon"
      >
        {row.getIsExpanded() ? (
          <ChevronDown className="size-4 text-gray-500" />
        ) : (
          <ChevronRight className="size-4 text-gray-500" />
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
        <TooltipContent>Category has no subcategories</TooltipContent>
      </Tooltip>
    )
  }

  return children
}
