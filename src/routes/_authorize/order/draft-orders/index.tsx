import {
  PageHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@gearment/ui3"
import { createFileRoute, stripSearchParams } from "@tanstack/react-router"

import { OrderDraftStatus } from "@/constants/order-draft-status.ts"
import {
  OrderDraftSearchSchema,
  OrderDraftSearchType,
} from "@/schemas/schemas/order-draft.ts"
import { ModalCancelOrder } from "@/services/modals/modal-cancel-order/modal-cancel.tsx"
import { ModalExportOrders } from "@/services/modals/modal-export-orders/modal-export-orders.tsx"
import { ModalReasonCancelOrders } from "@/services/modals/modal-reason-cancel-orders/modal-reason-cancel-orders.tsx"
import { useRefundOrder } from "@/services/modals/modal-refund-order/modal-refund-order-store"
import ModalRefundOrder from "@/services/modals/modal-refund-order/modal-refund-order.tsx"
import { zodValidator } from "@tanstack/zod-adapter"
import OrderDraftProvider, { useOrderDraft } from "./-all-orders-context.tsx"
import Filter from "./-component/filter/filter.tsx"
import TableAllOrder from "./-component/table/table.tsx"
import useTabs from "./-use-tabs.tsx"

export const Route = createFileRoute("/_authorize/order/draft-orders/")({
  validateSearch: zodValidator(OrderDraftSearchSchema),
  search: {
    middlewares: [stripSearchParams(OrderDraftSearchSchema.parse({}))],
  },
  beforeLoad: () => ({
    breadcrumb: [
      {
        link: "#",
        name: "Draft orders",
        search: undefined,
      },
    ],
  }),
  component: () => (
    <OrderDraftProvider>
      <Index />
    </OrderDraftProvider>
  ),
})

function Index() {
  const { handleSetFilter, setRowSelection, search } = useOrderDraft()

  const actionsRefundModal = useRefundOrder((state) => state.actions)
  const handleSelectTab = (value: OrderDraftStatus) => {
    const newFilter: OrderDraftSearchType = {
      ...search,
      page: 1,
      status: value,
    }
    setRowSelection({})
    actionsRefundModal.setSelectedOrders([])
    handleSetFilter(newFilter)
  }

  const tabs = useTabs()

  return (
    <>
      <PageHeader>
        <PageHeader.Title>Draft orders</PageHeader.Title>
      </PageHeader>

      <Filter />

      <Tabs
        value={search.status.toString()}
        onValueChange={(value) => handleSelectTab(Number(value))}
      >
        <TabsList className=" overflow-x-auto bg-sidebar justify-start">
          {tabs.map((tab) => (
            <TabsTrigger
              className="min-w-[160px]"
              key={tab.key}
              value={tab.key.toString()}
            >
              {tab.text}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value={search.status.toString()}>
          <TableAllOrder />
        </TabsContent>
      </Tabs>
      <ModalExportOrders />
      <ModalRefundOrder />
      <ModalCancelOrder />
      <ModalReasonCancelOrders />
    </>
  )
}
