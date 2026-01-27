import { useMutationPod, useQueryPod } from "@/services/connect-rpc/transport"
import {
  GMTeamPriceCustomStatus,
  StaffListPriceCustomRuleRequest_SortCriterion,
} from "@/services/connect-rpc/types"
import { useConfirmModal } from "@/services/modals/modal-confirm"
import { queryClient } from "@/services/react-query"
import { toUtcBoundaryTimestamp } from "@/utils"
import {
  staffCountPriceCustomRuleStatus,
  staffListPriceCustomRule,
  staffUpdatePriceCustomStatus,
} from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { Button, DataTable, TablePagination, useTable } from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { CircleCheck, CircleX, Trash2 } from "lucide-react"
import { useCallback, useMemo } from "react"
import { sortByMapping, sortDirectionMapping } from "../../-helper"
import { usePricingRule } from "../../-pricing-rule-context"
import { columns } from "./columns"

export default function TablePricingRule() {
  const search = useSearch({
    from: "/_authorize/global-configuration/pricing-management/",
  })
  const navigate = useNavigate({
    from: "/global-configuration/pricing-management",
  })
  const { rowSelection, setRowSelection } = usePricingRule()
  const [setOpenConfirm, onCloseConfirm] = useConfirmModal((state) => [
    state.setOpen,
    state.onClose,
  ])
  const { data, isLoading } = useQueryPod(staffListPriceCustomRule, {
    paging: {
      page: search.page,
      limit: search.limit,
    },
    filter: {
      fromStartTime: toUtcBoundaryTimestamp(search.fromStartTime, "start"),
      toEndTime: toUtcBoundaryTimestamp(search.toEndTime, "end"),
      createdByIds: search.createdByIds,
      teamIds: search.teamIds,
      statuses: search.status ? [search.status] : undefined,
    },
    sortCriterion: (search.sortBy || []).reduce<
      StaffListPriceCustomRuleRequest_SortCriterion[]
    >((acc, key, idx) => {
      const mapped = sortByMapping[key]
      if (!mapped) return acc
      acc.push(
        new StaffListPriceCustomRuleRequest_SortCriterion({
          sortBy: mapped,
          sortDirection:
            sortDirectionMapping[search.sortDirection?.[idx] ?? "desc"],
        }),
      )
      return acc
    }, []),
  })

  const sorting = (search.sortBy || []).map((s, i) => ({
    id: s,
    desc: search.sortDirection ? search.sortDirection[i] === "desc" : false,
  }))

  const table = useTable({
    columns: columns,
    data: data?.data ?? [],
    rowCount: Number(data?.paging?.total ?? 0),
    pageCount: Number(data?.paging?.totalPage ?? 0),
    state: {
      columnPinning: {
        right: ["actions"],
      },
      rowSelection,
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.limit,
      },
      sorting: sorting,
    },
    manualSorting: true,
    getRowId: (row) => row.customId,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: (updater) => {
      const newValue =
        updater instanceof Function
          ? updater({
              pageIndex: search.page - 1,
              pageSize: search.limit,
            })
          : updater
      navigate({
        search: (old) => {
          return {
            ...old,
            page: newValue.pageIndex + 1,
            limit: newValue.pageSize,
          }
        },
        replace: true,
      })
    },
    onSortingChange: (updater) => {
      const newValue = updater instanceof Function ? updater(sorting) : updater

      const order = newValue.map((s) => s.id)
      const desc = newValue.map((s) => (s.desc ? "desc" : "asc"))

      navigate({
        search: (old) => {
          return {
            ...old,
            sortBy: order,
            sortDirection: desc,
          }
        },
        replace: true,
      })
    },
  })

  const loading = isLoading

  const mutationUpdateStatus = useMutationPod(staffUpdatePriceCustomStatus, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          staffListPriceCustomRule.service.typeName,
          staffListPriceCustomRule.name,
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [
          staffCountPriceCustomRuleStatus.service.typeName,
          staffCountPriceCustomRuleStatus.name,
        ],
      })
      onCloseConfirm()
    },
  })

  const selectedRules = Object.keys(rowSelection).filter(
    (key) => rowSelection[key],
  )
  const selectedCount = selectedRules.length

  const handleDeleteSelected = useCallback(() => {
    setOpenConfirm({
      title: "Confirm delete pricing rules",
      description:
        "Deleting this rule will remove it permanently. Orders not yet checked out will be updated back to original tier pricing.",
      onConfirm: async () => {
        await mutationUpdateStatus.mutateAsync({
          customIds: selectedRules,
          updateStatus:
            GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_DELETED,
        })
      },
    })
  }, [selectedRules, mutationUpdateStatus, setOpenConfirm])

  const handleInactiveSelected = useCallback(() => {
    setOpenConfirm({
      title: "Confirm deactivate pricing rules",
      description:
        "This rule will no longer be applied to new orders. Existing orders remain unchanged.",
      onConfirm: async () => {
        await mutationUpdateStatus.mutateAsync({
          customIds: selectedRules,
          updateStatus:
            GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_INACTIVE,
        })
      },
    })
  }, [selectedRules, mutationUpdateStatus, setOpenConfirm])

  const handleActivateSelected = useCallback(() => {
    setOpenConfirm({
      title: "Confirm activate pricing rules",
      description: "Are you sure you want to activate these pricing rules?",
      onConfirm: async () => {
        await mutationUpdateStatus.mutateAsync({
          customIds: selectedRules,
          updateStatus:
            GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_ACTIVE,
        })
      },
    })
  }, [selectedRules, mutationUpdateStatus, setOpenConfirm])

  const isEnableActive =
    search.status ===
    GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_INACTIVE

  const isEnableInactive =
    search.status ===
      GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_ACTIVE ||
    search.status ===
      GMTeamPriceCustomStatus.GM_TEAM_PRICE_CUSTOM_STATUS_PENDING

  const headerAction = useMemo(() => {
    if (selectedCount === 0) return null

    return (
      <div className="flex normal-case gap-3 items-center tabular-nums">
        <span className="text-sm text-muted-foreground">
          Selected {selectedCount} of {table.getRowCount() || 0}
        </span>

        <Button onClick={handleDeleteSelected} size="sm" variant="destructive">
          <Trash2 size={16} />
          <span>Delete</span>
        </Button>

        {isEnableInactive && (
          <Button onClick={handleInactiveSelected} size="sm" variant="outline">
            <CircleX className="w-4 h-4" />
            Deactivate
          </Button>
        )}

        {isEnableActive && (
          <Button onClick={handleActivateSelected} size="sm" variant="default">
            <CircleCheck className="w-4 h-4" />
            Activate
          </Button>
        )}
      </div>
    )
  }, [
    selectedCount,
    table,
    handleDeleteSelected,
    handleInactiveSelected,
    handleActivateSelected,
    isEnableActive,
    isEnableInactive,
  ])

  return (
    <div>
      <TablePagination table={table} />
      <div className="bg-background p-4 rounded-lg">
        <DataTable
          sticky
          table={table}
          loading={loading}
          headerAction={headerAction}
        />
      </div>
      <TablePagination table={table} />
    </div>
  )
}
