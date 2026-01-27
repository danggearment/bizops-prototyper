import { DateTime } from "@/components/common/date-time"
import { StaffGetTeamDetailResponse_OtherTeam } from "@/services/connect-rpc/types"
import { DataTable, useTable } from "@gearment/ui3"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"

const columnHelper = createColumnHelper<StaffGetTeamDetailResponse_OtherTeam>()

interface Props {
  otherTeams: StaffGetTeamDetailResponse_OtherTeam[]
}

export default function TableOtherTeams({ otherTeams }: Props) {
  const columns: ColumnDef<StaffGetTeamDetailResponse_OtherTeam, any>[] =
    useMemo(
      () => [
        columnHelper.accessor("teamId", {
          header: () => "Team ID",
          meta: {
            width: 200,
          },
          cell: (info) => (
            <div
              className="font-medium text-gray-700 truncate"
              title={info.getValue()}
            >
              {info.getValue()}
            </div>
          ),
        }),
        columnHelper.accessor("teamName", {
          header: () => "Team name",
          cell: (info) => (
            <div
              className="font-medium text-gray-900 truncate"
              title={info.getValue()}
            >
              {info.getValue()}
            </div>
          ),
        }),
        columnHelper.accessor("roleName", {
          header: () => "Role",
          meta: {
            width: 200,
          },
          cell: (info) => (
            <div className="max-w-full overflow-hidden">
              <span
                className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 truncate"
                title={info.getValue()}
              >
                {info.getValue()}
              </span>
            </div>
          ),
        }),
        columnHelper.accessor("joinedDate", {
          header: () => "Joined date",
          cell: (info) => {
            const date = info.getValue()
            return (
              <DateTime
                date={date?.toDate()}
                className="text-gray-600 truncate"
              />
            )
          },
        }),
      ],
      [],
    )

  const table = useTable<StaffGetTeamDetailResponse_OtherTeam>({
    columns,
    data: otherTeams || [],
  })

  return (
    <div className="bg-background p-4 rounded-lg">
      <h2 className="text-xl font-semibold pb-3 mb-6 border-b">Other Teams</h2>
      <div className="rounded-md max-h-96 overflow-auto">
        <DataTable table={table} />
      </div>
    </div>
  )
}
