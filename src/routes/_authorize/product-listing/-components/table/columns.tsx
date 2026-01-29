import { Badge, Button, Checkbox } from "@gearment/ui3"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@gearment/ui3"
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { format } from "date-fns"
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

export interface ProductType {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  status: "active" | "draft" | "archived"
  imageUrl: string
  createdAt: string
}

const columnHelper = createColumnHelper<ProductType>()

export const columns: ColumnDef<ProductType, unknown>[] = [
  columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("imageUrl", {
    header: "Image",
    cell: (info) => (
      <img
        src={info.getValue()}
        alt="Product"
        className="h-10 w-10 rounded-md object-cover"
      />
    ),
  }),
  columnHelper.accessor("name", {
    header: "Product Name",
    cell: (info) => (
      <div className="flex flex-col">
        <span className="font-medium">{info.getValue()}</span>
        <span className="text-xs text-muted-foreground">
          {info.row.original.sku}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor("category", {
    header: "Category",
    cell: (info) => <span className="text-sm">{info.getValue()}</span>,
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: (info) => (
      <span className="font-medium">${info.getValue().toFixed(2)}</span>
    ),
  }),
  columnHelper.accessor("stock", {
    header: "Stock",
    cell: (info) => {
      const stock = info.getValue()
      return (
        <span className={stock === 0 ? "text-destructive font-medium" : ""}>
          {stock === 0 ? "Out of stock" : stock}
        </span>
      )
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue()
      const variantMap: Record<
        string,
        "default" | "secondary" | "destructive" | "outline"
      > = {
        active: "default",
        draft: "secondary",
        archived: "outline",
      }
      return (
        <Badge variant={variantMap[status]} className="capitalize">
          {status}
        </Badge>
      )
    },
  }),
  columnHelper.accessor("createdAt", {
    header: "Created",
    cell: (info) => (
      <span className="text-sm text-muted-foreground">
        {format(new Date(info.getValue()), "dd/MM/yyyy")}
      </span>
    ),
  }),
  columnHelper.display({
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }),
]
