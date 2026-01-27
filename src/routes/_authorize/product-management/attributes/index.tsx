import { AttributesGroupSchema } from "@/schemas/schemas/attributes"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/_authorize/product-management/attributes/",
)({
  beforeLoad: async () => {
    throw redirect({
      to: "/product-management/attributes/group",
      search: AttributesGroupSchema.parse({}),
      replace: true,
    })
  },
  component: () => <></>,
})
