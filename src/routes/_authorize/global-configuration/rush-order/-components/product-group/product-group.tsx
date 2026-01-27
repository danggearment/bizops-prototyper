import Filter from "./filter/filter"
import ProductGroupTable from "./table/table"

export default function ProductGroup() {
  return (
    <div className="rounded-lg space-y-4">
      <Filter />

      <ProductGroupTable />
    </div>
  )
}
