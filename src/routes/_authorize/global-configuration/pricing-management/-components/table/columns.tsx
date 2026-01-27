import CellCheckbox from "@/components/common/cell-checkbox"
import { DateTime } from "@/components/common/date-time"
import { StaffListPriceCustomRuleResponse_PriceCustomRule } from "@/services/connect-rpc/types"
import { ButtonIconCopy, CellHeader } from "@gearment/ui3"
import { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import CellActions from "./cell-actions"
import CellSelect from "./cell-select"
import CellStatus from "./cell-status"
import CellTeam from "./cell-team"

export const columns: ColumnDef<StaffListPriceCustomRuleResponse_PriceCustomRule>[] =
  [
    {
      id: "select",
      meta: {
        width: 40,
      },
      header: (props) => (
        <CellCheckbox
          {...{
            checked: props.table.getIsAllRowsSelected(),
            onChange: props.table.getToggleAllRowsSelectedHandler(),
          }}
        />
      ),
      cell: (props) => {
        return (
          <CellSelect
            {...props}
            {...{
              checked: props.row.getIsSelected(),
              disabled: !props.row.getCanSelect(),
              onCheckedChange: props.row.getToggleSelectedHandler(),
            }}
          />
        )
      },
    },
    {
      header: "Assigned Team",
      accessorKey: "teamId",
      cell: ({ row }) => (
        <CellTeam
          teamId={row.original.teamId}
          teamName={row.original.teamName}
          customId={row.original.customId}
        />
      ),
    },
    {
      header: "Email owner",
      accessorKey: "teamEmail",
      cell: ({ row }) => {
        const teamEmail = row.original.teamEmail
        return (
          <div className="flex space-x-1">
            <span className="body-extra-small">{teamEmail}</span>
            <ButtonIconCopy copyValue={teamEmail} size="sm" />
          </div>
        )
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (props) => <CellStatus {...props} />,
    },
    {
      header: (header) => (
        <CellHeader {...header} sort>
          Start date (UTC)
        </CellHeader>
      ),
      accessorKey: "startTime",
      cell: ({ row }) => (
        <p className="tabular-nums">
          {row.original.startTime
            ? dayjs(row.original.startTime?.toDate())
                .utc()
                .format("YYYY/MM/DD HH:mm a")
            : "--"}
        </p>
      ),
    },
    {
      header: (header) => (
        <CellHeader {...header} sort>
          End date (UTC)
        </CellHeader>
      ),
      accessorKey: "endTime",
      cell: ({ row }) => (
        <p className="tabular-nums">
          {row.original.endTime
            ? dayjs(row.original.endTime?.toDate())
                .utc()
                .format("YYYY/MM/DD HH:mm a")
            : "--"}
        </p>
      ),
    },
    {
      header: "Created by",
      accessorKey: "createdByName",
      cell: ({ row }) => {
        return <div>{row.original.createdByName}</div>
      },
    },
    {
      header: (header) => (
        <CellHeader {...header} sort>
          Created date
        </CellHeader>
      ),
      accessorKey: "createdAt",
      cell: ({ row }) => (
        <DateTime date={row.original.createdAt?.toDate() || ""} />
      ),
    },
    {
      header: () => <div className="text-right">Actions</div>,
      accessorKey: "actions",
      meta: {
        width: 100,
      },
      cell: (props) => <CellActions {...props} />,
    },
  ]
