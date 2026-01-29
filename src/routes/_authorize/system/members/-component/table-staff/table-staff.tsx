import {
  Badge,
  Button,
  ButtonGroup,
  DataTable,
  TablePagination,
  toast,
  useTable,
} from "@gearment/ui3"
import {
  ColumnDef,
  createColumnHelper,
  RowSelectionState,
} from "@tanstack/react-table"
import { useEffect, useMemo, useRef, useState } from "react"

import {
  mappingColor,
  StaffStatusColorsMapping,
} from "@/constants/map-color.ts"
import {
  AllStaffStatus,
  AllStaffStatusLabel,
} from "@/constants/staff-status.tsx"
import CellActions from "@/routes/_authorize/system/members/-component/table-staff/cell-actions.tsx"
import CellSelect from "@/routes/_authorize/system/members/-component/table-staff/cell-select.tsx"
import {
  useMutationIam,
  useQueryIam,
} from "@/services/connect-rpc/transport.tsx"
import { staffListGMStaffInformation } from "@gearment/nextapi/api/iam/v1/staff_action-StaffActionAPI_connectquery.ts"
import {
  StaffInfo_Short,
  StaffStatus,
} from "@gearment/nextapi/api/iam/v1/staff_action_pb.ts"
import { useNavigate, useSearch } from "@tanstack/react-router"

import CellCheckbox from "@/components/common/cell-checkbox"
import { DateTime } from "@/components/common/date-time"
import { useAuth } from "@/services/auth"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import { queryClient } from "@/services/react-query.ts"
import { formatDateForCallApi } from "@/utils/format-date.ts"
import {
  staffActivateInternalStaff,
  staffDeactivateInternalStaff,
} from "@gearment/nextapi/api/iam/v1/staff_account-StaffAccountAPI_connectquery.ts"
import CellStaff from "./cell-staff"

