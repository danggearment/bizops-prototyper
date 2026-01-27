import {
  Checkbox,
  cn,
  DataTable,
  FormField,
  Input,
  TableCell,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useTable,
} from "@gearment/ui3"
import { ExpandedState, getExpandedRowModel, Row } from "@tanstack/react-table"
import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import {
  ProductGroup,
  RushVariant,
  useProductGroupStore,
} from "../modal-product-group-store"
import { columns } from "./column"

interface ProductGroupTableProps {
  form: UseFormReturn<any>
}

export default function ProductGroupTable({ form }: ProductGroupTableProps) {
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const { productGroup, actions } = useProductGroupStore()
  const table = useTable({
    columns: columns,
    data: productGroup,
    state: {
      expanded,
    },
    enableExpanding: true,
    getExpandedRowModel: getExpandedRowModel(),
    onExpandedChange: setExpanded,
  })

  const renderCheckbox = (row: Row<ProductGroup>, subrow: RushVariant) => {
    return subrow.disabled ? (
      <Tooltip>
        <TooltipTrigger>
          <Checkbox
            disabled={subrow.disabled}
            checked={subrow.selected}
            className={cn(subrow.disabled && "bg-gray-200")}
            onCheckedChange={() => {
              actions.updateSelected(
                row.original.productId,
                subrow.variantId,
                !subrow.selected,
              )
            }}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>This variant was selected from another product group</p>
        </TooltipContent>
      </Tooltip>
    ) : (
      <Checkbox
        disabled={subrow.disabled}
        checked={subrow.selected}
        onCheckedChange={() => {
          actions.updateSelected(
            row.original.productId,
            subrow.variantId,
            !subrow.selected,
          )
        }}
      />
    )
  }
  const renderVariantQuantity = () => {
    return (
      <FormField
        control={form.control}
        name="quantity"
        render={({ field }) => (
          <Input className="bg-background max-w-[200px]" {...field} disabled />
        )}
      />
    )
  }
  const renderSubrow = (row: Row<ProductGroup>) => {
    const subRows = row.original.listRushVariant || []
    return (
      <TableRow className="bg-gray-50 hover:bg-gray-50">
        <TableCell colSpan={columns.length}>
          <div className="flex flex-col gap-2 w-full">
            {subRows.map((subrow) => (
              <div
                key={subrow.variantName}
                className={cn(
                  "grid grid-cols-2 gap-4 border-b pl-4 last:border-b-0 border-gray-200 py-2 ",
                )}
              >
                <div className="flex items-center gap-2">
                  {renderCheckbox(row, subrow)}
                  {subrow.variantName}
                </div>
                {renderVariantQuantity()}
              </div>
            ))}
          </div>
        </TableCell>
      </TableRow>
    )
  }
  return (
    <DataTable
      table={table}
      renderSubrow={renderSubrow}
      sticky
      stickyTop={100}
      containerRefId="layout-product-information"
    />
  )
}
