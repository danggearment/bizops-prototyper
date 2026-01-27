import { DateTime } from "@/components/common/date-time"
import { AllGMTeamMemberStatusLabel } from "@/constants/gm-team-status"
import {
  AllGMTeamMemberStatusColorsMapping,
  mappingColor,
} from "@/constants/map-color"
import { Team_Member, TeamMemberStatus } from "@/services/connect-rpc/types"
import { Badge, DataTable, useTable } from "@gearment/ui3"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"

const columnHelper = createColumnHelper<Team_Member>()

interface Props {
  teamMembers: Team_Member[]
}

export default function TableTeamMembers({ teamMembers }: Props) {
  const columns: ColumnDef<Team_Member, any>[] = useMemo(
    () => [
      columnHelper.accessor("userEmail", {
        header: () => "Email",
        cell: (info) => (
          <div
            className="font-medium text-gray-700 truncate"
            title={info.getValue()}
          >
            {info.getValue()}
          </div>
        ),
      }),

      columnHelper.accessor("roleName", {
        header: () => "Role",
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
      columnHelper.accessor("status", {
        header: () => "Status",
        cell: (info) => {
          const status = info.getValue<TeamMemberStatus>()

          return (
            <Badge
              variant={mappingColor(AllGMTeamMemberStatusColorsMapping, status)}
            >
              {AllGMTeamMemberStatusLabel[status]}
            </Badge>
          )
        },
      }),
      columnHelper.accessor("createdAt", {
        header: () => "Joined date",
        cell: (info) => {
          return (
            <DateTime date={info.getValue().toDate()} className="body-small" />
          )
        },
      }),
    ],
    [],
  )

  const table = useTable<Team_Member>({
    columns,
    data: teamMembers || [],
  })

  return (
    <div className="bg-background p-4 rounded-lg">
      <h2 className="text-xl font-semibold pb-4 mb-4 border-b">Team Members</h2>
      <div className="rounded-md  max-h-96 overflow-auto">
        <DataTable table={table} />
      </div>
    </div>
  )
}
