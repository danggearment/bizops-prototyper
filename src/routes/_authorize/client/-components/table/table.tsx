import { DataTable, useTable } from "@gearment/ui3"
import { useMemo } from "react"
import { useClientContext } from "../../-client-context"
import { createColumns, type ClientType } from "./columns"

interface TableProps {
  onEdit: (client: ClientType) => void
}

export default function Table({ onEdit }: TableProps) {
  const { clients, loading } = useClientContext()
  const columns = useMemo(() => createColumns({ onEdit }), [onEdit])
  const table = useTable({ columns, data: clients })

  return (
    <div className="bg-background rounded-lg p-4">
      <DataTable table={table} loading={loading} sticky />
    </div>
  )
}
