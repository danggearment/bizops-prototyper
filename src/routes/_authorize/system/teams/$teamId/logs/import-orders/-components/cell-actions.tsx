import { DateTime } from "@/components/common/date-time"
import { OrderImportDetailStatusLabel } from "@/constants/enum-label"
import {
  ImportOrderDetailStatusColorsMapping,
  mappingColor,
} from "@/constants/map-color"
import {
  useMutationStudio,
  useQueryPod,
} from "@/services/connect-rpc/transport"
import {
  OrderAdmin_OrderDraftImport,
  OrderAdmin_OrderDraftImportSession,
  OrderAdmin_OrderDraftImportStatus,
} from "@gearment/nextapi/api/pod/v1/admin_api_type_pb"
import { staffListOrderImport } from "@gearment/nextapi/api/pod/v1/order_import_admin-OrderImportAdminAPI_connectquery"
import { staffDownloadTeamMedia } from "@gearment/nextapi/api/studio/v1/media_admin-MediaAdminManagement_connectquery"
import {
  Badge,
  Button,
  ButtonIconCopy,
  DataTable,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  LoadingCircle,
  TablePagination,
  toast,
  useTable,
} from "@gearment/ui3"
import { useParams } from "@tanstack/react-router"
import {
  CellContext,
  ColumnDef,
  createColumnHelper,
} from "@tanstack/react-table"
import { DownloadIcon, EyeIcon } from "lucide-react"
import { useState } from "react"

interface Props extends CellContext<OrderAdmin_OrderDraftImportSession, any> {}

export default function CellActions({ row }: Props) {
  const [open, setOpen] = useState(false)
  const { teamId } = useParams({
    from: "/_authorize/system/teams/$teamId/logs/import-orders/",
  })
  const pathError = row.original.pathError
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <EyeIcon size={16} />
        Details
      </Button>
      {open && (
        <div id="modal-view-detail">
          <ModalViewDetail
            pathError={pathError}
            open={open}
            setOpen={setOpen}
            importId={Number(row.original.id)}
            teamId={teamId}
          />
        </div>
      )}
    </div>
  )
}

const columnHelper = createColumnHelper<OrderAdmin_OrderDraftImport>()

const columns: ColumnDef<OrderAdmin_OrderDraftImport, any>[] = [
  columnHelper.accessor("draftId", {
    header: "ID",
    cell: ({ getValue, row }) => {
      const orderId = row.original.orderId
      const id = row.original.id

      return (
        <div className="text-sm flex items-center gap-2 text-gray-500">
          {getValue() || orderId || id}
          {(getValue() || orderId) && (
            <ButtonIconCopy
              size="sm"
              value={getValue() || orderId}
              copyValue={getValue() || orderId}
            />
          )}
        </div>
      )
    },
  }),
  columnHelper.accessor("refId", {
    header: "Ref ID",
    cell: ({ getValue }) => {
      return <div className="text-sm text-gray-500">{getValue() || "--"}</div>
    },
  }),

  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => {
      return (
        <Badge
          variant={mappingColor<OrderAdmin_OrderDraftImportStatus>(
            ImportOrderDetailStatusColorsMapping,
            getValue<OrderAdmin_OrderDraftImportStatus>(),
          )}
        >
          {
            OrderImportDetailStatusLabel[
              getValue<OrderAdmin_OrderDraftImportStatus>()
            ]
          }
        </Badge>
      )
    },
  }),
  columnHelper.accessor("createdAt", {
    header: () => <div className="text-right">Created at</div>,
    cell: ({ getValue }) => {
      return (
        <div className="text-right">
          <DateTime date={getValue()?.toDate() || ""} />
        </div>
      )
    },
    meta: {
      width: 150,
    },
  }),
]

const ModalViewDetail = ({
  open,
  setOpen,
  importId,
  teamId,
  pathError,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  importId: number
  teamId: string
  pathError: string
}) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const { data: importOrder, isPending } = useQueryPod(
    staffListOrderImport,
    {
      filter: {
        importIds: [BigInt(importId)],
        teamIds: [teamId],
      },
      pagination: {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      },
    },
    {
      enabled: open && !!importId,
    },
  )
  const table = useTable<OrderAdmin_OrderDraftImport>({
    data: importOrder?.data || [],
    columns,
    rowCount: Number(importOrder?.pagination?.total || 0),
    pageCount: Math.ceil(
      Number(importOrder?.pagination?.total || 0) / pagination.pageSize,
    ),
    state: {
      pagination: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
    },
    onPaginationChange: (updater) => {
      const newValue =
        updater instanceof Function
          ? updater({
              pageIndex: pagination.pageIndex,
              pageSize: pagination.pageSize,
            })
          : updater
      setPagination(newValue)
    },
  })

  const totalOrders = importOrder?.pagination?.total || 0
  const totalFailed =
    importOrder?.statuses.find(
      (status) => status.status === OrderAdmin_OrderDraftImportStatus.FAILED,
    )?.count || 0
  const totalSuccess =
    importOrder?.statuses.find(
      (status) => status.status === OrderAdmin_OrderDraftImportStatus.SUCCESS,
    )?.count || 0

  const mutation = useMutationStudio(staffDownloadTeamMedia, {
    onSuccess: (res) => {
      window.open(res.mediaUrl)
      toast({
        variant: "success",
        title: "Download import order",
        description: `Download failed import order file successfully`,
      })
    },
  })

  const handleDownload = async (key: string) => {
    await mutation.mutateAsync({
      mediaKey: key,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-screen w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>View import order detail</DialogTitle>
          <DialogDescription className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Total orders: {Number(totalOrders)} ({Number(totalSuccess)}{" "}
              success, {Number(totalFailed)} failed)
            </div>
            {totalFailed > 0 && pathError && (
              <Button
                variant="link"
                size="sm"
                className="px-0 text-primary"
                onClick={() => handleDownload(pathError)}
                style={{
                  paddingLeft: 0,
                  paddingRight: 0,
                }}
              >
                Download failed import order file <DownloadIcon size={16} />
              </Button>
            )}
          </DialogDescription>
        </DialogHeader>
        {isPending && (
          <div className="flex justify-center items-center min-h-20 h-full">
            <LoadingCircle size="sm" />
          </div>
        )}
        {!isPending && (
          <div className="">
            <div
              id="modal-view-detail-table"
              className="max-h-[50vh] overflow-y-auto"
            >
              <DataTable table={table} containerRefId="modal-view-detail" />
            </div>
            <TablePagination table={table} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
