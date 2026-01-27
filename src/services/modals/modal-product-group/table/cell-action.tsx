import { Button } from "@gearment/ui3"
import { Row } from "@tanstack/react-table"
import { ChevronDownIcon, ChevronUpIcon, Trash2Icon } from "lucide-react"
import {
  ProductGroup,
  useProductGroupStore,
} from "../modal-product-group-store"

interface CellActionProps {
  row: Row<ProductGroup>
}

export default function CellAction({ row }: CellActionProps) {
  const isExpanded = row.getIsExpanded()
  const enableExpand = row.original.listRushVariant?.length > 0
  const { actions } = useProductGroupStore()
  const handleDelete = () => {
    actions.deleteProductGroup(row.original.productId)
  }
  return (
    <div className="flex items-center gap-2 justify-end">
      <Button variant="ghost" size={"icon"} onClick={handleDelete}>
        <Trash2Icon className="w-4 h-4 text-destructive" />
      </Button>
      <Button
        variant="ghost"
        size={"icon"}
        onClick={() => row.toggleExpanded()}
        disabled={!enableExpand}
      >
        {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </Button>
    </div>
  )
}
