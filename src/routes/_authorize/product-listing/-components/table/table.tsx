import { DataTable, useTable } from "@gearment/ui3"
import { useProductListingContext } from "../../-product-listing-context"
import { columns } from "./columns"

export default function Table() {
  const { products, loading } = useProductListingContext()
  const table = useTable({ columns, data: products })

  return (
    <div className="bg-background rounded-lg p-4">
      <DataTable table={table} loading={loading} sticky />
    </div>
  )
}
