import LayoutTeam from "@/components/layout-team"
import FormStore from "@/routes/_authorize/system/teams/$teamId/store/$storeId/-component/form-store.tsx"
import { StoreSearchSchema } from "@/schemas/schemas/store.ts"
import { Button, PageHeader } from "@gearment/ui3"
import { createFileRoute, Link, useParams } from "@tanstack/react-router"
import { ArrowLeftIcon } from "lucide-react"

export const Route = createFileRoute(
  "/_authorize/system/teams/$teamId/store/$storeId/",
)({
  component: Index,
})

function Index() {
  const params = useParams({
    from: "/_authorize/system/teams/$teamId/store/$storeId/",
  })

  const teamId = params.teamId

  return (
    <LayoutTeam>
      <div className={"pb-8"}>
        <PageHeader>
          <div className={"flex items-center justify-center"}>
            <Link
              to="/system/teams/$teamId/store"
              params={{ teamId }}
              className={"mr-4 items-center flex"}
              search={StoreSearchSchema.parse({})}
            >
              <Button size="icon" variant="outline">
                <ArrowLeftIcon width={16} height={16} />
              </Button>
            </Link>
            <PageHeader.Title>Store Information</PageHeader.Title>
          </div>
        </PageHeader>

        <FormStore />
      </div>
    </LayoutTeam>
  )
}
