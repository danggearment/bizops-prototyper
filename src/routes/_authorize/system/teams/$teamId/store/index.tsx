import LayoutTeam from "@/components/layout-team"
import TableStoreManagement from "@/routes/_authorize/system/teams/$teamId/store/-component/table-store/table-store-management.tsx"
import { StoreSearchSchema } from "@/schemas/schemas/store.ts"
import { PageHeader } from "@gearment/ui3"
import { createFileRoute, useParams } from "@tanstack/react-router"

export const Route = createFileRoute("/_authorize/system/teams/$teamId/store/")(
  {
    validateSearch: (search) => StoreSearchSchema.parse(search),
    beforeLoad: () => ({
      breadcrumb: [
        {
          name: "System",
          link: "/system/teams",
        },
        {
          name: "Teams",
          link: "/system/teams",
        },
        {
          name: "Stores",
          link: "#",
        },
      ],
    }),
    component: Index,
  },
)

function Index() {
  const params = useParams({
    from: "/_authorize/system/teams/$teamId/store/",
  })

  return (
    <>
      <LayoutTeam>
        <PageHeader>
          <PageHeader.Title>Store list</PageHeader.Title>
        </PageHeader>

        <TableStoreManagement teamId={params.teamId} />
      </LayoutTeam>
    </>
  )
}
