import { DataTable, PageHeader, useTable } from "@gearment/ui3"
import { Columns } from "./columns"

export default function TableTransactions() {
  const table = useTable({
    columns: Columns,
    data: [],
  })
  return (
    <div>
      <PageHeader>
        <PageHeader.Title>Transactions </PageHeader.Title>
      </PageHeader>
      <div className="bg-background rounded-lg p-4">
        <DataTable table={table} />
      </div>
    </div>
  )
}
