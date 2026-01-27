import CellCheckbox from "@/components/common/cell-checkbox"
import CellShippingLabel from "@/components/common/cell-shipping-label"
import CellTeam from "@/components/common/cell-team/cell-team"
import CellTrackingNumber from "@/components/common/cell-tracking-number"
import { DateTime } from "@/components/common/date-time"
import {
  AllOrderRefundStatus,
  AllOrderRefundStatusLabel,
  AllOrderStatus,
  AllOrderStatusLabel,
} from "@/constants/all-orders-status.ts"
import {
  AllOrderRefundStatusColorsMapping,
  AllOrderStatusColorsMapping,
  mappingColor,
} from "@/constants/map-color.ts"
import { AllRefundRequestTypeLabel } from "@/constants/order"
import { useMutationPod } from "@/services/connect-rpc/transport"
import {
  OnHoldType,
  Order_Admin,
  Order_TrackingType,
  ShippingLabel,
} from "@/services/connect-rpc/types"
import { useMarkFulfilledOrderModal } from "@/services/modals/modal-mark-fulfilled-orders"
import {
  OnHoldOrdersType,
  useOnHoldOrderModal,
} from "@/services/modals/modal-on-hold-orders"
import { useReasonCancelOrdersModal } from "@/services/modals/modal-reason-cancel-orders"
import { useRefundOrder } from "@/services/modals/modal-refund-order/modal-refund-order-store"
import { queryClient } from "@/services/react-query"
import {
  staffCountOrderStatus,
  staffHoldOrder,
  staffListOrder,
  staffResumeOrderOnHold,
} from "@gearment/nextapi/api/pod/v1/admin_api-OrderAdminAPI_connectquery"
import {
  Badge,
  Button,
  DataTable,
  TablePagination,
  toast,
  useSidebar,
  useTable,
} from "@gearment/ui3"
import { useNavigate } from "@tanstack/react-router"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { CirclePause, CirclePlay, TruckIcon, XCircleIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { useAllOrder } from "../../-all-orders-context"
import DropdownActions from "../../../-component/dropdown-actions"
import ThirdPartyStatus from "./3rd_status"
import CellActions from "./cell-actions"
import CellHeaderSort from "./cell-header-sort"
import CellOrder from "./cell-order"
import CellSelect from "./cell-select"
import CellTotal from "./cell-total"

const columnHelper = createColumnHelper<Order_Admin>()

export const columns: ColumnDef<Order_Admin, any>[] = [
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
            error: true,
            checked: props.row.getIsSelected(),
            disabled: !props.row.getCanSelect(),
            onCheckedChange: props.row.getToggleSelectedHandler(),
          }}
        />
      )
    },
  },
  columnHelper.accessor("orderId", {
    id: "orderId",
    header: () => <span className="whitespace-nowrap">Order ID</span>,
    cell: ({ row }) => <CellOrder row={row} />,
  }),
  columnHelper.accessor("fulfillmentOrderId", {
    id: "fulfillmentOrderId",
    header: () => (
      <span className="whitespace-nowrap">Fulfillment order ID</span>
    ),

    cell: ({ row }) => <CellOrder row={row} isCrmUrl />,
  }),
  columnHelper.accessor("teamCode", {
    id: "teamCode",
    header: () => <span className="whitespace-nowrap">Team information</span>,
    cell: (props) => {
      return (
        <CellTeam
          teamId={props.row.original.teamCode}
          teamName={props.row.original.teamName}
          teamOwnerEmail={props.row.original.teamOwnerEmail}
          createdByEmail={props.row.original.createdByEmail}
        />
      )
    },
  }),
  columnHelper.accessor("isLabelAttached", {
    header: () => <span>Tracking information</span>,
    cell: (info) => {
      const isLabelAttached = info.row.original.isLabelAttached
      if (!isLabelAttached) {
        const trackingPrimary = info.row.original.orderTrackings.find(
          (tracking) => tracking.trackingType === Order_TrackingType.PRIMARY,
        )
        if (!trackingPrimary) {
          return <div className="px-4 py-2">--</div>
        }
        return (
          <CellTrackingNumber
            labelFile={trackingPrimary.labelFile || null}
            trackingNo={trackingPrimary.trackingNo}
            trackingUrl={trackingPrimary.trackingUrl}
            trackingCarrier={trackingPrimary.carrier}
            trackingService={trackingPrimary.service}
          />
        )
      }
      const shippingLabels = info.row.original.shippingLabels
      if (!shippingLabels.length) {
        return <div className="px-4 py-2">--</div>
      }

      const shippingLabelsUpdated: ShippingLabel[] = []
      const shippingLabelsOriginal: ShippingLabel[] = []

      shippingLabels.forEach((label) => {
        if (label.isLabelUpdated) {
          shippingLabelsUpdated.push(label)
        } else {
          shippingLabelsOriginal.push(label)
        }
      })

      if (shippingLabelsUpdated.length > 0) {
        return (
          <>
            {shippingLabelsUpdated.map((label) => (
              <CellShippingLabel
                key={label.labelFile?.fileName}
                fileUrl={label.labelFile?.fileUrl || ""}
                fileName={label.labelFile?.fileName || ""}
              />
            ))}
          </>
        )
      }

      return (
        <>
          {shippingLabelsOriginal.map((label) => (
            <CellShippingLabel
              key={label.labelFile?.fileName}
              fileUrl={label.labelFile?.fileUrl || ""}
              fileName={label.labelFile?.fileName || ""}
            />
          ))}
        </>
      )
    },
  }),
  columnHelper.accessor("total", {
    header: () => <span className="block text-right">Total amount</span>,
    cell: (props) => <CellTotal total={props.getValue()} />,
    meta: {
      width: 150,
    },
  }),
  columnHelper.accessor("fulfillmentOrderStatus", {
    id: "fulfillmentOrderStatus",
    header: () => <span className="block w-full">3rd status</span>,

    cell: ({ row }) => <ThirdPartyStatus row={row} />,
  }),
  columnHelper.accessor("processingStatus", {
    id: "status",
    header: () => <span className="block w-full">Status</span>,

    cell: ({ getValue }) => (
      <span className={"text-center"}>
        <Badge
          variant={mappingColor<AllOrderStatus>(
            AllOrderStatusColorsMapping,
            getValue<AllOrderStatus>(),
          )}
        >
          {AllOrderStatusLabel[getValue<AllOrderStatus>()]}
        </Badge>
      </span>
    ),
  }),
  columnHelper.accessor("paidAt", {
    id: "paidAt",
    header: (header) => <CellHeaderSort header={header} title="Paid date" />,
    cell: (info) => {
      const paidAt = info.row.original.paidAt
      return paidAt ? <DateTime date={paidAt.toDate()} /> : "--"
    },
  }),
  columnHelper.accessor("updatedAt", {
    id: "updatedAt",
    header: (header) => <CellHeaderSort header={header} title="Updated date" />,
    cell: (info) => {
      const updatedAt = info.row.original.updatedAt
      return updatedAt ? <DateTime date={updatedAt.toDate()} /> : "--"
    },
  }),
  columnHelper.accessor("refundStatus", {
    id: "refundStatus",
    header: () => <span className="block w-full">Refund status</span>,

    cell: ({ getValue, row }) => (
      <div>
        <div className="mb-2">
          <Badge
            variant={mappingColor<AllOrderRefundStatus>(
              AllOrderRefundStatusColorsMapping,
              getValue<AllOrderRefundStatus>(),
            )}
          >
            {AllOrderRefundStatusLabel[getValue<AllOrderRefundStatus>()]}
          </Badge>
        </div>
        <ul className="flex flex-wrap flex-col gap-2">
          {row.original.orderRefunds.map((refund) => (
            <li key={refund.type}>
              <Badge variant="outline">
                {AllRefundRequestTypeLabel[refund.type]}
              </Badge>
            </li>
          ))}
        </ul>
      </div>
    ),
  }),

  columnHelper.display({
    id: "action",
    cell: (props) => <CellActions {...props} />,
  }),
]

