import { DataTable, TablePagination } from "@gearment/ui3"
import useFlagTable from "./use-table"

export default function FlagTable() {
  const { table, loading } = useFlagTable()

  return (
    <>
      <div className="bg-background rounded-lg p-4">
        <DataTable table={table} loading={loading} />
      </div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
    </>
  )
}
