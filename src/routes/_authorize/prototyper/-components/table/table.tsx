import { DataTable, useTable } from "@gearment/ui3"
import { usePrototyperContext } from "../../-prototyper-context"
import { columns } from "./columns"

export default function Table() {
  const { prototypes, loading } = usePrototyperContext()
  const table = useTable({ columns, data: prototypes })

  return (
    <div className="bg-background rounded-lg p-4">
      <DataTable table={table} loading={loading} sticky />
    </div>
  )
}