export default function TableAllOrder() {
  const {
    orderList,
    rowCount,
    search,
    rowSelection,
    setRowSelection,
    loading,
  } = useAllOrder()

  const [openDropdown, setOpenDropdown] = useState(false)

  const actionsCancelModal = useReasonCancelOrdersModal(
    (state) => state.actions,
  )
  const [setOpenOnHold, onCloseOnHold] = useOnHoldOrderModal((state) => [
    state.setOpen,
    state.onClose,
  ])

  const [setOpenMarkFulfilled, onCloseMarkFulfilled] =
    useMarkFulfilledOrderModal((state) => [state.setOpen, state.onClose])

  const actionsRefundModal = useRefundOrder((state) => state.actions)
  const selectedOrders = useRefundOrder((state) => state.selectedOrders)

  const navigate = useNavigate({
    from: "/order/sale-orders",
  })

  const visibleRefundStatus = useMemo(() => {
    return (
      search.processingStatus === AllOrderStatus.CANCELLED ||
      search.processingStatus === AllOrderStatus.SHIPPED
    )
  }, [search.processingStatus])

  const visibleFulfillmentOrderStatus = useMemo(() => {
    return (
      search.processingStatus !== AllOrderStatus.AWAITING_PAYMENT &&
      search.processingStatus !== AllOrderStatus.PAYMENT_FAILED
    )
  }, [search.processingStatus])

  const columnVisibility = {
    select: search.processingStatus === AllOrderStatus.ALL ? false : true,
    action: search.processingStatus === AllOrderStatus.ALL ? false : true,
    refundStatus: visibleRefundStatus,
    status: search.processingStatus === AllOrderStatus.ALL ? true : false,
    fulfillmentOrderStatus: visibleFulfillmentOrderStatus,
  }

  const sorting = (search.sortBy || []).map((s, i) => ({
    id: s.toString(),
    desc: search.sortDirection?.[i] !== "asc",
  }))

  const table = useTable({
    columns,
    data: orderList,
    rowCount: rowCount,
    state: {
      columnPinning: {
        right: ["action"],
      },
      rowSelection: rowSelection,
      columnVisibility,
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.limit,
      },
      sorting,
    },
    enableMultiSort: false,
    manualSorting: true,
    getRowId: (row) => row.orderId,
    onRowSelectionChange: (updater) => {
      const newValue =
        updater instanceof Function ? updater(rowSelection) : updater
      const selectedOrdersNew = Object.keys(newValue)
        .map((key) => {
          return orderList.find((order) => order.orderId === key)
        })
        .filter((order) => order !== undefined)
      const oldSelectedOrders = selectedOrders ?? []
      const combinedOrders = [...oldSelectedOrders, ...selectedOrdersNew]
      const uniqueOrders = combinedOrders.filter(
        (order, index, self) =>
          index === self.findIndex((o) => o.orderId === order.orderId),
      )

      actionsRefundModal.setSelectedOrders(uniqueOrders ?? [])
      setRowSelection(newValue)
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
            page: 1,
          }
        },
        replace: true,
      })
    },
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
  })

  const { open } = useSidebar()

  const listOrderId = Object.keys(rowSelection)

  const handleCancelByStatus = async () => {
    actionsCancelModal.setOpen({
      step: "1_form_reason",
      listOrderId: listOrderId,
      status: search.processingStatus,
      callbackWhenSuccess: () => {
        table.setRowSelection({})
      },
    })
  }

  const mutationOnHoldOrder = useMutationPod(staffHoldOrder, {
    onSuccess: (res) => {
      refetchOnHoldAndResumeOrder()
      const successCount = res.successOrderIds?.length ?? 0
      const failedCount = res.failedOrders?.length ?? 0
      if (successCount > 0 || failedCount > 0) {
        toast({
          variant: failedCount > 0 ? "error" : "success",
          title: "On hold",
          description:
            failedCount > 0 ? (
              <div>
                <div>
                  {successCount} success
                  {failedCount > 0 && ` • ${failedCount} failed`}
                  {successCount > 0 && (
                    <p>
                      Please wait a moment while the system updates the status
                      from OMS. This may take a short time.
                    </p>
                  )}
                </div>
                {failedCount > 0 && (
                  <div className="mt-2">
                    <details className="group">
                      <summary className="cursor-pointer text-destructive underline hover:text-destructive/80 font-medium">
                        View reason failed
                      </summary>
                      <ul className="mt-2 list-disc list-inside text-destructive h-48 overflow-y-auto">
                        {res.failedOrders.map((fail) => (
                          <li key={fail.orderId}>
                            <span className="font-semibold tabular-nums">
                              {fail.orderId}:
                            </span>{" "}
                            {fail.message}
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                )}
              </div>
            ) : (
              "Please wait a moment while the system updates the status from OMS. This may take a short time."
            ),
        })
      }
    },
    onError: (err) => {
      toast({
        variant: "error",
        title: "On hold failed",
        description: err.rawMessage,
      })
    },
  })

  const handleSubmitOnHold = async (values: OnHoldOrdersType) => {
    await mutationOnHoldOrder.mutateAsync({
      ...values,
      orderIds: listOrderId,
    })
  }

  const handleOnHold = () => {
    setOpenOnHold({
      onHoldType: OnHoldType.HOLD,
      onSave: handleSubmitOnHold,
      title: "Reason for on-hold",
      description:
        "Please select a valid reason to proceed with putting the order on hold.",
    })
  }

  const handleMarkFulfill = async () => {
    if (listOrderId.length > 100) {
      toast({
        variant: "error",
        title: "Mark fulfilled",
        description: "You can only mark up to 100 orders at a time",
      })
      return
    }
    setOpenMarkFulfilled({
      onSave: async () => {
        table.setRowSelection({})
        onCloseMarkFulfilled()
      },
      orderIds: listOrderId,
    })
  }

  const mutationResumeOnHoldOrder = useMutationPod(staffResumeOrderOnHold, {
    onSuccess: (res) => {
      refetchOnHoldAndResumeOrder()
      const successCount = res.successOrderIds?.length ?? 0
      const failedCount = res.failedOrders?.length ?? 0
      if (successCount > 0 || failedCount > 0) {
        toast({
          variant: failedCount > 0 ? "error" : "success",
          title: "Resume order on-hold",
          description:
            failedCount > 0 ? (
              <div>
                <div>
                  {successCount} success
                  {failedCount > 0 && ` • ${failedCount} failed`}
                  {successCount > 0 && (
                    <p>
                      Please wait a moment while the system updates the status
                      from OMS. This may take a short time.
                    </p>
                  )}
                </div>
                {failedCount > 0 && (
                  <div className="mt-2">
                    <details className="group">
                      <summary className="cursor-pointer text-destructive underline hover:text-destructive/80 font-medium">
                        View reason failed
                      </summary>
                      <ul className="mt-2 list-disc list-inside text-destructive h-48 overflow-y-auto">
                        {res.failedOrders.map((fail) => (
                          <li key={fail.orderId}>
                            <span className="font-semibold tabular-nums">
                              {fail.orderId}:
                            </span>{" "}
                            {fail.message}
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                )}
              </div>
            ) : (
              "Please wait a moment while the system updates the status from OMS. This may take a short time."
            ),
        })
      }
    },
    onError: (err) => {
      toast({
        variant: "error",
        title: "Resume order on-hold failed",
        description: err.rawMessage,
      })
    },
  })

  const handleSubmitResumeOrderOnHold = async (values: OnHoldOrdersType) => {
    await mutationResumeOnHoldOrder.mutateAsync({
      ...values,
      orderIds: listOrderId,
    })
  }

  const handleResumeOnHold = () => {
    setOpenOnHold({
      onHoldType: OnHoldType.RESUME,
      onSave: handleSubmitResumeOrderOnHold,
      title: "Reason for resume on-hold",
      description:
        "Please select a valid reason to proceed with resuming the order on hold.",
    })
  }

  const refetchOnHoldAndResumeOrder = () => {
    onCloseOnHold()
    queryClient.invalidateQueries({
      queryKey: [
        staffCountOrderStatus.service.typeName,
        staffCountOrderStatus.name,
      ],
    })
    queryClient.invalidateQueries({
      queryKey: [staffListOrder.service.typeName, staffListOrder.name],
    })
  }

  const headerAction = useMemo(() => {
    const disabledRefundFull =
      search.processingStatus !== AllOrderStatus.CANCELLED &&
      search.processingStatus !== AllOrderStatus.SHIPPED
    const disabledCancel =
      search.processingStatus === AllOrderStatus.CANCELLED ||
      search.processingStatus === AllOrderStatus.SHIPPED
    const disabledBasePriceRefund =
      search.processingStatus !== AllOrderStatus.CANCELLED &&
      search.processingStatus !== AllOrderStatus.SHIPPED

    const disabledShippingFeeRefund =
      search.processingStatus !== AllOrderStatus.CANCELLED &&
      search.processingStatus !== AllOrderStatus.SHIPPED
    const disabledCustomRefund =
      search.processingStatus !== AllOrderStatus.CANCELLED &&
      search.processingStatus !== AllOrderStatus.SHIPPED

    const hasOnHold = [
      AllOrderStatus.AWAITING_FULFILLMENT,
      AllOrderStatus.IN_PRODUCTION,
      AllOrderStatus.PACKED,
    ]
    const hasResumeOnHold = [AllOrderStatus.ON_HOLD]
    const hasMarkFulfill = [AllOrderStatus.IN_PRODUCTION, AllOrderStatus.PACKED]

    const rowSelected = Object.keys(rowSelection).filter((key) => {
      return rowSelection[key]
    })
    const rowSelectedLength = rowSelected.length

    return (
      <div className="flex normal-case gap-3 items-center tabular-nums">
        Selected of {rowSelectedLength} of{" "}
        {table.getRowCount() ? table.getRowCount() : 0}
        {!disabledCancel && (
          <Button
            onClick={handleCancelByStatus}
            size={"sm"}
            variant={"destructive"}
            disabled={disabledCancel}
          >
            <XCircleIcon size={16} />
            <span>Cancel order</span>
          </Button>
        )}
        {hasMarkFulfill.includes(search.processingStatus) && (
          <Button onClick={handleMarkFulfill} size={"sm"} variant={"default"}>
            <TruckIcon size={16} />
            <span>Mark Fulfill</span>
          </Button>
        )}
        {hasOnHold.includes(search.processingStatus) && (
          <Button onClick={handleOnHold} size={"sm"} variant={"outline"}>
            <CirclePause size={16} />
            <span>On hold</span>
          </Button>
        )}
        {hasResumeOnHold.includes(search.processingStatus) && (
          <Button onClick={handleResumeOnHold} size={"sm"} variant={"outline"}>
            <CirclePlay size={16} />
            <span>Resume</span>
          </Button>
        )}
        <DropdownActions
          disabledRefundFull={disabledRefundFull}
          disabledCancel={disabledCancel}
          disabledBasePriceRefund={disabledBasePriceRefund}
          disabledShippingFeeRefund={disabledShippingFeeRefund}
          disabledCustomRefund={disabledCustomRefund}
          selectedOrders={selectedOrders}
          status={search.processingStatus}
          dropdownOpen={openDropdown}
          setDropdownOpen={setOpenDropdown}
          callbackSuccess={() => {
            table.setRowSelection({})
          }}
        />
      </div>
    )
  }, [rowSelection, openDropdown])

  return (
    <>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
      <div className="bg-background p-4 rounded-lg">
        <DataTable
          table={table}
          loading={loading}
          sticky
          reInitSticky={open}
          headerAction={headerAction}
        />
      </div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
    </>
  )
}
