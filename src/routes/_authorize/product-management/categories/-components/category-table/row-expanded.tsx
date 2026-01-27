import { GMProductCategory_Admin_Short } from "@/services/connect-rpc/types"
import { DataTable, useTable } from "@gearment/ui3"
import { Row } from "@tanstack/react-table"
import { createExpandedRowColumns } from "./columns"

interface Props {
  categories: GMProductCategory_Admin_Short[]
  loading: boolean
  parentCategory: Row<GMProductCategory_Admin_Short>
}

export function RowExpanded(props: Props) {
  const { categories, loading, parentCategory } = props

  const columns = createExpandedRowColumns()

  const table = useTable({
    data: categories,
    columns: columns,
    state: {
      columnPinning: {
        right: ["actions"],
      },
    },
    getRowId: (row) => row.id.toString(),
  })

  return (
    <div className="pl-[48px] py-4 pr-2 bg-gray-50 space-y-4">
      <div className="space-y-0.5">
        <p className="text-lg font-medium">
          {parentCategory.original.categoryName}
        </p>
        <p className="text-sm text-gray-500">
          {parentCategory.original.description}
        </p>
      </div>
      <div className="bg-white p-2 rounded-md">
        <DataTable table={table} loading={loading} />
      </div>
    </div>
  )
}
