import {
  mappingColor,
  TeamTransactionTypeColorMapping,
} from "@/constants/map-color"
import CellCheckbox from "@/routes/_authorize/system/members/-component/table-staff/cell-checkbox.tsx"
import CellSelect from "@/routes/_authorize/system/members/-component/table-staff/cell-select.tsx"
import { StaffListTeamTransactionType } from "@/schemas/schemas/payment"
import { TeamTransactionType } from "@/services/connect-rpc/types"
import {
  StaffListTeamTransactionResponse,
  StaffTeamTransactionResponse,
} from "@gearment/nextapi/api/payment/v1/payment_admin_pb"
import { Badge, DataTable, TablePagination, useTable } from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import Filter from "../filter/filter"
import CellAmount from "./cell-amount"
import CellTransaction from "./cell-transaction"

interface Props {
  teamId: string
  data?: StaffListTeamTransactionResponse
  isLoading: boolean
}

const columnHelper = createColumnHelper<StaffTeamTransactionResponse>()

function TableTransactionManagement({ teamId, data, isLoading }: Props) {
  const search = useSearch({
    from: "/_authorize/system/teams/$teamId/transactions/",
  })

  const navigate = useNavigate({
    from: "/system/teams/$teamId/transactions",
  })

  const columns: ColumnDef<StaffTeamTransactionResponse, any>[] = useMemo(
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
                onChange: props.row.getToggleSelectedHandler(),
              }}
            />
          )
        },
      },
      columnHelper.accessor("txnId", {
        header: () => (
          <span className={"text-center whitespace-nowrap pr-2"}>
            Transaction ID
          </span>
        ),
        cell: ({ row }) => (
          <CellTransaction
            txnId={row.original.txnId}
            createdAt={row.original.createdAt}
            teamId={teamId}
          />
        ),
      }),
      columnHelper.accessor("methodIconUrls", {
        header: () => <span className="whitespace-nowrap">Payment method</span>,
        cell: ({ getValue }) => {
          const iconUrl = getValue()
          if (!iconUrl) return null
          return <img className="mx-auto" width="100" src={iconUrl} alt="" />
        },
      }),
      columnHelper.accessor("type", {
        header: () => <span className="block w-full text-center">Type</span>,
        cell: ({ getValue }) => (
          <span className="block w-full text-center">
            <Badge
              variant={mappingColor(
                TeamTransactionTypeColorMapping,
                getValue<TeamTransactionType>(),
              )}
            >
              {TeamTransactionType[getValue()]}
            </Badge>
          </span>
        ),
      }),
      columnHelper.accessor("amount", {
        header: () => (
          <span className="whitespace-nowrap text-right">Amount</span>
        ),
        cell: ({ getValue }) => {
          return <CellAmount amount={getValue()} />
        },
      }),
      columnHelper.accessor("email", {
        header: () => (
          <span className="whitespace-nowrap text-right">Email</span>
        ),
        cell: ({ getValue }) => {
          return <span className="block">{getValue()}</span>
        },
      }),
    ],
    [teamId],
  )

  const handleChangeSearch = (search: StaffListTeamTransactionType) => {
    navigate({
      search: (old) => ({
        ...old,
        ...search,
      }),
      replace: true,
    })
  }

  const table = useTable<StaffTeamTransactionResponse>({
    columns,
    data: data?.data || [],
    rowCount: Number(data?.total) || 0,
    pageCount: data?.totalPage || 0,
    state: {
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.limit,
      },
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
        search: (old) => ({
          ...old,
          page: newValue.pageIndex + 1,
          limit: newValue.pageSize,
        }),
        replace: true,
      })
    },
  })

  return (
    <div className="space-y-4">
      <div className="bg-background p-4 rounded-lg">
        <Filter handleChangeSearch={handleChangeSearch} />
      </div>
      <div>
        <div className="bg-background p-4 rounded-lg">
          <DataTable table={table} loading={isLoading} />
        </div>
        <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
      </div>
    </div>
  )
}

export default TableTransactionManagement
