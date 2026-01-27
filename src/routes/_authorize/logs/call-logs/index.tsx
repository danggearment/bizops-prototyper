import { CallLogsTabLabel } from "@/constants/enum-label"
import {
  CallLogsSearchSchema,
  CallLogsTab,
  CallLogsTabType,
} from "@/schemas/schemas/call-logs"
import {
  PageHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@gearment/ui3"
import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import Filter from "./-components/filter"
import FinanceAPITable from "./-components/finance-api-table"
import StoreAPITable from "./-components/store-api-table"
import StoreWebhookTable from "./-components/store-webhook-table"
import VendorAPITable from "./-components/vendor-api-table"
import WebhookTable from "./-components/webhook-table"

export const Route = createFileRoute("/_authorize/logs/call-logs/")({
  validateSearch: zodValidator(CallLogsSearchSchema),
  search: {
    middlewares: [stripSearchParams(CallLogsSearchSchema.parse({}))],
  },
  component: RouteComponent,
  staticData: {
    breadcrumb: [
      {
        name: "Logs",
        link: "#",
      },
      {
        name: "Call logs",
        link: "/logs/call-logs",
      },
    ],
  },
})

function RouteComponent() {
  const search = Route.useSearch()
  const navigate = useNavigate({
    from: "/logs/call-logs",
  })
  const handleChangeTab = (tab: CallLogsTabType) => {
    navigate({
      search: (old) => {
        return {
          ...old,
          tab,
          page: 1,
        }
      },
      replace: true,
    })
  }

  return (
    <div className="space-y-4">
      <PageHeader>
        <div>
          <PageHeader.Title>Call logs</PageHeader.Title>
          <PageHeader.Description>
            Monitor API calls and webhook deliveries for troubleshooting and
            debugging
          </PageHeader.Description>
        </div>
      </PageHeader>

      <Filter />

      <Tabs
        value={search.tab}
        onValueChange={(tab: string) => handleChangeTab(tab as CallLogsTabType)}
        className="w-full"
      >
        <TabsList className="bg-sidebar">
          {Object.values(CallLogsTab.Values).map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {CallLogsTabLabel[tab]}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={CallLogsTab.Values["vendor-api"]}>
          <VendorAPITable />
        </TabsContent>

        <TabsContent value={CallLogsTab.Values["webhook"]}>
          <WebhookTable />
        </TabsContent>

        <TabsContent value={CallLogsTab.Values["store-api"]}>
          <StoreAPITable />
        </TabsContent>

        <TabsContent value={CallLogsTab.Values["store-webhook"]}>
          <StoreWebhookTable />
        </TabsContent>

        <TabsContent value={CallLogsTab.Values["finance-api"]}>
          <FinanceAPITable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