export default function TableStaff() {
  const [setOpenConfirm, closeConfirm] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])
  const { user } = useAuth()
  const membersRef = useRef<StaffInfo_Short[]>(undefined)
  const columnHelper = createColumnHelper<StaffInfo_Short>()

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const search = useSearch({
    from: "/_authorize/system/members/",
  })

  const navigate = useNavigate({
    from: "/system/members",
  })

  const { data, isPending } = useQueryIam(
    staffListGMStaffInformation,
    {
      page: search.page,
      limit: search.limit,
      filter: {
        searchText: search.searchText,
        loginFrom: search.from ? formatDateForCallApi(search.from) : undefined,
        loginTo: search.to
          ? formatDateForCallApi(search.to, "endOfDay")
          : undefined,
      },
    },
    {
      refetchOnWindowFocus: true,
      select: (data) => ({
        data: data.data,
        rowCount: Number(data?.total),
        pageCount: data?.totalPage,
      }),
    },
  )

  const columns: ColumnDef<StaffInfo_Short, any>[] = useMemo(
    () => [
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
      columnHelper.accessor("staffName", {
        header: () => (
          <span className={"text-center whitespace-nowrap pr-4"}>Staff</span>
        ),
        cell: (info) => <CellStaff {...info} />,
      }),

      {
        id: "group",
        meta: {
          width: 150,
        },
        header: () => (
          <span className={"text-center whitespace-nowrap pr-4"}>Group</span>
        ),
        cell: () => (
          <span className={"text-center whitespace-nowrap pr-4"}>Admin</span>
        ),
      },
      columnHelper.accessor("loginAt", {
        header: () => (
          <span className={"text-center whitespace-nowrap pr-4"}>
            Last login
          </span>
        ),
        cell: (info) => {
          return (
            <DateTime date={info.getValue().toDate()} className="body-small" />
          )
        },
      }),
      columnHelper.accessor("status", {
        header: () => (
          <span className={"text-center whitespace-nowrap pr-4"}>Status</span>
        ),
        cell: ({ getValue }) => {
          const status = getValue<StaffStatus>
          return (
            <span className="block w-full">
              <Badge variant={mappingColor(StaffStatusColorsMapping, status())}>
                {AllStaffStatusLabel[status()]}
              </Badge>
            </span>
          )
        },
      }),
      columnHelper.accessor("staffId", {
        header: () => <div className="text-right">Actions</div>,
        meta: {
          width: 100,
        },
        cell: (props) => <CellActions {...props} />,
      }),
    ],
    [],
  )

  const table = useTable<StaffInfo_Short>({
    columns,
    data: data?.data || [],
    state: {
      rowSelection,
      columnVisibility: {
        select: data && data?.rowCount > 1 ? true : false,
      },
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.limit,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.staffId,
    onPaginationChange: (updater) => {
      const newValue =
        updater instanceof Function
          ? updater({
              pageIndex: search.page - 1,
              pageSize: search.limit,
            })
          : updater

      navigate({
        search: (old) => ({
          ...old,
          page: newValue.pageIndex + 1,
          limit: newValue.pageSize,
        }),
        replace: true,
      })
    },
  })

  const mutationDeactivateMemberStatus = useMutationIam(
    staffDeactivateInternalStaff,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            staffListGMStaffInformation.service.typeName,
            staffListGMStaffInformation.name,
          ],
        })
        setRowSelection({})
      },
    },
  )

  const mutationActivateMemberStatus = useMutationIam(
    staffActivateInternalStaff,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [
            staffListGMStaffInformation.service.typeName,
            staffListGMStaffInformation.name,
          ],
        })
        setRowSelection({})
      },
    },
  )

  const handleChangeStatus = (status: StaffStatus) => {
    const memberNames = membersRef.current
      ?.filter((member) => member.staffId !== user?.staffId)
      .filter((member) => member.status !== status)
      .map((member) => member.email)

    const membersLength = memberNames?.length || 0

    setOpenConfirm({
      title: `${status === AllStaffStatus.ACTIVE ? "Activate" : "Deactivate"} (${membersLength} staffs)`,
      description: (
        <p className="mb-8">
          Are you sure you want to{" "}
          {status === AllStaffStatus.ACTIVE ? "activate" : "deactivate"}{" "}
          <span className="font-bold">
            {membersLength < 4
              ? memberNames?.join(", ")
              : `${membersLength} staffs`}
          </span>
          ? They will no longer be able to access back office, but their
          completion data will remain in your reports.
        </p>
      ),
      onConfirm: async () => {
        const memberIds = membersRef.current
          ?.filter((member) => member.staffId !== user?.staffId)
          .filter((member) => member.status !== status)
          .map((member) => member.staffId)

        const input = {
          staffIds: memberIds,
        }
        if (status === AllStaffStatus.ACTIVE && input.staffIds) {
          await mutationActivateMemberStatus.mutateAsync(input)
        } else {
          await mutationDeactivateMemberStatus.mutateAsync(input)
        }
        toast({
          title: "Success",
          description: `Successfully updated status for ${membersLength} staff members`,
          variant: "success",
        })
        closeConfirm()
      },
    })
  }

  ;(useEffect(() => {
    if (data?.data) {
      membersRef.current = data?.data.filter(
        (staff) => rowSelection[staff.staffId],
      )
    }
  }),
    [rowSelection])

  const headerAction = useMemo(() => {
    const rowSelectedLength = Object.keys(rowSelection).filter(
      (key) => key && rowSelection[key],
    ).length

    return (
      <div className="flex normal-case gap-3 items-center tabular-nums">
        Selected of {rowSelectedLength} of{" "}
        {table.getRowCount() ? table.getRowCount() : 0}
        <ButtonGroup>
          <Button
            onClick={() => handleChangeStatus(AllStaffStatus.ACTIVE)}
            size={"sm"}
          >
            Activate
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button
            onClick={() => handleChangeStatus(AllStaffStatus.INACTIVE)}
            size={"sm"}
            variant={"destructive"}
          >
            Deactivate
          </Button>
        </ButtonGroup>
      </div>
    )
  }, [rowSelection, data?.rowCount])

  return (
    <div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
      <div className="bg-background p-4 rounded-lg">
        <DataTable
          loading={isPending}
          table={table}
          headerAction={headerAction}
          sticky
        />
      </div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
    </div>
  )
}
