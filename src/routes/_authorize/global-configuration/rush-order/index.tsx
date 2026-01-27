import { RushOrderSearchSchema } from "@/schemas/schemas/global-configuration"
import { TeamSearchSchema } from "@/schemas/schemas/team"
import ModalProductGroup from "@/services/modals/modal-product-group/modal-product-group"
import { useProductGroupStore } from "@/services/modals/modal-product-group/modal-product-group-store"
import { queryClient } from "@/services/react-query"
import { staffListRushProductGroup } from "@gearment/nextapi/api/pod/v1/product_admin-ProductAdminAPI_connectquery"
import { Button, PageHeader } from "@gearment/ui3"
import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
} from "@tanstack/react-router"
import { zodValidator } from "@tanstack/zod-adapter"
import { PlusIcon } from "lucide-react"
import ProductGroup from "./-components/product-group/product-group"
export const Route = createFileRoute(
  "/_authorize/global-configuration/rush-order/",
)({
  component: RouteComponent,
  validateSearch: zodValidator(RushOrderSearchSchema),
  search: {
    middlewares: [stripSearchParams(RushOrderSearchSchema.parse({}))],
  },
  staticData: {
    breadcrumb: [
      {
        name: "Global configuration",
        link: "#",
      },
      {
        name: "Rush order",
        link: "/global-configuration/rush-order",
      },
    ],
  },
})

function RouteComponent() {
  const { actions } = useProductGroupStore()
  const navigate = useNavigate({ from: "/global-configuration/rush-order" })
  return (
    <>
      <PageHeader>
        <div>
          <PageHeader.Title>Rush order</PageHeader.Title>
          <PageHeader.Description>
            Create and manage product groups for rush orders
          </PageHeader.Description>
        </div>
        <PageHeader.Action>
          <div className="flex justify-end items-center gap-2">
            <Button
              onClick={() =>
                navigate({
                  to: "/system/teams",
                  search: TeamSearchSchema.parse({}),
                })
              }
            >
              Configure Rush team
            </Button>
            <Button
              onClick={() =>
                actions.setOpen(true, () => {
                  queryClient.invalidateQueries({
                    queryKey: [
                      staffListRushProductGroup.service.typeName,
                      staffListRushProductGroup.name,
                    ],
                  })
                })
              }
            >
              <PlusIcon className="w-4 h-4" /> Create product group
            </Button>
          </div>
        </PageHeader.Action>
      </PageHeader>
      <ProductGroup />
      <ModalProductGroup />
    </>
  )
}
