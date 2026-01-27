import { TeamLinkedPaymentMethodType } from "@/schemas/schemas/payment"
import { useQueryFinance } from "@/services/connect-rpc/transport"
import { Timestamp } from "@bufbuild/protobuf"
import { staffListLinkedPaymentMethod } from "@gearment/nextapi/api/payment/v1/payment_admin-PaymentAdminAPI_connectquery"
import { StaffLinkedPaymentMethodResponse } from "@gearment/nextapi/api/payment/v1/payment_admin_pb"
import { LinkedPaymentMethodStatus } from "@gearment/nextapi/api/payment/v1/payment_pb"
import { Badge, DataTable, TablePagination, useTable } from "@gearment/ui3"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import Filter from "../filter/filter"

interface Props {
  teamId: string
}

const columnHelper = createColumnHelper<StaffLinkedPaymentMethodResponse>()

const PaymentMethodTable = ({ teamId }: Props) => {
  const search = useSearch({
    from: "/_authorize/system/teams/$teamId/payment-methods/",
  })

  const navigate = useNavigate({
    from: "/system/teams/$teamId/payment-methods",
  })

  const { data, isPending } = useQueryFinance(
    staffListLinkedPaymentMethod,
    {
      page: search.page,
      limit: search.limit,
      teamId: teamId,
      filter: {
        paymentMethods: search.payment_methods,
        status: search.status,
      },
    },
    {
      select: (data) => ({
        paymentMethods: data.data,
        rowCount: Number(data.page || 0),
        pageCount: Math.ceil((data.limit || 0) / search.limit),
      }),
    },
  )

  const getStatusColor = (status: LinkedPaymentMethodStatus) => {
    switch (status) {
      case LinkedPaymentMethodStatus.ACTIVE:
        return "bg-green-100 text-green-800"
      case LinkedPaymentMethodStatus.INACTIVE:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatStatus = (status: LinkedPaymentMethodStatus) => {
    return LinkedPaymentMethodStatus[status]
      .replace("LINKED_PAYMENT_METHOD_STATUS_", "")
      .toLowerCase()
  }

  const formatDate = (timestamp: Timestamp | null | undefined) => {
    if (!timestamp) return "Never"
    return timestamp.toDate().toLocaleDateString()
  }

  const columns: ColumnDef<StaffLinkedPaymentMethodResponse, any>[] = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: () => <span className="whitespace-nowrap">Name</span>,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("extRef", {
        header: () => (
          <span className="whitespace-nowrap">Account identifier</span>
        ),
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("expiredAt", {
        header: () => <span className="whitespace-nowrap">Expired at</span>,
        cell: (info) => formatDate(info.getValue()),
      }),
      columnHelper.accessor("isPrimary", {
        header: () => <span className="whitespace-nowrap">Primary</span>,
        cell: (info) =>
          info.getValue() ? (
            <Badge className="bg-blue-100 text-blue-800">Primary</Badge>
          ) : (
            "-"
          ),
      }),
      columnHelper.accessor("status", {
        header: () => <span className="whitespace-nowrap">Status</span>,
        cell: (info) => (
          <Badge className={getStatusColor(info.getValue())}>
            {formatStatus(info.getValue())}
          </Badge>
        ),
      }),
    ],
    [],
  )

  const table = useTable({
    columns,
    data: data?.paymentMethods || [],
    rowCount: data?.rowCount || 0,
    pageCount: data?.pageCount || 0,
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

  const handleChangeSearch = (search: TeamLinkedPaymentMethodType) => {
    navigate({
      search: (old) => ({
        ...old,
        ...search,
      }),
      replace: true,
    })
  }

  return (
    <div className="space-y-4">
      <div className="bg-background p-4 rounded-lg">
        <Filter handleChangeSearch={handleChangeSearch} />
      </div>
      <div>
        <div className="bg-background p-4 rounded-lg">
          <DataTable table={table} loading={isPending} />
        </div>
        <TablePagination table={table} limitOptions={[50, 100, 200, 500]} />
      </div>
    </div>
  )
}

export default PaymentMethodTable
