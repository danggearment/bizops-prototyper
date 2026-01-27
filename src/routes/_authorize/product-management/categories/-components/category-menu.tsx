import { CategoryFilter } from "./category-filter"
import { CategoryTable } from "./category-table/category-table"

export function CategoryMenu() {
  return (
    <>
      <div className="p-4 rounded-md overflow-hidden bg-background">
        <CategoryFilter />
      </div>
      <CategoryTable />
    </>
  )
}
