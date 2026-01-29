import {
  Button,
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
import { ArrowLeft, Mail, MoreHorizontal } from "lucide-react"
import { ClientDetailSearchSchema } from "@/schemas/schemas/client-detail"
import ClientDetailProvider, {
  useClientDetailContext,
} from "./-client-detail-context"
import ClientInfoCard from "./-components/overview/client-info-card"
import StatsCards from "./-components/overview/stats-cards"
import RecentActivity from "./-components/overview/recent-activity"
import OrdersTable from "./-components/orders/orders-table"
import PaymentsTable from "./-components/payments/payments-table"
import NotesList from "./-components/notes/notes-list"

export const Route = createFileRoute("/_authorize/client-listing/$clientId/")({
  validateSearch: zodValidator(ClientDetailSearchSchema),
  search: {
    middlewares: [stripSearchParams(ClientDetailSearchSchema.parse({}))],
  },
  component: () => (
    <ClientDetailProvider>
      <ClientDetailPage />
    </ClientDetailProvider>
  ),
  beforeLoad: ({ params }) => ({
    breadcrumb: [
      { link: "/client-listing", name: "Client Listing" },
      { link: `/client-listing/${params.clientId}`, name: "Client Detail" },
    ],
  }),
})

function ClientDetailPage() {
  const { client, loading } = useClientDetailContext()
  const search = Route.useSearch()
  const navigate = useNavigate()
  const params = Route.useParams()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <PageHeader>
        <PageHeader.Title>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: "/client-listing" })}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span>{client.name}</span>
          </div>
        </PageHeader.Title>
        <PageHeader.Actions>
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </PageHeader.Actions>
      </PageHeader>

      <Tabs
        value={search.tab}
        onValueChange={(tab) =>
          navigate({
            to: "/client-listing/$clientId",
            params: { clientId: params.clientId },
            search: {
              tab: tab as "overview" | "orders" | "payments" | "notes",
            },
          })
        }
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="orders">
            Orders ({client.orders.length})
          </TabsTrigger>
          <TabsTrigger value="payments">
            Payments ({client.payments.length})
          </TabsTrigger>
          <TabsTrigger value="notes">Notes ({client.notes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <StatsCards />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-1">
              <ClientInfoCard />
            </div>
            <div className="lg:col-span-2">
              <RecentActivity />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <OrdersTable />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentsTable />
        </TabsContent>

        <TabsContent value="notes">
          <NotesList />
        </TabsContent>
      </Tabs>
    </>
  )
}
