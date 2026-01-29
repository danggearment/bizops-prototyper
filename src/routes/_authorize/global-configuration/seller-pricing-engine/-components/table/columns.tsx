import CellCheckbox from "@/components/common/cell-checkbox"
import {
  PricingSourceColor,
  PricingSourceLabel,
  ProductStatusColor,
  ProductStatusLabel,
} from "@/constants/seller-pricing"
import { SellerProduct } from "@/schemas/schemas/seller-pricing"
import { Badge, CellHeader } from "@gearment/ui3"
import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import { ChevronDown, ChevronRight, MoreHorizontal } from "lucide-react"
import CellActions from "./cell-actions"
import CellProductInfo from "./cell-product-info"
import CellSelect from "./cell-select"

export const columns: ColumnDef<SellerProduct>[] = [
  {
    id: "expand",
    meta: {
      width: 40,
    },
    header: () => null,
    cell: ({ row, table }) => {
      const isExpanded = row.getIsExpanded()
      return (
        <button
          onClick={() => row.toggleExpanded()}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      )
    },
  },
  {
    id: "select",
    meta: {
      width: 40,
    },
    header: (props) => (
      <CellCheckbox
        {...{
          checked: props.table.getIsAllRowsSelected(),
          onChange: props.table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: (props) => {
      return (
        <CellSelect
          {...props}
          {...{
            checked: props.row.getIsSelected(),
            disabled: !props.row.getCanSelect(),
            onCheckedChange: props.row.getToggleSelectedHandler(),
          }}
        />
      )
    },
  },
  {
    header: (header) => (
      <CellHeader {...header} sort>
        Product
      </CellHeader>
    ),
    accessorKey: "productName",
    meta: {
      width: 280,
    },
    cell: ({ row }) => <CellProductInfo product={row.original} />,
  },
  {
    header: "Product Type",
    accessorKey: "productType",
    meta: {
      width: 120,
    },
    cell: ({ row }) => (
      <Badge variant="outline" className="font-normal">
        {row.original.productType}
      </Badge>
    ),
  },
  {
    header: "RSP Range",
    accessorKey: "rspMin",
    meta: {
      width: 140,
    },
    cell: ({ row }) => {
      const { rspMin, rspMax } = row.original
      return (
        <div className="tabular-nums text-sm">
          ${rspMin.toFixed(2)} – ${rspMax.toFixed(2)}
        </div>
      )
    },
  },
  {
    header: "Variants",
    accessorKey: "totalVariants",
    meta: {
      width: 120,
    },
    cell: ({ row }) => {
      const { totalVariants, overrideCount } = row.original
      return (
        <div className="text-sm">
          <span className="font-medium">{totalVariants}</span>
          {overrideCount > 0 && (
            <span className="text-muted-foreground ml-1">
              ({overrideCount} override{overrideCount !== 1 ? "s" : ""})
            </span>
          )}
        </div>
      )
    },
  },
  {
    header: "Status",
    accessorKey: "status",
    meta: {
      width: 100,
    },
    cell: ({ row }) => {
      const status = row.original.status
      return (
        <Badge
          variant="secondary"
          className={`${ProductStatusColor[status]} border-0`}
        >
          {ProductStatusLabel[status]}
        </Badge>
      )
    },
  },
  {
    header: (header) => (
      <CellHeader {...header} sort>
        Last Updated
      </CellHeader>
    ),
    accessorKey: "lastUpdated",
    meta: {
      width: 140,
    },
    cell: ({ row }) => (
      <p className="tabular-nums text-sm text-muted-foreground">
        {dayjs(row.original.lastUpdated).format("YYYY/MM/DD")}
      </p>
    ),
  },
  {
    header: () => <div className="text-right">Actions</div>,
    accessorKey: "actions",
    meta: {
      width: 80,
    },
    cell: (props) => <CellActions {...props} />,
  },
]
