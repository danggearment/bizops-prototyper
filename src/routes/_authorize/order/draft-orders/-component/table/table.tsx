import CellCheckbox from "@/components/common/cell-checkbox"
import CellTeam from "@/components/common/cell-team/cell-team"
import {
  mappingColor,
  OrderDraftStatusColorsMapping,
} from "@/constants/map-color.ts"
import { OrderDraftStatusLabel } from "@/constants/order-draft-status"
import {
  OrderDraft_Admin,
  OrderDraft_Status,
  OrderDraftStatus,
} from "@/services/connect-rpc/types"
import {
  Badge,
  DataTable,
  TablePagination,
  useSidebar,
  useTable,
} from "@gearment/ui3"
import { useNavigate } from "@tanstack/react-router"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useOrderDraft } from "../../-all-orders-context"
import CellDate from "./cell-date"
import CellOrder from "./cell-order"
import CellOrderStatus from "./cell-order-status"
import CellSelect from "./cell-select"
import CellTotal from "./cell-total"
import CellTracking from "./cell-tracking"

const columnHelper = createColumnHelper<OrderDraft_Admin>()

const columns: ColumnDef<OrderDraft_Admin, any>[] = [
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
    header: () => <span className="whitespace-nowrap">Order infomation</span>,
    cell: ({ row }) => <CellOrder row={row} orderId={row.original.draftId} />,
  }),

  columnHelper.accessor("teamCode", {
    header: () => <span className="whitespace-nowrap">Team information</span>,
    cell: (props) => {
      return (
        <CellTeam
          teamId={props.getValue()}
          teamName={props.row.original.teamName}
          teamOwnerEmail={props.row.original.teamOwnerEmail || ""}
          createdByEmail={props.row.original.createdByEmail || ""}
        />
      )
    },
  }),
  columnHelper.accessor("status", {
    header: () => <span className="block w-full">Status</span>,

    cell: ({ getValue }) => (
      <span className={"text-center"}>
        <Badge
          variant={mappingColor<OrderDraftStatus>(
            OrderDraftStatusColorsMapping,
            getValue<OrderDraftStatus>(),
          )}
        >
          {OrderDraftStatusLabel[getValue<OrderDraftStatus>()]}
        </Badge>
      </span>
    ),
  }),
  columnHelper.accessor("isProductMatched", {
    header: () => <span className="block w-full">Order status</span>,
    cell: ({ row }) => (
      <CellOrderStatus
        productMapped={row.original.isProductMatched}
        verifyAddress={row.original.isAddressVerified}
        approve={row.original.isApproved}
      />
    ),
  }),
  columnHelper.accessor("shippingMethod", {
    header: () => <span>Shipping method</span>,
    cell: ({ row }) => (
      <CellTracking
        isLabelAttached={row.original.isLabelAttached}
        shippingLabels={row.original.shippingLabels}
        shippingMethod={row.original.shippingMethod}
      />
    ),
  }),
  columnHelper.accessor("quantity", {
    header: () => <span className="block">Quantity</span>,
    cell: (props) => <p className="text-center">{props.getValue()}</p>,
  }),
  columnHelper.accessor("total", {
    header: () => <span className="block text-right">Total amount</span>,
    cell: (props) => <CellTotal total={props.getValue()} />,
  }),
  columnHelper.accessor("createdAt", {
    header: () => <p className="whitespace-nowrap">Date information</p>,
    cell: ({ row }) => (
      <CellDate
        createdAt={row.original.createdAt}
        approvedAt={row.original.approvedAt}
      />
    ),
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
  } = useOrderDraft()

  const navigate = useNavigate({
    from: "/order/draft-orders",
  })

  const table = useTable({
    columns,
    data: orderList,
    rowCount: rowCount,
    state: {
      rowSelection: rowSelection,
      columnVisibility: {
        select: search.status === OrderDraft_Status.ALL ? false : true,
        action: search.status === OrderDraft_Status.ALL ? false : true,
        status: search.status === OrderDraft_Status.ALL ? true : false,
      },
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.limit,
      },
    },

    getRowId: (row) => row.draftId,
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
  })

  const { open } = useSidebar()

  return (
    <>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
      <div className="bg-background p-4 rounded-lg">
        <DataTable table={table} loading={loading} sticky reInitSticky={open} />
      </div>
      <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
    </>
  )
}
