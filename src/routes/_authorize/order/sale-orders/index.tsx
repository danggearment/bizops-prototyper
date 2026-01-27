import { AllOrderStatus } from "@/constants/all-orders-status.ts"
import {
  AllOrderSearchSchema,
  AllOrderSearchType,
} from "@/schemas/schemas/all-orders.ts"
import { useMutationPod } from "@/services/connect-rpc/transport.tsx"
import { ModalCancelOrder } from "@/services/modals/modal-cancel-order/modal-cancel.tsx"
import {
  EXPORT_CATEGORY,
  ExportContentType,
  ExportOrdersType,
  ExportType,
  useExportOrders,
} from "@/services/modals/modal-export-orders/modal-export-orders.ts"
import { ModalExportOrders } from "@/services/modals/modal-export-orders/modal-export-orders.tsx"
import { ModalMarkFulfilledOrders } from "@/services/modals/modal-mark-fulfilled-orders/modal-mark-fulfilled-orders.tsx"
import { ModalOnHoldOrders } from "@/services/modals/modal-on-hold-orders"
import { ModalReasonCancelOrders } from "@/services/modals/modal-reason-cancel-orders/modal-reason-cancel-orders.tsx"
import { useRefundOrder } from "@/services/modals/modal-refund-order/modal-refund-order-store"
import ModalRefundOrder from "@/services/modals/modal-refund-order/modal-refund-order.tsx"
import {
  staffExportOrder,
  staffExportOrderItems,
} from "@gearment/nextapi/api/pod/v1/admin_api-OrderAdminAPI_connectquery.ts"
import {
  FileAttachmentOrMessageResponse,
  FileAttachmentOrMessageResponse_File,
} from "@gearment/nextapi/common/type/v1/file_pb.ts"
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  PageHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
} from "@gearment/ui3"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { ChevronDownIcon } from "lucide-react"
import { useState } from "react"
import AllOrdersProvider, { useAllOrder } from "./-all-orders-context.tsx"
import Filter from "./-component/filter/filter.tsx"
import TableAllOrder from "./-component/table/table.tsx"
import useTabs from "./-use-tabs.tsx"

function downloadFile(file: FileAttachmentOrMessageResponse_File) {
  const blob = new Blob([file.data], { type: file.contentType })

  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = file.fileName
  document.body.appendChild(a)
  a.click()

  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const Route = createFileRoute("/_authorize/order/sale-orders/")({
  validateSearch: zodValidator(AllOrderSearchSchema),
  search: { middlewares: [stripSearchParams(AllOrderSearchSchema.parse({}))] },
  beforeLoad: () => ({
    breadcrumb: [
      {
        link: "#",
        name: "Sale orders",
        search: undefined,
      },
    ],
  }),
  component: () => (
    <AllOrdersProvider>
      <Index />
    </AllOrdersProvider>
  ),
})

function Index() {
  const { handleSetFilter, setRowSelection, search, filter } = useAllOrder()
  const actionsRefundModal = useRefundOrder((s) => s.actions)
  const [openDrawer, setOpenDrawer] = useState(false)
  const tabs = useTabs()

  const mutationExportOrders = useMutationPod(staffExportOrder, {
    onError: (e) =>
      toast({ variant: "destructive", description: e.rawMessage }),
  })
  const mutationExportItems = useMutationPod(staffExportOrderItems, {
    onError: (e) =>
      toast({ variant: "destructive", description: e.rawMessage }),
  })

  const handleSubmit = async (
    type: ExportContentType,
    values: ExportOrdersType,
  ) => {
    const isItem = type === EXPORT_CATEGORY.ITEM

    const mutation = isItem ? mutationExportItems : mutationExportOrders

    let response: FileAttachmentOrMessageResponse =
      new FileAttachmentOrMessageResponse()

    if (values.exportType === ExportType.ALL_RECORDS) {
      response = await mutation.mutateAsync({})
    } else {
      const payload = isItem
        ? { orderFilter: filter.filter, orderSearch: filter.search }
        : { filter: filter.filter, search: filter.search }
      response = await mutation.mutateAsync(payload)
    }

    if (response.data.case === "message") {
      toast({
        variant: "info",
        title: `Export ${isItem ? "items" : "orders"}`,
        description: response.data.value.message,
      })
    }
    if (response.data.case === "file") {
      downloadFile(response.data.value)
    }
  }

  const handleSelectTab = (val: AllOrderStatus) => {
    const newFilter: AllOrderSearchType = {
      ...search,
      page: 1,
      processingStatus: val,
      sortBy: [],
      sortDirection: [],
    }
    setRowSelection({})
    actionsRefundModal.setSelectedOrders([])
    handleSetFilter(newFilter)
  }

  const [setOpenExportOrders] = useExportOrders((s) => [s.setOpen])
  const openExportModal = (type: ExportContentType) => {
    setOpenDrawer(false)
    setOpenExportOrders({
      type,
      filter: filter,
      onSave: (exportType) => {
        handleSubmit(type, exportType)
      },
    })
  }

  return (
    <>
      <PageHeader>
        <PageHeader.Title>Sale Orders</PageHeader.Title>
        <PageHeader.Action>
          <DropdownMenu open={openDrawer} onOpenChange={setOpenDrawer}>
            <DropdownMenuTrigger>
              <Button className="flex items-center gap-2">
                Export <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => openExportModal("order")}>
                Export orders
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openExportModal("item")}>
                Export items
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </PageHeader.Action>
      </PageHeader>

      <Filter />

      <Tabs
        value={search.processingStatus.toString()}
        onValueChange={(v) => handleSelectTab(Number(v))}
      >
        <TabsList className="w-auto overflow-x-auto bg-sidebar justify-start">
          {tabs.map((t) => (
            <TabsTrigger key={t.key} value={t.key.toString()}>
              {t.text}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={search.processingStatus.toString()}>
          <TableAllOrder key={search.processingStatus} />
        </TabsContent>
      </Tabs>

      <ModalExportOrders />
      <ModalRefundOrder />
      <ModalCancelOrder />
      <ModalReasonCancelOrders />
      <ModalOnHoldOrders />
      <ModalMarkFulfilledOrders />
    </>
  )
}
