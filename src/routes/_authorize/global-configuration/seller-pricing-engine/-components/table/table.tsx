import { SellerProduct } from "@/schemas/schemas/seller-pricing"
import { DataTable, TablePagination, useTable } from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { Fragment, useMemo } from "react"
import { useSellerPricing } from "../../-seller-pricing-context"
import { columns } from "./columns"
import VariantRow from "./variant-row"

export default function TableSellerPricing() {
  const search = useSearch({
    from: "/_authorize/global-configuration/seller-pricing-engine/",
  })
  const navigate = useNavigate({
    from: "/global-configuration/seller-pricing-engine",
  })
  const { rowSelection, setRowSelection, products } = useSellerPricing()

  // Mock loading state - in production this comes from useQueryPod
  const isLoading = false

  const sorting = (search.sortBy || []).map((s, i) => ({
    id: s,
    desc: search.sortDirection ? search.sortDirection[i] === "desc" : false,
  }))

  const table = useTable({
    columns: columns,
    data: products,
    rowCount: products.length,
    pageCount: Math.ceil(products.length / search.limit),
    state: {
      columnPinning: {
        right: ["actions"],
      },
      rowSelection,
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.limit,
      },
      sorting: sorting,
    },
    manualSorting: true,
    getRowId: (row) => row.productId,
    getRowCanExpand: () => true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      const newValue =
        updater instanceof Function
          ? updater({
              pageIndex: search.page - 1,
              pageSize: search.limit,
            })
          : updater
      navigate({
        search: (old) => {
          return {
            ...old,
            page: newValue.pageIndex + 1,
            limit: newValue.pageSize,
          }
        },
        replace: true,
      })
    },
    onSortingChange: (updater) => {
      const newValue = updater instanceof Function ? updater(sorting) : updater

      const order = newValue.map((s) => s.id)
      const desc = newValue.map((s) => (s.desc ? "desc" : "asc"))

      navigate({
        search: (old) => {
          return {
            ...old,
            sortBy: order,
            sortDirection: desc,
          }
        },
        replace: true,
      })
    },
  })

  const selectedCount = Object.keys(rowSelection).filter(
    (key) => rowSelection[key],
  ).length

  const headerAction = useMemo(() => {
    if (selectedCount === 0) return null

    return (
      <div className="flex normal-case gap-3 items-center tabular-nums">
        <span className="text-sm text-muted-foreground">
          Selected {selectedCount} of {table.getRowCount() || 0}
        </span>
      </div>
    )
  }, [selectedCount, table])

  // Custom render to include expandable variant rows
  const renderExpandedRow = (row: any) => {
    const product = row.original as SellerProduct
    if (!row.getIsExpanded() || !product.variants?.length) return null

    return (
      <>
        {/* Variant header row */}
        <tr className="bg-muted/40 border-b border-border">
          <td className="w-10" />
          <td className="w-10" />
          <td className="py-2 px-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide pl-4">
              Variant / SKU
            </span>
          </td>
          <td className="py-2 px-4" />
          <td className="py-2 px-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              RSP
            </span>
          </td>
          <td className="py-2 px-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Pricing Source
            </span>
          </td>
          <td className="py-2 px-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Status
            </span>
          </td>
          <td className="py-2 px-4">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Final Price
            </span>
          </td>
          <td className="py-2 px-4" />
        </tr>
        {/* Variant data rows */}
        {product.variants.map((variant, idx) => (
          <VariantRow
            key={variant.variantId}
            variant={variant}
            isLast={idx === product.variants.length - 1}
          />
        ))}
      </>
    )
  }

  return (
    <div>
      <TablePagination table={table} />
      <div className="bg-background p-4 rounded-lg">
        <DataTable
          sticky
          table={table}
          loading={isLoading}
          headerAction={headerAction}
          renderExpandedRow={renderExpandedRow}
        />

        {/* Pricing Formula Legend */}
        <div className="mt-4 p-3 bg-muted/50 rounded-md border border-border">
          <div className="flex items-start gap-2">
            <div className="text-xs text-muted-foreground">
              <span className="font-semibold">Pricing Formula:</span>{" "}
              <code className="bg-background px-1.5 py-0.5 rounded text-xs">
                Final Seller Price = RSP × (1 − TierDiscount − CustomDiscount) +
                Fixed Add-ons
              </code>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Only RSP is discountable. Additional charges (size modifier, print
            location, print type) are fixed amounts.
          </p>
        </div>
      </div>
      <TablePagination table={table} />
    </div>
  )
}
